import express from 'express';

import notificationApiController from "#root/controllers/apis/notification.api.controller.js";

const Router = express.Router();

Router.put('/:id/visited', notificationApiController.putVisited);
Router.get('/check-new', notificationApiController.getCheckNew);
Router.get('/', notificationApiController.getList);

export default Router;