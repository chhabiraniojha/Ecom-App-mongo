const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect(
        'mongodb+srv://suvransu:rinku@cluster0.kgx79.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0'
    )
        .then((client) => {
            console.log("Connected to MongoDB");
            _db = client.db(); // Store the database reference
            callback(); // Execute the callback function after connection
        })
        .catch((err) => {
            console.error("Failed to connect to MongoDB:", err);
            throw err; // Stop execution on error
        });
};

const getDb = () => {
    if (_db) {
        return _db; // Return the database instance if it exists
    }
    throw new Error("No database found"); // Use an Error object for better debugging
};

// Export the functions
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
