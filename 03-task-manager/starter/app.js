require("dotenv").config();

const express = require('express');
const app = express();
const tasks = require("./routes/tasks");
const { connectDB } = require("./db/connect")
const notFound = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

app.use(express.static("./public"));
app.use(express.json());
app.use("/api/v1/tasks", tasks);

// custom response for 404
app.use(notFound);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;
// start server only if DB connection is successful
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`server is listening: ${port}`));
  } catch (err) {
    console.log(err)
  }
}

start();
