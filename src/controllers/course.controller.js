import ViewUtil from "#root/utils/view.util.js";
import mongoose, {Mongoose} from "mongoose";
import CourseModel from "#root/models/course.model.js";
import AuthUtil from "#root/utils/auth.util.js";
import LessonModel from "#root/models/lesson.model.js";
import UserModel from "#root/models/user.model.js";
import CommonUtil from "#root/utils/common.util.js";
import fs from "fs";
import FileUtil from "#root/utils/file.util.js";
import FileModel from "#root/models/file.model.js";

export default {
    get: async (req, res) => {
        const newId = new mongoose.Types.ObjectId();
        const {
            page: page,
            totalPages: totalPages,
            models: models,
        } = await CommonUtil.Pagination.get({
            query: req.query,
            Model: CourseModel,
            filter: {
                type: {
                    $ne: 'Admin',
                },
            },
            extendGet: get => {
                return get
                    .populate('createdBy')
                    .lean();
            },
        })

        const view = `${ViewUtil.getPrefixView(res.locals.currentUser?.type)}/course.page.ejs`;
        res.render(view, ViewUtil.getOptions({
            data: {
                courses: models,
                newId: newId,
                totalPages: totalPages,
                currentPage: page,
            },
        }));
    },
    getDetail: async (req, res) => {
        const {id} = req?.params;
        if (!id) return res.json({
            success: false, id: id,
        });

        const course = await CourseModel.findById(id)
            .populate('createdBy')
            .populate('image') || {};

        console.log('course', course);

        const lessons = await LessonModel.find({
            course: course?._id,
        });

        const view = `${ViewUtil.getPrefixView(res.locals.currentUser?.type)}/course-detail.page.ejs`;
        res.render(view, ViewUtil.getOptions({
            data: {
                course: course, lessons: lessons,
            },
        }));
    },
    post: async (req, res) => {
        const {code, name, note} = req.body;
        const imageId = await (async () => {
            const image = (() => {
                const imageFile = req.files?.find(file => file.fieldname === 'image');

                if (!imageFile) {
                    return undefined;
                }

                return FileUtil.format({
                    file: imageFile,
                });
            })();

            if (!image) {
                return undefined;
            }

            fs.rename(image?.oldPath, image.path, () => {
            });

            const imageId = new mongoose.Types.ObjectId();
            await FileModel.create({
                _id: imageId,
                ...image,
            });

            return imageId;
        })();

        const course = await CourseModel.create({
            code: code,
            image: imageId,
            name: name,
            note: note,
            createdBy: res?.locals?.currentUser?._id,
        });

        res.json({
            result: {
                success: true, course: course,
            },
        });
    },
    put: async (req, res) => {
        const {id} = req?.params;
        const {name, note} = req.body;

        const newUser = await CourseModel.findByIdAndUpdate(id, {
            name: name, note: note,
        });

        res.json({
            result: {
                success: true, course: newUser,
            },
        });
    }, delete: async (req, res) => {
        const {id} = req?.params;

        await CourseModel.findByIdAndDelete(id);

        res.json({
            result: {
                success: true,
            },
        });
    },
}