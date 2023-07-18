const purchaseControllers=require('../controllers/purchase');

const userAuthentication=require('../middleware/authorization');

const express=require('express');

const router=express.Router();

router.get('/premiummembership',userAuthentication.authenticate,purchaseControllers.purchasePremium);

router.post('/updatetransactionstatus',userAuthentication.authenticate,purchaseControllers.updateTransactionStatus);


module.exports=router;