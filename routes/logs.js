const { User } = require("../models/user");
const { validate } = require("../models/log");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

//Send back all saved logs on currently logged in user's account
router.get("/", auth, async (req, res) => {
  const userId = req.user._id;
  const user = await User.findOne({ _id: userId });
  res.send(user.logs);
});

//Save new log on logged in user's account
router.post("/", auth, async (req, res) => {
  const newLog = req.body;
  const { error } = validate(newLog);
  if (error) return res.status(400).send(error.details[0].message);

  const userId = req.user._id;
  const user = await User.findOne({ _id: userId });
  user.logs.push(newLog);
  await user.save();

  res.send(newLog);
});

//Delete a previously saved log
router.delete("/:id", [auth], async (req, res) => {
  const userId = req.user._id;
  const user = await User.findOne({ _id: userId });
  const id = req.params.id;
  let logToDelete = -1;
  user.logs.forEach((log, index) => {
    if (log._id.toString() === id) {
      logToDelete = index;
    }
  });

  if (logToDelete < 0)
    return res.status(404).send("The log with the given ID was not found.");

  const deletedLog = user.logs.splice(logToDelete, 1);
  await user.save();

  res.send(deletedLog);
});

module.exports = router;
