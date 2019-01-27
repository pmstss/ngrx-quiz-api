import { Request, Response } from 'express';
import { NextFunction } from 'connect';
import { ApiResponse } from 'ngrx-quiz-common';
import { ApiError } from './api-error';

const MAX_ERROR_LENGTH = 200;

export const writeResponse = <T>(dataPromise: Promise<T>, req: Request,
                                 res: Response, next: NextFunction): Promise<T> => {
    return dataPromise
        .then((data: T) => {
            writeSuccessResponse(req, res, next, data);
        })
        .catch((err) => {
            writeErrorResponse(res, next, err);
        })
        .then(() => dataPromise); // for type checking in contollers
};

const writeSuccessResponse = <T>(req: Request, res: Response,
                                 next: NextFunction, data: T) => {
    const apiResponse: ApiResponse<T> = {
        data,
        success: true
    };

    res.json(apiResponse);
};

export const writeErrorResponse = (res: Response, next: NextFunction,
                                   err: any, status?: number): null => {
    const statusCode = status || err && err instanceof ApiError && (err as ApiError).status || 400;
    if (statusCode) {
        res.status(statusCode);
    }

    const apiResponse: ApiResponse<void> = {
        success: false,
        message: err.message || err
    };

    if (apiResponse.message && apiResponse.message.length > MAX_ERROR_LENGTH) {
        // tslint:disable-next-line prefer-template
        apiResponse.message = apiResponse.message.substr(0, MAX_ERROR_LENGTH) + '...';
    }

    res.json(apiResponse);
    return null;
};
