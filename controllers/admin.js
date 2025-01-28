const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.create({
    title:title,
    price:price,
    imageUrl:imageUrl,
    description:description
  })
  .then(result=>{
    console.log(result)
  })
  .catch(err=>console.log(err))
  
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(([rows,fieldData])=>{
    console.log(rows)
    res.render('admin/products', {
      prods: rows,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err=>{
    console.log(err)
  })
};

exports.postDeleteProduct = (req, res, next) => {
  const productId=req.params.productId;
  Product.deleteById(productId)
  .then(
    res.redirect("/admin/products")
  ).catch(err=>console.log(err))
  
  Product.findById(productId,(product)=>{
        console.log(product)
  })
};

