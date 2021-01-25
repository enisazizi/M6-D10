module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("product", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
     
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: false }
    );
  
    Product.associate = (models) => {
      Product.hasMany(models.Review)
      Product.hasMany(models.Cart);
      Product.belongsToMany(models.User, {
        through: { model: models.Cart, unique: false },
      });
    };
  
    return Product;
  };
  