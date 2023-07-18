const express=require('express');

const router=express.Router();

const premiumControllers=require('../controllers/premium')

router.get('/leaderboard',premiumControllers.showLeaderBoard);

module.exports=router;