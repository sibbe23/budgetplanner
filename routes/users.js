const express=require('express');

const userControllers=require('../controllers/users');

const router=express.Router();

router.post('/signup',userControllers.addUsers);

router.post('/login',userControllers.login);


module.exports=router;
