const {Sequelize , DataTypes} = require("sequelize")
const Product =  require("./product")
const Cart = require("./cart");
const Review = require("./review");
const User = require("./user");


const sequelize = new Sequelize(
    process.env.PGDATABASE,
    process.env.PGUSER,
    process.env.PGPASSWORD,
    {
        host:process.env.PGHOST,
        dialect:"postgres",
    }
)

const models = {
    User: User(sequelize,DataTypes),
    Review: Review(sequelize,DataTypes),
    Cart: Cart(sequelize,DataTypes),
    Product: Product(sequelize,DataTypes),

}
Object.keys(models).forEach((modelName) => {
    if ("associate" in models[modelName]) {
      models[modelName].associate(models);
    }
  })

models.sequelize = sequelize;
models.Sequelize = Sequelize;

sequelize
.authenticate()
.then(()=> console.log("It's Connected"))
.catch((e)=> console.log("Connection failed",e))

module.exports = models