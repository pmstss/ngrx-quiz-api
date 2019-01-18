import { Response } from 'express';
import { NextFunction } from 'connect';
import { ApiRequest } from './api-request';
import { ApiResponse } from './api-response';
import { ApiError } from './api-error';

export const writeResponse = (dataPromise: Promise<any>, req: ApiRequest,
                              res: Response, next: NextFunction) => {
    return dataPromise
        .then((data: any) => {
            writeSuccessResponse(req, res, next, data);
        })
        .catch((err) => {
            writeErrorResponse(res, next, err, 400);
        });
};

const writeSuccessResponse = (req: ApiRequest, res: Response,
                              next: NextFunction, data: any) => {
    const apiResponse: ApiResponse = {
        data,
        success: true
    };

    res.json(apiResponse);
};

export const writeErrorResponse = (res: Response, next: NextFunction,
                                   err: any, status?: number) => {
    const statusCode = status || err && err instanceof ApiError && (err as ApiError).status;
    if (statusCode) {
        res.status(statusCode);
    }

    const apiResponse: ApiResponse = {
        success: false,
        message: err.message || err
    };

    res.json(apiResponse);
};
