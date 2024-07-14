import mongoose from "mongoose";
import ModelNameConstant from "#root/models/model-name.constant.js";

export const Status = {
    NEW: 'New',
    VISITED: 'Visited',
};

export const Type = {
    RESOLUTION_SUBMIT: 'ResolutionSubmit',
};

const schema = new mongoose.Schema({
    type: {
        type: String,
        enum: Object.values(Type),
        require: true,
    },
    content: {
        type: Object,
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.NEW,
        require: true,
    },
    receivers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelNameConstant.USER,
    }],
}, {
    timestamps: true,
});

export default mongoose.model(ModelNameConstant.NOTIFICATION, schema);