import { Response } from 'express';
import { NextFunction } from 'connect';
import { RequestWithToken } from '../token/request-with-token';
import { ApiResponse } from './api-response';
import { ApiError } from './api-error';

export const writeRepoResponse = (repoResult: Promise<any>, req: RequestWithToken,
                                  res: Response, next: NextFunction) => {
    return repoResult
        .then((data: any) => {
            writeSuccessResponse(req, res, next, data);
        })
        .catch((err) => {
            writeErrorResponse(res, next, err, 400);
        });
};

export const writeSuccessResponse = (req: RequestWithToken, res: Response,
                                     next: NextFunction, data: any, resetToken = false) => {
    const apiResponse: ApiResponse = {
        data,
        success: true
    };

    if (req.tokenService && req.tokenService.isModified()) {
        apiResponse.token = req.tokenService.sign();
    }

    if (resetToken) {
        apiResponse.token = null;
    }

    res.json(apiResponse);
};

export const writeErrorResponse = (res: Response, next: NextFunction,
                                   err: any, status?: number) => {
    const statusCode = status || (err instanceof ApiError ? (err as ApiError).status : 0);
    if (statusCode) {
        res.status(statusCode);
    }

    const apiResponse: ApiResponse = {
        success: false,
        message: err.message || err
    };

    if (err && err.tokenError) {
        apiResponse.tokenError = true;
    }

    res.json(apiResponse);
};
