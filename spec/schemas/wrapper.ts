export const wrapArray = (itemSchema: any) => ({
    required: [
        'data',
        'success'
    ],
    properties: {
        success: {
            type: 'boolean'
        },
        data: {
            type: 'array',
            items: itemSchema
        }
    }
});

export const wrap = (itemSchema: any) => ({
    required: [
        'data',
        'success'
    ],
    properties: {
        success: {
            type: 'boolean'
        },
        data: {
            type: 'object',
            ...itemSchema
        }
    }
});
