const {ObjectId}=require("mongodb")
const getDb=require("../util/database").getDb;

class Product{
   constructor(title,price,imageUrl,description,userId){
     this.title=title;
     this.price=price;
     this.imageUrl=imageUrl;
     this.description=description;
     this.userId=userId;
   }

   save(){
    const db=getDb();
    return db.collection('products')
    .insertOne(this)
    .then(res=>{
      console.log(res)
    })
    .catch(err=>{
      console.log(err)
    })
   }

   static fetchAll=async ()=>{
    const db=getDb();
    const products= await db.collection('products').find().toArray()
    return products
   }
   
   static fetchProductById=async (productId)=>{
    console.log(productId)
    const db=getDb();
    const product= await db.collection('products').find({_id:new ObjectId(productId)}).next()
    console.log(product)
    return product
   }

   static updateProduct = async (id, updatedData) => {
    const db = getDb();
    const result = await db
      .collection("products")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
    return result;
  };

  static deleteById = async (id) => {
    const db = getDb();
    const result = await db
      .collection("products")
      .deleteOne({ _id: new ObjectId(id) }); // Delete product by ObjectId
    return result;
  };

}


module.exports=Product;

// const Sequelize=require('sequelize');

// const sequelize=require('../util/database');


// const Product=sequelize.define('product',{
//   id:{
//     type:Sequelize.INTEGER,
//     autoIncrement:true,
//     allowNull:false,
//     primaryKey:true
//   },
//   title:Sequelize.STRING,
//   price:{
//     type:Sequelize.DOUBLE,
//     allowNull:false
//   },
//   imageUrl:{
//     type:Sequelize.STRING,
//     allowNull:false
//   },
//   description:{
//     type:Sequelize.STRING,
//     allowNull:false
//   }
// });

// module.exports=Product;