const express = require('express');
const router = new express.Router();
let authenticate = require('../middlewares/auth');
const { List, Task } = require('../models/index');

router.get('/lists', authenticate, (req, res) => {
  // We want to return an array of all the lists that belong to the authenticated user
  List.find({
    _userId: req.user_id,
  })
    .then((lists) => {
      res.send(lists);
    })
    .catch((e) => {
      res.send(e);
    });
});

router.get('/lists/:listId/tasks/:taskId', (req, res) => {
  Task.findOne({
    _id: req.params.taskId,
    _listId: req.params.listId,
  }).then((task) => {
    res.send(task);
  });
});

router.post('/lists', authenticate, (req, res) => {
  let title = req.body.title;

  let newList = new List({
    title,
    _userId: req.user_id,
  });

  newList.save().then((listDoc) => {
    res.send(listDoc);
  });
});

router.patch('/lists/:id', authenticate, (req, res) => {
  List.findOneAndUpdate(
    { _id: req.params.id, _userId: req.user_id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({ message: 'updated successfully!' });
  });
});

router.delete('/lists/:id', authenticate, (req, res) => {
  // We want to delete the specified list (document with id in the URL)
  List.findOneAndRemove({
    _id: req.params.id,
    _userId: req.user_id,
  }).then((removedListDoc) => {
    res.send(removedListDoc);

    // delete all the tasks that are in the deleted list
    deleteTasksFromList(removedListDoc._id);
  });
});

/* HELPER METHODS */
let deleteTasksFromList = (_listId) => {
  Task.deleteMany({
    _listId,
  }).then(() => {
    console.log('Tasks from ' + _listId + ' were deleted!');
  });
};

module.exports = router;
