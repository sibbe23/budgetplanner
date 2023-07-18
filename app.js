const express=require('express');

const app=express();

const cors=require('cors');
const path = require('path');

require('dotenv').config();
app.use(cors());

const UserRoutes=require('./routes/users');

const ExpenseRoutes=require('./routes/expense');

const PurchaseRoutes=require('./routes/purchase');

const PremiumRoutes=require('./routes/premium');

const PasswordRoutes=require('./routes/forgotpassword');

const bodyParser=require('body-parser');

const sequelize=require('./util/database');


const User=require('./models/users');
const Expense=require('./models/expense');
const Order=require('./models/orders');
const ForgotPassword=require('./models/forgotpassword');
const DowloadedFiles=require('./models/downlodedfile');
// const { downloadExpenses } = require('./controllers/expense');



User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

User.hasMany(DowloadedFiles);
DowloadedFiles.belongsTo(User);


app.use(bodyParser.json({extended:false}));


app.use('/user',UserRoutes);

app.use('/expense',ExpenseRoutes);

app.use('/purchase',PurchaseRoutes);

app.use('/premium',PremiumRoutes);

app.use('/password',PasswordRoutes);


sequelize.sync( /* {force:true} */ )
.then(()=>{
    app.listen(3000);
}).catch(err=>console.log(err));


