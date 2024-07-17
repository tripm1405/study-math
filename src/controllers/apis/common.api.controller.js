import ApiUtil from "#root/utils/api.util.js";
import ViewUtil from "#root/utils/view.util.js";

export default {
    getConstants: async (req, res) => {
        res.json(ApiUtil.JsonRes({
            data: {
                PARTIAL_PATH: ViewUtil.PARTIAL_PATH,
                WS_HREF: ViewUtil.WS_HREF,
            },
        }));
    },
}