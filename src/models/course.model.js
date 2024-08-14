import mongoose from "mongoose";
import ModelNameConstant from "#root/models/model-name.constant.js";

const schema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelNameConstant.FILE,
    },
    name: {
        type: String,
        required: true,
    },
    note: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelNameConstant.USER,
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model(ModelNameConstant.COURSE, schema);