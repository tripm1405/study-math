import ApiUtil from "#root/utils/api.util.js";
import CommonUtil from "#root/utils/common.util.js";
import NotificationModel from "#root/models/notification.model.js";

export default {
    getList: async (req, res) => {
        const notificationList = await CommonUtil.List.get({
            query: req.query,
            Model: NotificationModel,
            extendGet: (get) => {
                return get.sort({
                    createdAt: 'desc'
                });
            }
        });

        res.json(ApiUtil.JsonRes({
            data: {
                ...notificationList,
                notifications: notificationList.models,
            },
        }));
    },
}