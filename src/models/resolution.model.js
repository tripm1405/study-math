import mongoose from "mongoose";
import ModelNameConstant from "#root/models/model-name.constant.js";

const schema = new mongoose.Schema({
  content: {
    type: String,
  },
  score: {
    type: Number,
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNameConstant.USER,
  },
  deadline: {
    type: Date,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNameConstant.QUESTION,
  },
  createdById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNameConstant.USER,
  },
}, {
  timestamps: true,
});

export default mongoose.model(ModelNameConstant.RESOLUTION, schema);