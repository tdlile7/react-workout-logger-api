const Joi = require("joi");
const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema({
  set: {
    type: Number,
    required: true,
    min: 1,
    max: 50
  },
  reps: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  weight: {
    type: Number,
    required: true,
    min: 0,
    max: 1000
  }
});

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 50
  },
  data: {
    type: [roundSchema],
    minlength: 1,
    required: true
  }
});

const logSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 50
  },
  records: {
    type: [exerciseSchema],
    minlength: 1,
    required: true
  }
});

function validateLog(log) {
  const schema = {
    title: Joi.string()
      .required()
      .min(1)
      .max(50),
    records: Joi.array()
      .items(
        Joi.object().keys({
          name: Joi.string()
            .required()
            .min(1)
            .max(50),
          data: Joi.array()
            .items(
              Joi.object().keys({
                set: Joi.number()
                  .required()
                  .min(1)
                  .max(50),
                reps: Joi.number()
                  .required()
                  .min(1)
                  .max(100),
                weight: Joi.number()
                  .required()
                  .min(0)
                  .max(1000)
              })
            )
            .min(1)
        })
      )
      .min(1)
  };

  return Joi.validate(log, schema);
}

exports.logSchema = logSchema;
exports.validate = validateLog;
