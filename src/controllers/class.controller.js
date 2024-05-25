import mongoose from "mongoose";
import ViewUtil from "#root/utils/view.util.js";
import ClassModel from "#root/models/class.model.js";
import UserModel from "#root/models/user.model.js";

export default {
    get: async (req, res) => {
        const classes = await ClassModel.find({});
        const newId = new mongoose.Types.ObjectId();

        res.render('pages/class.page.ejs', ViewUtil.getOptions({
            data: {
                classes: classes,
                newId: newId,
            },
        }));
    },
    getDetail: async (req, res) => {
        const { id } = req?.params;
        if (!id) return res.json({
            success: false,
            id: id,
        });

        const _class = await ClassModel.findById(id) || {};
        const users = await UserModel.find({});

        res.render('pages/class-detail.page.ejs', ViewUtil.getOptions({
            data: {
                class: _class,
                users: users,
            },
        }));
    },
    post: async (req, res) => {
        const { code, name, note, userIds } = req.body;

        const _class = await ClassModel.create({
            code: code,
            name: name,
            note: note,
            userIds: userIds,
        });

        res.json({
            result: {
                success: true,
                class: _class,
            },
        });
    },
    put: async (req, res) => {
        const { id } = req?.params;
        const { name, note, userIds } = req.body;

        const newClass = await ClassModel.findByIdAndUpdate(id,{
            name: name,
            note: note,
            userIds: userIds,
        });

        res.json({
            result: {
                success: true,
                _class: newClass,
            },
        });
    },
    delete: async (req, res) => {
        const { id } = req?.params;

        await ClassModel.findByIdAndDelete(id);

        res.json({
            result: {
                success: true,
            },
        });
    },
}