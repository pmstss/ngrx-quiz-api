import { Request } from 'express';
import { TokenData } from '../token/token-data';

export interface ApiRequest extends Request {
    tokenData: TokenData;
}
