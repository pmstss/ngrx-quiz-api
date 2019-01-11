export const quizMetaSchemaShort = {
    required: [
        'id',
        'shortName',
        'name',
        'description',
        'descriptionFull',
        'randomizeItems',
        'timeLimit'
    ],
    properties: {
        id: {
            type: 'string'
        },
        shortName: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        description: {
            type: 'string'
        },
        descriptionFull: {
            type: 'string'
        },
        randomizeItems: {
            type: 'boolean'
        },
        timeLimit: {
            type: 'integer',
            format: 'int32'
        }
    }
};

export const quizMetaSchema = {
    required: [
        ...quizMetaSchemaShort.required,
        'items'
    ],
    properties: {
        ...quizMetaSchemaShort.properties,
        items: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    }
                }
            }
        }
    }
};
