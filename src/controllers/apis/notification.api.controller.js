import ApiUtil from "#root/utils/api.util.js";
import CommonUtil from "#root/utils/common.util.js";
import NotificationModel, {Status as NotificationStatus} from "#root/models/notification.model.js";

export default {
    getList: async (req, res) => {
        const notificationList = await CommonUtil.List.get({
            query: req.query,
            Model: NotificationModel,
            extendGet: (get) => {
                return get.sort({
                    createdAt: 'desc'
                });
            },
            filter: {
                receivers: res.locals.currentUser?._id,
            },
        });

        res.json(ApiUtil.JsonRes({
            data: {
                ...notificationList,
                notifications: notificationList.models,
            },
        }));
    },
    getCheckNew: async (req, res) => {
        const count = await NotificationModel.countDocuments({
            receivers: res.locals.currentUser?._id,
            status: NotificationStatus.NEW,
        });

        res.json(ApiUtil.JsonRes({
            data: {
                hasNew: count > 0,
            },
        }));
    },
    putVisited: async (req, res) => {
        const {
            id,
        } = {
            ...req.params,
        };

        await NotificationModel.findByIdAndUpdate(id, {
            status: NotificationStatus.VISITED,
        });

        res.json(ApiUtil.JsonRes());
    }
}