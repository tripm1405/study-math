import ApiUtil from "#root/utils/api.util.js";

function preLog(req, res, next) {
    try {
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

        const result = {};
        if (Object.keys(body || {}).length > 0) {
            result.body = Object.keys(body).reduce((result, key) => {
                return {
                    ...result,
                    [key]: body[key],
                }
            }, {});
        }
        if (Object.keys(query || {}).length > 0) {
            result.query = query;
        }
        if (Object.keys(files || {}).length > 0) {
            result.files = files.map(file => {
                return {
                    fieldname: file.fieldname,
                    originalname: file.originalname,
                }
            });
        }

        console.log(`${method} ${url}`, result);
    }
    finally {
        next();
    }
}

function handleError(err, req, res, next) {
    console.log('err', err);
    console.log('err.name', err.name);
    console.log('err?.errors', err?.errors);
    if (err.name === 'ValidationError') {
        res.json(ApiUtil.JsonRes({
            success: false,
            errors: err?.errors,
            code: 400,
        }));

        return;
    }

    res.json(ApiUtil.JsonRes({
        success: false,
        errors: 'Server error!',
        code: 500,
    }));
}

export default {
    preLog: preLog,
    handleError: handleError,
}