import cron from "node-cron";
import ResolutionModel from "#root/models/resolution.model.js";
import DatetimeUtil from "#root/utils/datetime.util.js";
import MailerService, {Type as MailType} from "#root/services/mailer.service.js";

cron.schedule('0 8 * * *', async () => {
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
});