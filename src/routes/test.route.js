import express from 'express';
import MailerService, {Type as MailType} from "#root/services/mailer.service.js";
import ResolutionModel from "#root/models/resolution.model.js";
import DatetimeUtil from "#root/utils/datetime.util.js";
import ApiUtil from "#root/utils/api.util.js";
import ModelUtil from "#root/utils/model.util.js";
import ModelNameConstant from "#root/models/model-name.constant.js";

const Router = express.Router();

Router.get('/', async (req, res) => {
    const test = await ModelUtil.Code.generate({
        modelName: ModelNameConstant.USER,
    });

    res.json({
        test: test,
    })
});

Router.get('/remind-question-deadline', async (req, res) => {
    const resolutions = await (async () => {
        const date = new Date();

        const resolutions = await ResolutionModel.find({
            content: undefined,
            score: undefined,
        })
            .populate('question')
            .populate('student');

        return resolutions.filter(resolution => {
            return resolution.question.endDate &&
                resolution.question.endDate > date &&
                ((Number(resolution.question.endDate) - Number(date)) < DatetimeUtil.Length.DAY);
        })
    })();

    for (const resolution of resolutions) {
        MailerService.send({
            email: resolution?.student?.email,
            type: MailType.REMIND_QUESTION_DEADLINE,
            content: {
                name: resolution?.question?.name,
                endDate: resolution?.question?.endDate,
            },
        });
    }

    res.json(ApiUtil.JsonRes({
        data: {
            resolutions: resolutions,
        },
    }));
});

Router.post('/', (req, res) => {
    res.json({result: '/'});
});

Router.put('/', (req, res) => {
    res.json({result: '/'});
});

Router.delete('/', (req, res) => {
    res.json({result: '/'});
});

export default Router;