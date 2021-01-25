const express = require("express");
const multer = require("multer")
const {CloudinaryStorage} = require("multer-storage-cloudinary")
const Product = require("../../db").Product;
const Review = require("../../db").Review
const { Op } = require("sequelize");
const router = express.Router();
const cloudinary = require("../../utils/cloudinary")
const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'AmazonaPhotos'
    }
})

const cloudMulter = multer({storage:storage})

router
  .route("/")
  .get(async (req, res, next) => {
    try {
        if(req.query.category ){
            const data = await Product.findAll({
                where: { category: req.query.category }
            });
            res.send(data);
           
        }
        else if(req.query.name) {
            const data = await Product.findAll({
                where: { name: req.query.name }
            });
            res.send(data);
        }
        else{
            const data = await Product.findAll();
            res.send(data);
        }
     console.log(req.query.category, "adasdada")
     
    } catch (e) {
      console.log(e);
      next(e);
    }
  })
  .post(async (req, res, next) => {
    try {
      const newElement = await Product.create(req.body);
      res.send(newElement);
    } catch (e) {
      console.log(e);
      next(e);
    }
  });

router
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const data = await Product.findByPk(req.params.id);
      res.send(data);
    } catch (e) {
      console.log(e);
      next(e);
    }
  })
  .put(async (req, res, next) => {
    try {
      const updatedData = await Product.update(req.body, {
        returning: true,
        plain: true,
        where: {
          id: req.params.id,
        },
      });
      res.send(updatedData[1]);
    } catch (e) {
      console.log(e);
      next(e);
    }
  })
  .delete(async (req, res, next) => {
    try {
      Product.destroy({ where: { id: req.params.id } }).then((rowsDeleted) => {
        if (rowsDeleted > 0) res.send("Deleted");
        else res.send("no match");
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  });

  router 
    .route("/:id/review")
    .get(async(req,res,next)=>{
        try {
            const data = await Product.findAll({
                include : [{model:Review}],
               group: ["reviews.id","product.id"], // it doesnt do anything just one more line 
                where : {id:req.params.id}
            })
            res.send({reviews:data})
        } catch (error) {
            next(error)
        }
    })
    router 
    .route("/:id/upload")
    .post(cloudMulter.single("image"), async (req, res, next) => {
      try {
          console.log(req.body,req.file)
        const uploadImage = await Product.update(
          { ...req.body, imageUrl: req.file.path },
          {
            returning: true,
  
            where: {
              id: req.params.id,
            },
          }
        );
        if (uploadImage[1].length > 0) {
          const image = uploadImage[1];
          res.status(201).send(image[0]);
        } else {
          const err = new Error();
          err.message = `Product id: ${req.params.id} not found!`;
          err.httpStatusCode = 404;
          next(err);
        }
      } catch (error) {
        console.log(error);
        next(error);
      }
    });
  

module.exports = router;
