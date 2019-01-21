import { Request } from 'express';
import { TokenData } from '../token/token-data';
import { StateService } from '../state/state-service';

export interface ApiRequest extends Request {
    tokenData: TokenData;
    stateService: StateService;
}
