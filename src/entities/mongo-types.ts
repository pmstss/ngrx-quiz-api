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
