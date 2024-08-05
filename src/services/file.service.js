import path from 'path';
import mongoose from "mongoose";

import {rootPath as publicPath} from "#root/public/index.js";
import FileModel from "#root/models/file.model.js";
import fs from "fs";

export const Destination = class {
    static PUBLIC = publicPath;
    static BLOCKLY = `${publicPath}/blockly`
};

export default class FileService {
    static read = (props) => {
        const {path, hasRemove} = {
            hasRemove: false,
            ...props,
        };

        const data = fs.readFileSync(path, {
            encoding: 'utf8',
        });

        if (hasRemove) {
            fs.unlink(path, () => {
            });
        }

        return data;
    }

    static create = async (props) => {
        const {files, destination} = {
            destination: Destination.PUBLIC,
            ...props
        };

        const fileFormats = files.map(file => {
            const id = new mongoose.Types.ObjectId();

            const extend = path.extname(file.originalname);
            const physicalName = `${id}${extend}`;

            return {
                oldPath: file.path,
                displayName: file.originalname,
                physicalName: physicalName,
                destination: destination,
                path: `${destination}/${physicalName}`,
            }
        });

        for (const file of fileFormats) {
            fs.rename(file?.oldPath, file.path, () => {
            });
        }

        const result = await FileModel.create(fileFormats);

        return result;
    }
}