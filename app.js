require("dotenv").config();
const express = require("express");
const db = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const ProductRouter = require("./routes/product");
const UserRouter = require("./routes/user");

//middleware start here
app.use(cors({ origin: "https://first-project-b7540.web.app", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//route handler
app.use("/product", ProductRouter);
app.use("/user", UserRouter);

const port = process.env.PORT || 3003;

app.listen(port, "0.0.0.0", () => {
  console.log(`app running on port ${port}`);
  db();
});
