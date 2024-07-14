import {Type as NotificationType} from "#root/models/notification.model.js";

export default class NotificationService {
    static generateTitle(props) {
        const {
            type,
        } = {
            ...props,
        };

        switch (type) {
            case NotificationType.RESOLUTION_SUBMIT: {
                return 'Chấm điểm';
            }
            default: {
                return '';
            }
        }
    }

    static generateText(props) {
        const {
            type,
            student,
            question,
        } = {
            ...props,
        };

        switch (type) {
            case NotificationType.RESOLUTION_SUBMIT: {
                return `${student?.fullName} nộp bài ${question?.name}`;
            }
            default: {
                return '';
            }
        }
    }
}