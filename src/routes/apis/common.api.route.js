import express from 'express';

import CommonApiController from "#root/controllers/apis/common.api.controller.js";

const Router = express.Router();

Router.get('/constants', CommonApiController.getConstants);
Router.get('/statistics', CommonApiController.getStatistics);
Router.post('/change-password', CommonApiController.postChangePassword);

export default Router;