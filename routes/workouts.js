const { User } = require("../models/user");
const { validate } = require("../models/workout");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

//Send back all saved workouts on currently logged in user's account
router.get("/", auth, async (req, res) => {
  const userId = req.user._id;
  const user = await User.findOne({ _id: userId });
  res.send(user.workouts);
});

//Save new workout on logged in user's account
router.post("/", auth, async (req, res) => {
  const newWorkout = req.body;
  const { error } = validate(newWorkout);
  if (error) return res.status(400).send(error.details[0].message);

  const userId = req.user._id;
  const user = await User.findOne({ _id: userId });
  user.workouts.push(newWorkout);
  await user.save();

  res.send(newWorkout);
});

//Delete a previously saved workout
router.delete("/:id", [auth], async (req, res) => {
  const userId = req.user._id;
  const user = await User.findOne({ _id: userId });
  const id = req.params.id;
  let workoutToDelete = -1;
  user.workouts.forEach((workout, index) => {
    if (workout._id.toString() === id) {
      workoutToDelete = index;
    }
  });

  if (workoutToDelete < 0)
    return res.status(404).send("The workout with the given ID was not found.");

  const deletedWorkout = user.workouts.splice(workoutToDelete, 1);
  await user.save();

  res.send(deletedWorkout);
});

module.exports = router;
