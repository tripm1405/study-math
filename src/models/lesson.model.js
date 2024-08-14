import mongoose from "mongoose";
import ModelNameConstant from "#root/models/model-name.constant.js";

const schema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
      require: true,
  },
  note: {
    type: String,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNameConstant.COURSE,
      require: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNameConstant.USER,
      require: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model(ModelNameConstant.LESSON, schema);