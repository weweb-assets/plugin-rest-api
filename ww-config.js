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
            name: 'Request',
            code: 'request',
            parameters: [
                { name: 'url', type: 'string' },
                { name: 'method', type: 'string' },
                { name: 'fields', type: 'object', optional: true },
                { name: 'query', type: 'object', optional: true },
                { name: 'headers', type: 'object', optional: true },
            ],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Request.vue'),
            getIsValid([url, method]) {
                return !!url && !!method;
            },
            /* wwEditor:end */
        },
    ],
};
