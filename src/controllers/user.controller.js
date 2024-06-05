import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import dotenv from "dotenv";

import UserModel from "#root/models/user.model.js";
import ViewUtil from "#root/utils/view.util.js";
import AuthUtil from "#root/utils/auth.util.js";

dotenv.config();

export default {
    get: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const totalUsers = await UserModel.countDocuments({ type: { $ne: 'Admin' } });
        const totalPages = Math.ceil(totalUsers / pageSize);

        const users = await UserModel.find({
            type: { $ne: 'Admin' }
        })
        .skip((page - 1) * pageSize)
        .limit(pageSize);

        const paginatedUsers = users.map((user, index) => ({
            ...user.toObject(),
            index: (page - 1) * pageSize + index + 1
        }));

        const data = {
            users: paginatedUsers,
            totalPages: totalPages,
            currentPage: page,
            newId: new mongoose.Types.ObjectId().toString()
        };

        const newId = new mongoose.Types.ObjectId();

        res.render('pages/user.page.ejs', ViewUtil.getOptions({
            data: {
                users: users,
                newId: newId,
                totalPages: totalPages, 
                currentPage: page,
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
    post: async (req, res) => {
        const { code, username, password, email, type, classIds } = req.body;

        const passwordHash = await bcrypt.hash(password, AuthUtil.BCRYPT_SALT);

        const user = await UserModel.create({
            code: code,
            username: username,
            password: passwordHash,
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
    // KNote: update user will be remove
    put: async (req, res) => {
        const { id } = req?.params;
        const { username, password, email, type, classIds } = req.body;

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