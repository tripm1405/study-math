import mongoose from "mongoose";
import ModelNameConstant from "#root/models/model-name.constant.js";

const schema = new mongoose.Schema({
  name: {
    type: String,
  },
  type: {
    type: String,
    unique: true,
  },
  output: {
    type: String, // ['Number']
  },
  color: {
    type: String,
  },
  previousStatement: {
    type: String, // ['Action']
  },
  nextStatement: {
    type: String, // ['Account']
  },
  // {
  //   [`message${Number}`]: String,
  //   [`args{Number}`]: {},
  // }
  content: {
    type: String,
  },
  tooltip: {
    type: String,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNameConstant.QUESTION,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNameConstant.USER,
  },
}, {
  timestamps: true,
});

export default mongoose.model(ModelNameConstant.BLOCK, schema);