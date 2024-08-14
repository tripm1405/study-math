import mongoose from "mongoose";
import ModelNameConstant from "#root/models/model-name.constant.js";

const schema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
      require: true,
  },
  name: {
    type: String,
      require: true,
  },
  note: {
    type: String,
  },
  // user.type === 'Student'
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNameConstant.USER,
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNameConstant.USER,
      require: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model(ModelNameConstant.CLASS, schema);