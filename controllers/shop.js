const Product = require('../models/product');


exports.getProducts = (req, res, next) => {
    Product.fetchAll()
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
   Product.fetchProductById(productId)
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
  console.log(prod)
  const addingToCart=await req.user.addToCart(prod._id)
  return res.status(200).json("success")
};

// exports.getCart = (req, res, next) => {
//   res.render('shop/cart', {
//     path: '/cart',
//     pageTitle: 'Your Cart'
//   });
// };

// exports.getOrders = (req, res, next) => {
//   res.render('shop/orders', {
//     path: '/orders',
//     pageTitle: 'Your Orders'
//   });
// };

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout'
//   });
// };
