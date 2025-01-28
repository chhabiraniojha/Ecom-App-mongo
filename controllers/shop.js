const Product = require('../models/product');


exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(([rows,fieldData])=>{
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
   Product.findById(productId)
   .then(([product])=>{
    
    res.render('shop/product-detail', {
      product: product[0],
      pageTitle: product[0].title,
      path: '/products'
    });
   }).catch(err=>console.log(err))
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows,fieldData])=>{
      res.render('shop/index', {
        prods: rows,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch((err)=>{
            console.log(err)
    })
  
};

exports.postCart = (req, res, next) => {
  const productId=req.body.productId;
  Product.findById(productId,(product) => {
    Cart.addProduct(productId,product.price)
    res.redirect("/cart")
      // Cart.addProduct(productId,)
  })
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart'
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
