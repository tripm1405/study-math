import mongoose from "mongoose";
import ModelNameConstant from "#root/models/model-name.constant.js";

export const Type = {
    ADMIN: 'Admin',
    TEACHER: 'Teacher',
    STUDENT: 'Student',
};

const schema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        require: true,
    },
    fullName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        unique: true,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    type: {
        type: String,
        enum: Object.values(Type),
        default: Type.STUDENT,
        require: true,
    },
    classes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelNameConstant.CLASS,
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelNameConstant.USER,
    },
}, {
    timestamps: true,
});

export default mongoose.model(ModelNameConstant.USER, schema);