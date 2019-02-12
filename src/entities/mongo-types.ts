/*
 * Project: ngrx-quiz-api (https://github.com/pmstss/ngrx-quiz-api)
 * Copyright 2019 Viachaslau Tyshkavets
 * Licensed under the GPLv3 License. See LICENSE.txt in the project root for license information.
 */
export interface DeleteResult {
    ok: number;
    n: number;
}

export interface UpdateResult {
    ok: number;
    n: number;
    nModified: number;
}

export interface BucketResult {
    _id: number | string;
    count: number;
}
