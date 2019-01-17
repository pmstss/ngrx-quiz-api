import { Request } from 'express';
import { TokenService } from './token-service';

export interface RequestWithToken extends Request {
    tokenService: TokenService;
}
