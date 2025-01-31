const getDb = require("../util/database").getDb;
const { ObjectId } = require("mongodb")
const Product = require('../models/product');
const Order = require('../models/order')
const User = require("../models/user");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(rows => {
      // console.log(rows[0]._id.toString())
      res.render('shop/product-list', {
        prods: rows,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch((err) => {
      console.log(err)
    })
};

exports.getProductDetails = (req, res, next) => {
  const productId = req.params.productId;
  console.log(productId)
  Product.findById(productId)
    .then(product => {
      console.log(product)
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products/productId'
      });
    }).catch(err => console.log(err))
};

// exports.getIndex = (req, res, next) => {
//   Product.fetchAll()
//     .then(([rows,fieldData])=>{
//       res.render('shop/index', {
//         prods: rows,
//         pageTitle: 'Shop',
//         path: '/'
//       });
//     })
//     .catch((err)=>{
//             console.log(err)
//     })

// };

exports.postCart = async (req, res, next) => {
  const productId = req.body.productId;
  const prod = await Product.findById(productId)
  // console.log(prod)
  const addingToCart = await req.user.addToCart(prod._id)
  res.redirect('/cart')
};

// exports.getCart = (req, res, next) => {
//   res.render('shop/cart', {
//     path: '/cart',
//     pageTitle: 'Your Cart'
//   });
// };


exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const cartItems = await Promise.all(
      user.cart.items.map(async (cartItem) => {
        const product = await Product.findById(cartItem.productId);
        return { product, qty: cartItem.qty };
      })
    );
    // console.log(cartItems)
    res.render('shop/cart', {
      pageTitle: 'Your Cart', // ✅ Add this
      path: '/cart',
      cart: { items: cartItems } // ✅ Ensure cart data is passed
    });
  } catch (error) {
    console.error(error);
  }
};

exports.postDeleteCartItem = async (req, res, next) => {
  const productId = req.body.productId;
  console.log("deleted")
  try {
    const user = await User.findById(req.user._id);
    const updatedCartItems = user.cart.items.filter(item => item.productId.toString() !== productId);

    await User.updateOne(
      { _id: new ObjectId(req.user._id) },
      { $set: { cart: { items: updatedCartItems } } }
    );

    res.redirect("/cart");
  } catch (error) {
    console.error(error);
    res.redirect("/cart");
  }
};

exports.getOrders = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user info is stored in req.user

    // Fetch orders for the logged-in user
    const orders = await Order.find({ userId: new ObjectId(userId) });

    res.render("shop/orders", {
      pageTitle: "Your Orders",
      path: "/orders",
      orders: orders
    });

  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getCheckout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.cart || user.cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    const productIds = user.cart.items.map((item) => item.productId);

    const products = await Product.find({ _id: { $in: productIds } });

    const orderItems = user.cart.items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.productId.toString());
      return { product, qty: item.qty };
    });

    const order = new Order({
      userId: user._id,
      items: orderItems,
      totalAmount: orderItems.reduce((total, item) => total + item.qty * item.product.price, 0),
      createdAt: new Date(),
    });

    // Insert the order
    await order.save()

    // Clear the user's cart after order creation
    await User.updateOne(
      { _id: user._id },
      { $set: { cart: { items: [] } } }
    );


    res.redirect("/orders");
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).send("Internal Server Error");
  }
};
