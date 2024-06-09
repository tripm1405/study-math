import express from 'express';

import BlockApiRoute from "#root/routes/apis/block.api.route.js";

const Router = express.Router();

Router.use('/blocks', BlockApiRoute);

export default Router;