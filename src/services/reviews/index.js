const express = require("express")

const Review = require("../../db").Review
const router = express.Router()

router
  .route("/")
  .get(async(req,res,next)=>{
      try {
          const data = await Review.findAll()
          res.send(data)
      } catch (error) {
          console.log(error)
          next(error)
      }
  })
  .post(async(req,res,next)=>{
      try {
         const newReview = await Review.create(req.body)
         res.status(201).send(newReview) 
      } catch (error) {
          next(error)
      }
  })

router
  .route("/:id")
  .get(async(req,res,next)=>{
      try {
          const data = await Review.findByPl(req.params.id)
          res.send(data)
      } catch (error) {
          next(error)
      }
  })
  .put(async(req,res,next)=>{
      try {
         const updatedReview = await Review.update(req.body,{
             returning:true,
             plain:true,
             where:{
                 id: req.params.id
             }
         }) 
         res.send(updatedReview[1])
      } catch (error) {
          next(error)
      }
  })
  .delete(async (req, res, next) => {
    try {
      Review.destroy({ where: { id: req.params.id } }).then((rowsDeleted) => {
        if (rowsDeleted > 0) res.send("Deleted");
        else res.send("no match");
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  });

  module.exports = router