import ModelNameConstant from "#root/models/model-name.constant.js";
import UserModel from "#root/models/user.model.js";
import QuestionModel from "#root/models/question.model.js";
import LessonModel from "#root/models/lesson.model.js";
import CourseModel from "#root/models/course.model.js";
import ClassModel from "#root/models/class.model.js";
import AnswerModel from "#root/models/answer.model.js";

function preHandle(props) {
    const {
        modelName,
    } = {
        ...props,
    };

    switch (modelName) {
        case ModelNameConstant.ANSWER: {
            return {
                Model: AnswerModel,
                codePre: 'DA',
            }
        }
        case ModelNameConstant.CLASS: {
            return {
                Model: ClassModel,
                codePre: 'LH',
            }
        }
        case ModelNameConstant.COURSE: {
            return {
                Model: CourseModel,
                codePre: 'KH',
            }
        }
        case ModelNameConstant.LESSON: {
            return {
                Model: LessonModel,
                codePre: 'BH',
            }
        }
        case ModelNameConstant.QUESTION: {
            return {
                Model: QuestionModel,
                codePre: 'BT',
            }
        }
        case ModelNameConstant.USER: {
            return {
                Model: UserModel,
                codePre: 'ND',
            }
        }
    }
}

export default class ModelUtil {
    static Code = class {
        static generate = async (props) => {
            const {
                modelName,
            } = {
                ...props,
            };

            const {
                Model,
                codePre,
            } = preHandle({
                modelName: modelName,
            })

            const doc = await Model
                .findOne({})
                .sort({
                    createdAt: 'desc',
                })
                .lean();

            let code = doc?.code || 0;
            while (isNaN(Number(code))) {
                code = code.substring(1);
            }
            const count = String(Number(code) + 1).padStart(code.length, '0');
            return `${codePre}${count}`
        }
    }
}