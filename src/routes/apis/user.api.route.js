import express from 'express';

import userApiController from "#root/controllers/apis/user.api.controller.js";

const Router = express.Router();

Router.post('/reset-password', userApiController.resetPassword);

export default Router;