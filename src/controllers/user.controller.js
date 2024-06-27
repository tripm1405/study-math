import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import dotenv from "dotenv";

import UserModel from "#root/models/user.model.js";
import ViewUtil from "#root/utils/view.util.js";
import AuthUtil from "#root/utils/auth.util.js";
import ClassModel from "#root/models/class.model.js";
import FilterUtil from "#root/utils/filter.util.js";

dotenv.config();

export default {
    get: async (req, res) => {
        const filter = (() => {
            const filterDefault = {
                type: {
                    $ne: 'Admin',
                },
            };

            const filterByRole = (() => {
                switch (res.locals.currentUser?.type) {
                    case AuthUtil.UserType.Teacher: {
                        return {
                            type: {
                                $eq: AuthUtil.UserType.Student,
                            },
                        };
                    }
                    default: {
                        return {};
                    }
                }
            })();

            const filterByQuery = FilterUtil.Account({
                filters: req.query,
            });

            return {
                $and: [
                    filterDefault,
                    filterByRole,
                    filterByQuery,
                ],
            };
        })();

        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const totalUsers = await UserModel.countDocuments(filter);
        const totalPages = Math.ceil(totalUsers / pageSize);

        const users = await UserModel.find(filter)
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        if (users.length === 0 && page > 1) {
            return res.redirect(`/users?page=${page - 1}`);
        }

        const paginatedUsers = users.map((user, index) => ({
            ...user.toObject(),
            index: (page - 1) * pageSize + index + 1
        }));

        const newId = new mongoose.Types.ObjectId();

        res.render('pages/managers/user.page.ejs', ViewUtil.getOptions({
            data: {
                filters: req.query,
                users: paginatedUsers,
                newId: newId,
                totalPages: totalPages,
                currentPage: page,
            },
        }));
    },
    getDetail: async (req, res) => {
        const {id} = req?.params;
        if (!id) return res.json({
            success: false,
            id: id,
        });
        const user = await UserModel.findById(id).lean() || {};
        const classes = await ClassModel.find({
            users: user?._id,
        });

        res.render('pages/managers/user-detail.page.ejs', ViewUtil.getOptions({
            data: {
                user: user,
                classes: classes,
            },
        }));
    },
    post: async (req, res) => {
        const {code, username, password, fullName, email, type, classIds} = req.body;

        const passwordHash = await bcrypt.hash(password, AuthUtil.BCRYPT_SALT);

        const user = await UserModel.create({
            code: code,
            username: username,
            password: passwordHash,
            fullName: fullName,
            email: email,
            type: type,
            classIds: classIds,
            createdBy: res?.locals?.currentUser?._id,
        });

        res.json({
            result: {
                success: true,
                user: user,
            },
        });
    },
    put: async (req, res) => {
        const {id} = req?.params;
        const {username, password, fullName, email, type, classIds} = req.body;

        const newUser = await UserModel.findByIdAndUpdate(id, {
            username: username,
            password: password,
            fullName: fullName,
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
        const {id} = req?.params;

        await UserModel.findByIdAndDelete(id);

        res.json({
            result: {
                success: true,
            },
        });
    },
}