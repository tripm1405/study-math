import express from 'express';

import notificationApiController from "#root/controllers/apis/notification.api.controller.js";
import CommonApiController from "#root/controllers/apis/common.api.controller.js";

const Router = express.Router();

Router.get('/constants', CommonApiController.getConstants);

export default Router;