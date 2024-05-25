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
    note: {
        type: String,
    },
    lessonIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelNameConstant.LESSON,
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelNameConstant.USER,
    },
}, {
    timestamps: true,
});

export default mongoose.model(ModelNameConstant.COURSE, schema);