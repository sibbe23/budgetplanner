const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const User = sequelize.define('user',{
  id:{
    type:Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
  },
  username:{
   type:Sequelize.STRING,
   allowNull:false
  },
  email:{
    type:Sequelize.STRING,
    allowNull:false,
    unique:true
  },
  number:{
    type:Sequelize.STRING,
    allowNull:false
  },
  password:{
    type:Sequelize.STRING,
    allowNull:false
  },
  ispremiumuser:Sequelize.BOOLEAN,
  totalexpenses:{
    type:Sequelize.INTEGER,
    defaultValue:0
  }
});
module.exports=User;