import UserModel from "#root/models/user.model.js";

import ViewUtil from "#root/utils/view.util.js";
import mongoose from "mongoose";

export default {
    get: async (req, res) => {
        const users = await UserModel.find({});
        const newId = new mongoose.Types.ObjectId();

        res.render('pages/user.page.ejs', ViewUtil.getOptions({
            data: {
                users: users,
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

        const user = await UserModel.findById(id) || {};

        res.render('pages/user-detail.page.ejs', ViewUtil.getOptions({
            data: {
                user: user,
            },
        }));
    },
    getSignIn: (req, res) => {
        res.json({ result: '/sign-in' });
    },
    post: async (req, res) => {
        const { code, username, password, email, type, classIds } = req.body;

        const user = await UserModel.create({
            code: code,
            username: username,
            password: password,
            email: email,
            type: type,
            classIds: classIds,
        });

        res.json({
            result: {
                success: true,
                user: user,
            },
        });
    },
    postSignIn: (req, res) => {
        res.json({ result: '/sign-in' });
    },
    postSignOut: (req, res) => {
        res.json({ result: '/sign-in' });
    },
    put: async (req, res) => {
        const { id } = req?.params;
        const { username, password, email, type } = req.body;

        const newUser = await UserModel.findByIdAndUpdate(id, {
            username: username,
            password: password,
            email: email,
            type: type,
            classIds: classIds,
        });

        res.json({
            result: {
                success: true,
                user: newUser,
            },
        });
    },
    delete: async (req, res) => {
        const { id } = req?.params;

        await UserModel.findByIdAndDelete(id);

        res.json({
            result: {
                success: true,
            },
        });
    },
}