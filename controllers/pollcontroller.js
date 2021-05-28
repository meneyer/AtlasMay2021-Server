const router = require('express').Router();
const Poll = require('../db').import('../models/poll');
const validateSession = require('../middleware/validate-session');


/******* CREATE A POLL *********/
router.post('/',validateSession, function(req, res){
  const newPoll = {
    question: req.body.question,
    published: req.body.published,
    multiSelect: req.body.multiSelect
  };

  Poll.create(newPoll)
  .then(poll => res.status(200).json(poll))
  .catch(err => res.status(500).json({error: err}));
});

/******* UPDATE A POLL *********/
router.put('/:id', validateSession, function(req, res){
  const updatePoll = {
    question: req.body.question,
    published: req.body.published,
    multiSelect: req.body.multiSelect
  }

  const query = {
    where: {
      id: req.params.id,
    }
  }

  Poll.update(updatePoll, query)
  .then(update => {
    if(update[0] === 0){
      return res.status(200).send("No matching poll");
    }else{
      return res.status(200).json({data: update});
    }
  })
  .catch(err => res.status(500).json({error: err}));
});

/******** RETRIEVE ALL POLLS *********/
router.get('/', validateSession, function(req, res){
  Poll.findAll()
  .then(polls => res.status(200).json(polls))
  .catch(err => res.status(500).json({error: err}))
});

/******* RETRIEVE ALL  POLLS UNPROTECTED ********/
router.get('/polls', function(req, res){
  Poll.findAll()
  .then(polls => res.status(200).json(polls))
  .catch(err => res.status(500).json({error: err}))
});

/******** DELETE A POLL ********/
router.delete('/:id', validateSession, function(req, res){
  Poll.destroy({
    where: {
      id: req.params.id,
    }
  })
    .then(update => {
      if(update === 0){
        return res.status(200).send('No matching poll found.')
      }else{
        return res.status(200).json({message: `${update} poll removed`})
      }
    })
    .catch(err => res.status(500).json({error: err}));
});

module.exports = router
