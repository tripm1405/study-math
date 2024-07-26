import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from 'multer';
import { createServer } from 'node:http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Server as SocketServer } from "socket.io";
import cookie from "cookie";

import Router from '#root/routes/index.js';
import CommonMiddleware from "#root/middlewares/common.middleware.js";
import UserModel from "#root/models/user.model.js";

import "#root/services/cron.service.js";

dotenv.config();

try {
    await mongoose.connect(process.env.DB_SERVER);
} catch {
    console.log('connect database error');
}

const PORT = process.env.PORT || 5500;
const app = express();
const server = createServer(app);
const socket = new SocketServer(server);
const rootPath = dirname(fileURLToPath(import.meta.url));

app.set('views', `${rootPath}/views`);
app.set('view engine', 'ejs');
app.set('rootPath', rootPath);
app.set('socket', socket);

app.use(express.static(`${rootPath}/public`));
app.use(expressEjsLayouts);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(multer({dest: `${rootPath}/uploads`}).any());
app.use(cookieParser());

socket.use(async (socket, next) => {
    try {
        const cookies = cookie.parse(socket.handshake.headers.cookie);
        const {
            username
        } = {
            ...(JSON.parse(cookies.user.replace(new RegExp(/j\:/g), '')) || {}),
        };
        socket.user = await UserModel.findOne({
            username: username,
        });
        next();
    } catch (e) {
        next(new Error("unknown user"));
    }
});
socket.on('connection', (socket) => {
    socket.join(socket.user?._id?.toString());
})

app.use(CommonMiddleware.preLog);
app.use(Router);
app.use(CommonMiddleware.handleError);

server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});

export default app;