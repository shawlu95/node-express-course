require('dotenv').config();

const express = require("express");
const connectDB = require("./db/connect");
const products = require("./routes/products");

const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");
const { application } = require('express');

app.use(express.json());
app.get("/", (req, res) => {
    res.send("OK")
});

app.use("/api/v1/products", products);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        // connectDB
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => console.log(`Server is listening port ${port}...`));
      } catch (error) {
        console.log(error);
      }
}

start();