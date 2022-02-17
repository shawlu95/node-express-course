require('dotenv').config();
const connectDB = require("./db/connect");
const Product = require("./models/product");
const products = require("./products.json");

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log("Connected to db.");

        await Product.deleteMany();
        await Product.create(products);
        console.log("Loaded products:", products.length);

        process.exit(0); // 0 means ok
    } catch (error) {
        console.log("Failed to connect db", error);
        process.exit(1); // 1 means error
    }
}

start();