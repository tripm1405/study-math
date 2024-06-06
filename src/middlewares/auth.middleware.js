import UserModel from "#root/models/user.model.js";
import AuthUtil from "#root/utils/auth.util.js";
import ViewUtil from "#root/utils/view.util.js";

export default {
  checkSingedIn: async (req, res, next) => {
    if (!req?.cookies?.user) {
      res.redirect('/sign-in');
      return;
    }

    const {_id, username, type} = await UserModel.findOne({
      username: req?.cookies?.user?.username,
    });

    res.locals.currentUser = {
      _id: _id,
      username: username,
      fullName: username,
      type: type,
    };
    res.locals.menus = AuthUtil.checkManager(type)
      ? ViewUtil.menus.manager
      : ViewUtil.menus.student;

    next();
  },
  checkRoles: (roles) => async (req, res, next) => {
    if (req?.cookies?.user?.type === 'Admin') {
      next();
      return;
    }

    if (!roles.includes(req?.cookies?.user?.type)) {
      res.redirect('/');
      return;
    }

    next();
  },
}