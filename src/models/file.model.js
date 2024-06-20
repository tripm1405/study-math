import mongoose from "mongoose";
import ModelNameConstant from "#root/models/model-name.constant.js";

const schema = new mongoose.Schema({
  displayName: {
    type: String,
  },
  physicalName: {
    type: String,
  },
  destination: {
    type: String,
  },
  path: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model(ModelNameConstant.FILE, schema);