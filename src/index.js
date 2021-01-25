const express = require("express")
require("dotenv").config()
const cors = require("cors")
const productsRouter = require("./services/products")
const reviewsRouter = require("./services/reviews")
const cartsRouter = require("./services/cart")
const usersRouter = require("./services/users")


const db = require("./db")

const server = express()

server.use(cors())

server.use(express.json())

server.use("/products",productsRouter)
 server.use("/reviews",reviewsRouter)
server.use("/carts",cartsRouter)
server.use("/users",usersRouter)

db.sequelize.sync({ force: false }).then((result) => {
    server.listen(process.env.PORT || 3400, () => {
      console.log("server is running on port ", process.env.PORT || 3400);
    });
  });