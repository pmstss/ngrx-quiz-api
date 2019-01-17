export interface ApiResponse {
    success: boolean;
    data?: any;
    message?: string;
    token?: string;
    tokenError?: boolean;
}
