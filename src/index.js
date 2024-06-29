import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import cookieParser from 'cookie-parser';
import { dirname } from 'path';
import {fileURLToPath} from 'url';
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from 'multer';

import Router from '#root/routes/index.js';
import ApiUtil from "#root/utils/api.util.js";

dotenv.config();

try {
  await mongoose.connect(process.env.DB_SERVER);
}
catch {
  console.log('connect database error');
}


const PORT = process.env.PORT || 5500;

const app = express();

const rootPath = dirname(fileURLToPath(import.meta.url));

app.set('views', `${rootPath}/views`);
app.set('view engine', 'ejs');

app.use(express.static(`${rootPath}/public`));
app.use(expressEjsLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer({ dest: `${rootPath}/uploads` }).any());
app.use(cookieParser());

app.use((req, res, next) => {
  const {
    method,
    url,
    body,
    query,
    files,
  } = req;

  if (url === '/favicon.ico') {
    next();
    return;
  }

  console.log({
    method,
    url,
    body,
    query,
    files: files?.map(file => file?.originalname),
  });

  next();
});

app.use(Router);

app.use((err, req, res, next) => {
  console.log(err);
  if (err.name === 'ValidationError') {
    res.json(ApiUtil.JsonRes({
      success: false,
      errors: err?.errors?.content,
    }));

    return;
  }

  res.json(ApiUtil.JsonRes({
    success: false,
    errors: 'Server error!',
  }));
})

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

export default app;