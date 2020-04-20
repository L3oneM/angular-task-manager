const express = require('express');
const router = new express.Router();
let authenticate = require('../middlewares/auth');
const { List, Task } = require('../models/index');

router.get('/lists/:listId/tasks', authenticate, (req, res) => {
  Task.find({
    _listId: req.params.listId,
  }).then((tasks) => {
    res.send(tasks);
  });
});

router.post('/lists/:listId/tasks', authenticate, (req, res) => {
  List.findOne({
    _id: req.params.listId,
    _userId: req.user_id,
  })
    .then((list) => {
      if (list) {
        return true;
      }

      return false;
    })
    .then((canCreateTask) => {
      if (canCreateTask) {
        let newTask = new Task({
          title: req.body.title,
          _listId: req.params.listId,
        });

        newTask.save().then((newTaskDoc) => {
          res.send(newTaskDoc);
        });
      } else {
        res.sendStatus(404);
      }
    });
});

router.patch('/lists/:listId/tasks/:taskId', authenticate, (req, res) => {
  // We want to update an existing task (specified by taskId)

  List.findOne({
    _id: req.params.listId,
    _userId: req.user_id,
  })
    .then((list) => {
      if (list) {
        // list object with the specified conditions was found
        // therefore the currently authenticated user can make updates to tasks within this list
        return true;
      }

      // else - the list object is undefined
      return false;
    })
    .then((canUpdateTasks) => {
      if (canUpdateTasks) {
        // the currently authenticated user can update tasks
        Task.findOneAndUpdate(
          {
            _id: req.params.taskId,
            _listId: req.params.listId,
          },
          {
            $set: req.body,
          }
        ).then(() => {
          res.send({ message: 'Updated successfully.' });
        });
      } else {
        res.sendStatus(404);
      }
    });
});

router.delete('/lists/:listId/tasks/:taskId', authenticate, (req, res) => {
  List.findOne({
    _id: req.params.listId,
    _userId: req.user_id,
  })
    .then((list) => {
      if (list) {
        // list object with the specified conditions was found
        // therefore the currently authenticated user can make updates to tasks within this list
        return true;
      }

      // else - the list object is undefined
      return false;
    })
    .then((canDeleteTasks) => {
      if (canDeleteTasks) {
        Task.findOneAndRemove({
          _id: req.params.taskId,
          _listId: req.params.listId,
        }).then((removedTaskDoc) => {
          res.send(removedTaskDoc);
        });
      } else {
        res.sendStatus(404);
      }
    });
});

module.exports = router;
