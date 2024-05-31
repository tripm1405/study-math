import dotenv from "dotenv";
import ViewUtil from "#root/utils/view.util.js";
import UserModel from "#root/models/user.model.js";

dotenv.config();

export default {
  getSignIn: (req, res) => {
    res.render('pages/sign-in.page.ejs', ViewUtil.getOptions({
      layout: false,
    }));
  },
  postSignIn: async (req, res) => {
    const { username, password } = req.body;

    const user = await UserModel.findOne({
      username: username
    });

    if (!user) {
      res.redirect('/sign-in');
      return;
    }

    const isCorrectPassword = await bcrypt.compareSync(password, user?.password);
    if (!isCorrectPassword) {
      res.redirect('/sign-in');
      return;
    }

    res.cookie('user', username, {
      httpOnly: true
    }, {
      signed: true
    });
    res.redirect('/');
  },
  postSignOut: (req, res) => {
    res.json({ result: '/sign-in' });
  },
}