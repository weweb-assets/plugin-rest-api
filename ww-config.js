export default {
    editor: {
        collection: {
            edit: () => import('./src/components/CollectionEdit.vue'),
            summary: () => import('./src/components/CollectionSummary.vue'),
            getIsValid(config) {
                return !!config.method && !!config.url;
            },
        },
    },
    functions: [
        {
            name: 'Api Request',
            code: 'apiRequest',
            parameters: [
                { name: 'url', type: 'string' },
                { name: 'method', type: 'string' },
                { name: 'fields', type: 'array', optional: true },
                { name: 'headers', type: 'array', optional: true },
                { name: 'query', type: 'array', optional: true },
            ],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/ApiRequest.vue'),
            getIsValid([url, method]) {
                return !!url && !!method;
            },
            /* wwEditor:end */
        },
    ],
};
