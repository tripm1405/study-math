import express from 'express';

import CommonApiController from "#root/controllers/apis/common.api.controller.js";
import CommonUtil from "#root/utils/common.util.js";

const Router = express.Router();

Router.get('/constants', CommonApiController.getConstants);
Router.get('/statistics', CommonApiController.getStatistics);
Router.post('/change-password', CommonUtil.wrapperController(CommonApiController.postChangePassword));
Router.post('/profile', CommonUtil.wrapperController(CommonApiController.updateProfile));

export default Router;