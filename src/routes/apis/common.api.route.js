import express from 'express';

import CommonApiController from "#root/controllers/apis/common.api.controller.js";
import CommonUtil from "#root/utils/common.util.js";
import AuthMiddleware from "#root/middlewares/auth.middleware.js";

const Router = express.Router();

Router.post('/sign-in', CommonApiController.postSignIn);
Router.get('/constants', AuthMiddleware.checkSingedIn, CommonApiController.getConstants);
Router.get('/statistics', AuthMiddleware.checkSingedIn, CommonApiController.getStatistics);
Router.post('/change-password', AuthMiddleware.checkSingedIn, CommonUtil.wrapperController(CommonApiController.postChangePassword));
Router.post('/profile', AuthMiddleware.checkSingedIn, CommonUtil.wrapperController(CommonApiController.updateProfile));

export default Router;