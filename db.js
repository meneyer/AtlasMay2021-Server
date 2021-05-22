const Sequelize = require('sequelize');

//Comment this in to run on Heroku  Lines 4-13
// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: 'postgres',
//   dialectOptions:{
//     ssl:{
//       require:true,
//       rejectUnauthorized: false,
//     }
//   }
// });

//Comment this out to run on Heroku  Lines 15-18
const sequelize = new Sequelize('AtlasMay2021', 'postgres', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});


sequelize.authenticate()
.then(
  function(){
    console.log('Connected to the Atlas May 2021 Poll App database.')
  },
  function(err){
    console.log(err);
  }
);

User = sequelize.import('./models/user');
Poll = sequelize.import('./models/poll');
Opt = sequelize.import('./models/option');

Poll.hasMany(Opt);
Opt.belongsTo(Poll);

module.exports = sequelize;