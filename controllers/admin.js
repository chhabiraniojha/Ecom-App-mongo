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
  console.log("hi")
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product =new Product({title,price,imageUrl,description,userId:req.user._id});
  product.save()
  .then(result=>{
    console.log(result)
    res.redirect('/admin/products');
  })
  .catch(err=>console.log(err))
  
};

exports.getProducts = (req, res, next) => {
  Product.find()
  .then((products)=>{
    // console.log(rows)
    res.render('admin/products', {
      prods: products,
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
  Product.findByIdAndDelete(productId)
  .then(
    res.redirect("/admin/products")
  ).catch(err=>console.log(err))
  
  Product.findById(productId,(product)=>{
        console.log(product)
  })
};

exports.getEditProduct = async (req, res, next) => {
    const prodId = req.params.productId;

    try {
        const product = await Product.findById(prodId);

        if (!product) {
            return res.redirect('/admin/products');
        }

        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            product: product
        });
    } catch (err) {
        console.error(err);
        res.redirect('/admin/products');
    }
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.id; // Extract product ID from the form
  const updatedTitle = req.body.title; // Updated product title
  const updatedImageUrl = req.body.imageUrl; // Updated product image URL
  const updatedPrice = req.body.price; // Updated product price
  const updatedDescription = req.body.description; // Updated product description

  // Create an object with the updated product fields
  const updatedProduct = {
    title: updatedTitle,
    price: updatedPrice,
    imageUrl: updatedImageUrl,
    description: updatedDescription
  };

  // Call the updateProduct method to update the product in the database
  Product.findByIdAndUpdate(prodId, updatedProduct)
    .then((result) => {
      console.log('Product updated:', result);
      res.redirect('/admin/products'); // Redirect to the product list page
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/admin/products'); // Redirect to the product list page if error occurs
    });
};

// exports.postDeleteProduct = (req, res, next) => {
//   const productId = req.params.productId; // Extract product ID from the URL

//   // Call the static method `deleteById` from the Product model to delete the product
//   Product.deleteById(productId)
//     .then(() => {
//       console.log(`Product with ID: ${productId} deleted successfully`);
//       res.redirect('/admin/products'); // Redirect back to the products list page after deletion
//     })
//     .catch((err) => {
//       console.log(err);
//       res.redirect('/admin/products'); // Redirect back to the products list page if an error occurs
//     });
// };