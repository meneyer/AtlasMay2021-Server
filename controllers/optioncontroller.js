const router = require('express').Router();
const Option = require('../db').import('../models/option');
const validateSession = require('../middleware/validate-session');


/******* CREATE AN OPTION *********/
router.post('/',validateSession, function(req, res){
  const newOption = {
    text: req.body.text,
    votes: 0,
    pollId: req.body.pollId
  };

  Option.create(newOption)
  .then(option => res.status(200).json(option))
  .catch(err => res.status(500).json({error: err}));
});

/******* UPDATE AN OPTION *********/
router.put('/:id', validateSession, function(req, res){
  const updateOption = {
    text: req.body.text,
    votes: req.body.votes,
    pollId: req.body.pollId
  }

  const query = {
    where: {
      id: req.params.id,
    }
  }

  Option.update(updateOption, query)
  .then(update => {
    if(update[0] === 0){
      return res.status(200).send("No matching option");
    }else{
      return res.status(200).json({data: update});
    }
  })
  .catch(err => res.status(500).json({error: err}));
});

// /******** RETRIEVE OPTIONS FOR POLL *********/
router.get('/:pollId', validateSession, function(req, res){
  Option.findAll({
    where:{
      pollId: req.params.pollId
    }
  })
  .then(options => res.status(200).json(options))
  .catch(err => res.status(500).json({error: err}))
});

/******** DELETE AN OPTION ********/
router.delete('/:id', validateSession, function(req, res){
  Option.destroy({
    where: {
      id: req.params.id,
    }
  })
    .then(update => {
      if(update === 0){
        return res.status(200).send('No matching option found.')
      }else{
        return res.status(200).json({message: `${update} option removed`})
      }
    })
    .catch(err => res.status(500).json({error: err}));
});

module.exports = router
