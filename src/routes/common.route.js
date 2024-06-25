import express from 'express';
import commonController from "#root/controllers/common.controller.js";
import AuthMiddleware from "#root/middlewares/auth.middleware.js";
import CommonUtil from '#root/utils/common.util.js';

const Router = express.Router();

Router.get('/statistics', AuthMiddleware.checkSingedIn, CommonUtil.wrapperController(commonController.getStatistics));
Router.get('/search', AuthMiddleware.checkSingedIn, CommonUtil.wrapperController(commonController.getSearch));
Router.get('/sign-in', CommonUtil.wrapperController(commonController.getSignIn));
Router.post('/sign-in', CommonUtil.wrapperController(commonController.postSignIn));
Router.get('/sign-out', AuthMiddleware.checkSingedIn, CommonUtil.wrapperController(commonController.getSignOut));
Router.get('/profile', AuthMiddleware.checkSingedIn, CommonUtil.wrapperController(commonController.getProfile));
Router.get('/', AuthMiddleware.checkSingedIn, CommonUtil.wrapperController(commonController.getHome));
Router.use(CommonUtil.wrapperController(commonController.getNotFound));

export default Router;