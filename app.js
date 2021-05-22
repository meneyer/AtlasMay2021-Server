let express = require('express');
let app = express();
let sequelize = require('./db');
require("dotenv").config();

sequelize.sync();
app.use(express.json());
app.use(require('./middleware/cors'));

let user = require('./controllers/usercontroller');
let poll = require('./controllers/pollcontroller');
let option = require('./controllers/optioncontroller');

app.use('/test', function(req, res){
  res.send(
    `<h1> This is the Team 2 poll server </h1>
    <p> if you are reading this, you made it! </p>`
  )
});

app.use('/user', user);
app.use('/poll', poll);
app.use('/option', option);

app.listen(3000, function() {
  console.log("Poll server is up on port 3000")
});

