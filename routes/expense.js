
const express=require('express');

const expenseControllers=require('../controllers/expense');
const userAuthentication=require('../middleware/authorization');


const router=express.Router();

router.post('/add-expense',userAuthentication.authenticate,expenseControllers.addExpense);

router.get('/get-expenses',userAuthentication.authenticate,expenseControllers.getExpenses);

router.delete('/delete-expense/:id',userAuthentication.authenticate,expenseControllers.deleteExpense);

router.get('/download',userAuthentication.authenticate,expenseControllers.downloadExpenses);

router.get('/downloadedfiles',userAuthentication.authenticate,expenseControllers.downlodedExpenses);

module.exports=router;