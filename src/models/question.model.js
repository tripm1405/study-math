import mongoose from "mongoose";
import ModelNameConstant from "#root/models/model-name.constant.js";

const schema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
  },
  result: {
    type: String,
  },
  blocksDefault: {
    type: String,
  },
  toolbox: {
    type: String,
  },
  level: {
    type: String, // ['Easy', 'Normal', 'Hard']
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNameConstant.LESSON,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNameConstant.USER,
  },
}, {
  timestamps: true,
});

export default mongoose.model(ModelNameConstant.QUESTION, schema);