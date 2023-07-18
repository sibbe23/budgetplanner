const express=require('express');

const userAuthentication=require('../middleware/authorization');
const passwordControllers=require('../controllers/forgotpassword');
const router=express.Router();

router.post('/forgotpassword',passwordControllers.forgotpassword);

router.get('/resetpassword/:id',passwordControllers.resetpassword);

router.get('/updatepassword/:id',passwordControllers.updatepassword);

module.exports=router;