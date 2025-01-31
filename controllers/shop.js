const getDb=require("../util/database").getDb;
const {ObjectId}=require("mongodb")
const Product = require('../models/product');
const User = require("../models/user");

exports.getProducts = (req, res, next) => {
    Product.find()
    .then(rows=>{
      // console.log(rows[0]._id.toString())
      res.render('shop/product-list', {
        prods: rows,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch((err)=>{
            console.log(err)
    })
};

exports.getProductDetails = (req, res, next) => {
  const productId=req.params.productId;
  console.log(productId)
   Product.findById(productId)
   .then(product=>{
    console.log(product)
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products/productId'
    });
   }).catch(err=>console.log(err))
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
  const productId=req.body.productId;
  const prod=await Product.fetchProductById(productId)
  // console.log(prod)
  const addingToCart=await req.user.addToCart(prod._id)
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
        const user = await User.findUserById(req.user._id);
        const cartItems = await Promise.all(
            user.cart.items.map(async (cartItem) => {
                const product = await Product.fetchProductById(cartItem.productId);
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
      const user = await User.findUserById(req.user._id);
      const updatedCartItems = user.cart.items.filter(item => item.productId.toString() !== productId);
      
      await getDb().collection("users").updateOne(
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
    const db = getDb();
    const userId = req.user._id; // Assuming user info is stored in req.user

    // Fetch orders for the logged-in user
    const orders = await db.collection("orders").find({ userId: new ObjectId(userId) }).toArray();

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
    const user = await User.findUserById(req.user._id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    const userInstance = new User(user._id, user.name, user.email, user.cart);
    await userInstance.addOrder();

    res.redirect("/orders");
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).send("Internal Server Error");
  }
};
