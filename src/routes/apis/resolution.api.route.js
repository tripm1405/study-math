import express from 'express';

import resolutionApiController from "#root/controllers/apis/resolution.api.controller.js";

const Router = express.Router();

Router.put('/:id/mark', resolutionApiController.putMark);

export default Router;