import express from 'express';

import commonController from "#root/controllers/common.controller.js";
import AuthMiddleware from "#root/middlewares/auth.middleware.js";

const Router = express.Router();

Router.get('/sign-in', commonController.getSignIn);
Router.post('/sign-in', commonController.postSignIn);
Router.get('/sign-out', AuthMiddleware.checkSingedIn, commonController.getSignOut);

export default Router;