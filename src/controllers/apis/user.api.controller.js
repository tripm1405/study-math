import bcrypt from "bcryptjs";

import ApiUtil from "#root/utils/api.util.js";
import UserModel from "#root/models/user.model.js";
import AuthUtil from "#root/utils/auth.util.js";
import MailerService, {Type as MailType} from "#root/services/mailer.service.js";

export default {
    resetPassword: async (req, res) => {
        const {id} = req.body;

        const passwordDefault = 'default';
        const passwordHash = await bcrypt.hash(passwordDefault, AuthUtil.BCRYPT_SALT);
        const user = await UserModel.findByIdAndUpdate(id, {
            password: passwordHash,
        });

        await MailerService.send({
            email: user.email,
            type: MailType.ACCOUNT_LOGIN_INFO,
            content: {
                username: user.username,
                password: passwordDefault,
            },
        });

        res.json(ApiUtil.JsonRes());
    },
}