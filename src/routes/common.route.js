import express from 'express';

import commonController from "#root/controllers/common.controller.js";

const Router = express.Router();

Router.get('/sign-in', commonController.getSignIn);
Router.post('/sign-in', commonController.postSignIn);
Router.post('/sign-out', commonController.postSignOut);

export default Router;