
const { where } = require('sequelize');

const Expense=require('../models/expense');
const Downloadfile=require('../models/downlodedfile')
const sequelize = require('../util/database');
const AWS=require('aws-sdk');



function isStringInvalid(string){
    if(string.length===0 || string==undefined){
        return true;
    }else{
        return false;
    }
}

exports.addExpense=async(req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        const {amount,date,reason,category}=req.body;
        if(isStringInvalid(amount)||isStringInvalid(date)||
        isStringInvalid(reason)||isStringInvalid(category))
        {
            return res.status(500).json({message:'Bad Parmeters:Something is Missing',success:false})
        }
       /* const response= await Expense.create({amount,date,reason,category,userId:req.user.id});  */
      console.log(req.user.totalexpenses);
       
       const response= await req.user.createExpense({amount,date,reason,category},{transaction:t});

       //console.log(response);

       const totalExpense=Number(req.user.totalexpenses)+Number(amount);

        await req.user.update({totalexpenses:totalExpense},{transaction:t});
        
        await t.commit();
        
        res.status(201).json({message:response,success:true,totalExpense:totalExpense});
        
    } catch(err) {
         await t.rollback();
        console.log(err);
        res.status(500).json({message:"Something went wrong",success:false})
    }

}
exports.getExpenses=async(req,res,next)=>{

    try{
        /* console.log(req.query); */
        const page=+req.query.page||1;
        const limit=+req.query.limit||5;


        const totalExpense=req.user.totalexpenses;

        
       /*  console.log(">>>>>>>>>>",totalExpense); */
    
      /*  const response=await Expense.findAll(); */
       /* const response =await Expense.findAll({where:{userId:req.user.id}}); */
       const total  = await req.user.getExpenses();
      
       const response =await req.user.getExpenses({
        offset:(page-1)*limit,
        limit:limit
       });
       
        res.status(200).json({message:response,
            success:true,
            currentpage:page,
            nextpage:page+1,
            previouspage:page-1,
            hasnextpage:limit*page<total.length,
            haspreviouspage:page>1,
            lastpage:Math.ceil(total.length/limit),
            totalExpense:totalExpense
        });
    }
    catch(err){
        /* console.log(">>>>>>>>",err) */
        res.status(500).json({message:err,success:false});
    }
}

exports.deleteExpense=async(req,res,next)=>{
    const t= await sequelize.transaction();
    try{
        const id=req.params.id;
       if(isStringInvalid(id))
       {
        return  res.status(500).json({message:'something went wrong',success:false})
       }
       
        const user= await Expense.findOne({where:{id:id}})
        const response=await Expense.destroy({where:{id:id},transaction:t})
        
        const totalExpense=Number(req.user.totalexpenses)-Number(user.amount);

        await req.user.update({totalexpenses:totalExpense},{transaction:t});

        
    
        if(response===0){
           return  res.status(401).json({message:"Expense does not Belongs to User",success:false});
        }
        await t.commit();
        res.status(200).json({message:response,success:true,totalExpense:totalExpense});
      
    }
    catch(err){
        console.log(err)
        await t.rollback();
        res.status(500).json({message:err,success:false});


    }
}

function uploadToS3(data,fileName){

        const BUCKET_NAME= process.env.AWS_BUCKET_NAME;
        const IAM_USER_KEY= process.env.AWS_KEY_ID;
        const  IAM_USER_SECRET= process.env.AWS_SECRET_KEY;
    
        let s3bucket=new AWS.S3({
            accessKeyId: IAM_USER_KEY,
            secretAccessKey:IAM_USER_SECRET,
        })
         var params={
                Bucket:BUCKET_NAME,
                Key:fileName,
                Body:data,
                ACL:'public-read'
            }
           return new Promise((resolve, reject) => {
                s3bucket.upload(params,(err,s3response)=>{
                    if(err){
                        console.log("SOMETHING WENT WRONG",err)
                        reject(err);
                    } 
                    else{
                        resolve(s3response.Location)
                        }
                    })
           })      
   
    
}

exports.downloadExpenses=async(req,res,next)=>{
        try{
            const Expenses= await req.user.getExpenses();
            const  stringifiedExpenses=JSON.stringify(Expenses);
            const userId= req.user.id;
            const fileName=`Expenses${userId}/${new Date()}.txt`;
            const fileURL= await uploadToS3(stringifiedExpenses,fileName);
            await Downloadfile.create({url:fileURL,userId:req.user.id});
            //console.log(fileURL);
            res.status(200).json({fileURL,success:true})
        }
        catch(err){
            console.log(err);
            res.status(500).json({message:err,success:false});
        }
}


exports.downlodedExpenses=async(req,res,next)=>{
    try{
      const downlodedfiles = await Downloadfile.findAll({where:{userId:req.user.id},limit:2})
       // console.log(">>>>>here",downlodedfiles);
        res.status(200).json({success:true,message:downlodedfiles})
    }catch(err){
        console.log(err);
        res.status(500).json({success:false,message:err})
    }
}