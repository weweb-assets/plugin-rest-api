export default {
    features: {
        datasource: true,
    },
    editor: {
        collection: {
            edit: () => import('./src/components/CollectionEdit.vue'),
            summary: () => import('./src/components/CollectionSummary.vue'),
            getIsValid(config) {
                return !!config.method && !!config.url;
            },
        },
    },
    actions: [
        {
            name: 'REST API Request',
            code: 'apiRequest',
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/ApiRequest.vue'),
            getIsValid({ url, method }) {
                return !!url && !!method;
            },
            copilot: {
                description: 'Request any REST API endpoint',
                returns: 'any',
                schema: {
                    url: {
                        type: 'string',
                        description: 'The URL to request',
                        bindable: true,
                    },
                    method: {
                        type: 'string',
                        description: 'The HTTP method to use',
                        bindable: true,
                    },
                    data: {
                        type: 'Array<{key: string, value: string} or any if raw body is used',
                        description:
                            'The data to send, the array will be converted to an object, both key and value can be bound to a formula. You can use a different format by using the raw body option, you can then bind the whole property.',
                        bindable: true,
                    },
                    headers: {
                        type: 'Array<{key: string, value: string}',
                        description: 'The headers to send',
                        bindable: true,
                    },
                    queries: {
                        type: 'Array<{key: string, value: string}',
                        description: 'The query string parameters',
                        bindable: true,
                    },
                    dataType: {
                        type: 'string',
                        description: 'The content type for the request',
                        bindable: true,
                    },
                    isThroughServer: {
                        type: 'boolean',
                        description: 'Whether to send the request through the WeWeb server to avoid CORS issues',
                        bindable: true,
                    },
                    useRawBody: {
                        type: 'boolean',
                        description:
                            "Whether to send the data without any transformation, required if data doesn't fit the key-value array format",
                        bindable: true,
                    },
                    isWithCredentials: {
                        type: 'boolean',
                        description: 'Whether to send credentials with the request, such as cookies',
                        bindable: true,
                    },
                },
            },
            /* wwEditor:end */
        },
    ],
};
