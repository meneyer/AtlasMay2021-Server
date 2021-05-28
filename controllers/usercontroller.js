const router = require('express').Router();
const User = require('../db').import('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validateSession = require('../middleware/validate-session');


/****** USER CREATE ******/
router.post('/create', function(req, res){
  let newUser = {
    passwordhash: bcrypt.hashSync(req.body.password, 12),
    userName: req.body.userName,
    isAdmin: req.body.isAdmin,
    pollsVotedOn: []
  };
  
  User.create(newUser)
  .then((user) => {
    let token = jwt.sign(
      {id: user.id}, 
      process.env.JWT_SECRET, 
      {expiresIn: 60*60*24}
    )
    res.status(200).json(
      {
        userId: user.id,
        userName: user.userName,
        isAdmin: user.isAdmin,
        pollsVotedOn: user.pollsVotedOn,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
        sessionToken: token
      }
    );
  })
  .catch(err => {
    return res.status(500).json({error: err, message:"Failed to register new user"})
  })
});

/****** USER LOGIN ******/
router.post('/login', function(req, res){
  
  User.findOne({
    where: {
      userName: req.body.userName
    }
  })
  .then((user) => {
    if (user){
      bcrypt.compare(req.body.password, user.passwordhash, (err, matches) => {
        if (matches) {
          let token = jwt.sign(
            {id: user.id}, 
            process.env.JWT_SECRET, 
            {expiresIn: 60*60*24}
          );
          res.status(200).json(
            {
              userId: user.id,
              userName: user.userName,
              isAdmin: user.isAdmin,
              pollsVotedOn: user.pollsVotedOn,
              sessionToken: token
            }
          );
        }else{
          res.status(502).json({error: "Login failed"});
        }
      });
    }else{
      res.status(500).json({error: "User not found"});
    }
  })
  .catch(err => {
    return res.status(500).json({error: err, message:"Failed to login user"})
  });
});


/****** USER UPDATE ******/
router.put('/:id',validateSession, function(req, res){
  const updateUserInfo = {
    // passwordhash: bcrypt.hashSync(req.body.password, 12),
    // userName: req.body.userName,
    // isAdmin: req.body.isAdmin,
    pollsVotedOn: req.body.pollsVotedOn
  }

  const query = {where: {id: req.params.id}}

  User.update(updateUserInfo, query)
    .then(update => {
      if(update[0] === 0){
        return res.status(200).send('No matching user found.')
      }else{
        return res.status(200).json({data: update, message: `${update[0]} User updated`})
      }
    })
    .catch(err => res.status(500).json({error: err}))
});
/*Get a user from the session token */


router.get("/",validateSession,async(req,res)=>{
  try{
    const result=await User.findOne({where:{id:req.user.id}})
    if(result===null){
      res.status(403).json({message:"no such user"})
    } else {
      res.status(200).json(result)
    }
  } catch (error){
    res.status(500).json({error:error})
  }
})

module.exports = router;