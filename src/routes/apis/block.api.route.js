import express from 'express';

import blockApiController from "#root/controllers/apis/block.api.controller.js";

const Router = express.Router();

Router.post('/:id/import', blockApiController.import);
Router.get('/:id/export', blockApiController.export);
Router.post('/import', blockApiController.importList);
Router.get('/export', blockApiController.exportList);
Router.get('/:id', blockApiController.get);
Router.get('/', blockApiController.getList);

export default Router;