const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            product: {} ,
            qty: { type: Number, required: true }
        }
    ],
    totalAmount:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date
    }
});

module.exports = mongoose.model("Order", orderSchema);

