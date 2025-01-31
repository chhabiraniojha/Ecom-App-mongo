const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items :[
      {
        productId:{type:Schema.Types.ObjectId,ref:"Product",required:true},
        qty:{type:Number,required:true}
      }
    ]
  },
  
});


userSchema.methods.addToCart=function(productId){

    let updatedCartItems = this.cart.items?this.cart.items:[];
    console.log(updatedCartItems)
    console.log(productId)
    if(updatedCartItems.length!==0){
      const existingProductIndex = updatedCartItems.findIndex(
        item => item.productId.toString() === productId.toString()
      );
      if (existingProductIndex !== -1) {
        updatedCartItems[existingProductIndex].qty += 1;
      }else {
        console.log("k")
        updatedCartItems.push({ productId: productId, qty: 1 });
      }
    }else {
      console.log("k")
      updatedCartItems.push({ productId: productId, qty: 1 });
    }

    const updatedCart = { items: updatedCartItems };
    console.log(updatedCart)
    this.cart=updatedCart
    return this.save()

    // const updateCart=await db.collection("users").updateOne(
    //   {_id:new ObjectId(this._id)},
    //   {$set:{cart:updatedCart}}
// )
}

module.exports = mongoose.model("User", userSchema); 


// const { ObjectId } = require("mongodb")
// const getDb = require("../util/database").getDb;

// class User {
//   constructor(id, name, email, cart) {
//     this._id = id;
//     this.name = name;
//     this.email = email;
//     this.cart = cart;

//   }

//   save() {
//     const db = getDb();
//     return db.collection('users')
//       .insertOne(this)
//       .then(res => {
//         console.log(res)
//       })
//       .catch(err => {
//         console.log(err)
//       })
//   }

//   async addToCart(productId) {
//     const db = getDb()

//     let updatedCartItems = this.cart.items?this.cart.items:[];
//     console.log(updatedCartItems)
//     console.log(productId)
//     if(updatedCartItems.length!==0){
//       const existingProductIndex = updatedCartItems.findIndex(
//         item => item.productId.toString() === productId.toString()
//       );
//       if (existingProductIndex !== -1) {
//         updatedCartItems[existingProductIndex].qty += 1;
//       }else {
//         console.log("k")
//         updatedCartItems.push({ productId: new ObjectId(productId), qty: 1 });
//       }
//     }else {
//       console.log("k")
//       updatedCartItems.push({ productId: new ObjectId(productId), qty: 1 });
//     }

//     const updatedCart = { items: updatedCartItems };
//     console.log(updatedCart)

//     const updateCart=await db.collection("users").updateOne(
//       {_id:new ObjectId(this._id)},
//       {$set:{cart:updatedCart}}
//     )
    
//   }
  
//   async addOrder() {
  //   const db = getDb();

  //   // Fetch the user's cart
  //   const user = await db.collection("users").findOne({ _id: new ObjectId(this._id) });

  //   if (!user || !user.cart || user.cart.items.length === 0) {
  //     throw new Error("Cart is empty");
  //   }

  //   // Get product details for each item in the cart
  //   const productIds = user.cart.items.map((item) => item.productId);
  //   const products = await db.collection("products").find({ _id: { $in: productIds } }).toArray();

  //   const orderItems = user.cart.items.map((item) => {
  //     const product = products.find((p) => p._id.toString() === item.productId.toString());
  //     return { product, qty: item.qty };
  //   });

  //   const order = {
  //     userId: new ObjectId(this._id),
  //     items: orderItems,
  //     totalAmount: orderItems.reduce((total, item) => total + item.qty * item.product.price, 0),
  //     createdAt: new Date(),
  //   };

  //   // Insert the order
  //   await db.collection("orders").insertOne(order);

  //   // Clear the user's cart after order creation
  //   await db.collection("users").updateOne(
  //     { _id: new ObjectId(this._id) },
  //     { $set: { cart: { items: [] } } }
  //   );
  // }
  // //  static fetchAll=async ()=>{
  // //   const db=getDb();
  // //   const products= await db.collection('products').find().toArray()
  // //   return products
//   //  }

//   static findUserById = async (userId) => {
//     // console.log(userId)
//     const db = getDb();
//     const user = await db.collection('users').find({ _id: new ObjectId(userId) }).next()
//     return user
//   }

//   //  static updateProduct = async (id, updatedData) => {
//   //   const db = getDb();
//   //   const result = await db
//   //     .collection("products")
//   //     .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
//   //   return result;
//   // };

//   // static deleteById = async (id) => {
//   //   const db = getDb();
//   //   const result = await db
//   //     .collection("products")
//   //     .deleteOne({ _id: new ObjectId(id) }); // Delete product by ObjectId
//   //   return result;
//   // };

// }


// module.exports = User;



// // const Sequelize=require('sequelize');

// // const sequelize=require('../util/database');


// // const User=sequelize.define('product',{
// //   id:{
// //     type:Sequelize.INTEGER,
// //     autoIncrement:true,
// //     allowNull:false,
// //     primaryKey:true
// //   },
// //   name:{
// //     type:Sequelize.STRING,
// //     allowNull:false,
// //   },
// //   email:{
// //     type:Sequelize.STRING,
// //     allowNull:false,
// //   }
// // });

// // module.exports=User;