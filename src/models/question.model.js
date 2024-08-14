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
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelNameConstant.LESSON,
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

export default mongoose.model(ModelNameConstant.QUESTION, schema);