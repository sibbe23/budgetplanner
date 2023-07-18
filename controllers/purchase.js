const Razorpay=require('razorpay');
const Order=require('../models/orders');
const jwt=require('jsonwebtoken');

exports.purchasePremium=async (req,res,next)=>{
    try{
        var rp=new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        })
        const amount=2500;
        rp.orders.create({amount,currency:"INR"},(err,order)=>{
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {
                return res.status(201).json({ order, key_id : rp.key_id});

            }).catch(err => {
                throw new Error(err)
            })
        })
    }
    catch(err){
        console.log(err);
        res.status(404).json({message:'Something went Wrong',error:err})

    }

}
function generateAccessToken(id,name,ispremiumuser){

    return jwt.sign({userId:id,name:name,ispremiumuser},'secretkey');

 } 
exports.updateTransactionStatus= async (req,res,next)=>{
    try {
        const userId = req.user.id;
        const { payment_id, order_id} = req.body;
        const order  = await Order.findOne({where : {orderid : order_id}})
        const promise1 =  order.update({ paymentid: payment_id, status: 'SUCCESSFUL'})
        const promise2 =  req.user.update({ ispremiumuser: true }) 

        Promise.all([promise1, promise2]).then(()=> {
            return res.status(202).json({success: true, message: "Transaction Successful",token:generateAccessToken(userId,undefined,true)});
        }).catch((error ) => {
            /* order.update({ paymentid: payment_id, status: 'Failed'}) */
            throw new Error(error)
        })

    }catch(err){
        res.status(402).json({success:false,message:err});
    }
}
