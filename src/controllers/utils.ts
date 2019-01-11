import { Response } from 'express';

export const writeSuccessCallback = (res: Response) => ((data: any) => {
    res.json({
        data,
        success: true
    });
});
