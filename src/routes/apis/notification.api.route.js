import express from 'express';

import notificationApiController from "#root/controllers/apis/notification.api.controller.js";

const Router = express.Router();

Router.get('/', notificationApiController.getList);

export default Router;