const express = require("express")

const User = require("../../db").User
const router = express.Router()

router
  .route("/")
  .get(async(req,res,next)=>{
      try {
          const data = await User.findAll()
          res.send(data)
      } catch (error) {
          console.log(error)
          next(error)
      }
  })
  .post(async(req,res,next)=>{
      try {
         const newUser = await User.create(req.body)
         res.status(201).send(newUser) 
      } catch (error) {
          next(error)
      }
  })

router
  .route("/:id")
  .get(async(req,res,next)=>{
      try {
          const data = await User.findByPl(req.params.id)
          res.send(data)
      } catch (error) {
          next(error)
      }
  })
  .put(async(req,res,next)=>{
      try {
         const updatedUser = await User.update(req.body,{
             returning:true,
             plain:true,
             where:{
                 id: req.params.id
             }
         }) 
         res.send(updatedUser[1])
      } catch (error) {
          next(error)
      }
  })
  .delete(async (req, res, next) => {
    try {
      User.destroy({ where: { id: req.params.id } }).then((rowsDeleted) => {
        if (rowsDeleted > 0) res.send("Deleted");
        else res.send("no match");
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  });

  module.exports = router