const Sequelize=require("sequelize");

const sequelize=new Sequelize('nodeproject','root','rinku9938300585@',{
    dialect:'mysql',
    host:'localhost'
});

module.exports=sequelize;