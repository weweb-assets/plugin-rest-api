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
                description: 'Make a REST API request with configurable method, URL, headers, and data',
                returns: 'object',
                schema: {
                    url: {
                        type: 'string',
                        description: 'The URL endpoint to make the request to',
                        bindable: true
                    },
                    method: {
                        type: 'string',
                        description: 'HTTP method (GET, POST, PUT, PATCH, DELETE, OPTIONS)',
                        bindable: false
                    },
                    data: {
                        type: 'array',
                        description: 'Request body data as key-value pairs or raw body content',
                        bindable: true
                    },
                    headers: {
                        type: 'array',
                        description: 'HTTP headers as key-value pairs',
                        bindable: true
                    },
                    queries: {
                        type: 'array',
                        description: 'URL query parameters as key-value pairs',
                        bindable: true
                    },
                    dataType: {
                        type: 'string',
                        description: 'Content-Type header for the request',
                        bindable: false
                    },
                    isThroughServer: {
                        type: 'boolean',
                        description: 'Whether to proxy the request through WeWeb server to bypass CORS',
                        bindable: false
                    },
                    isWithCredentials: {
                        type: 'boolean',
                        description: 'Whether to send credentials with the request',
                        bindable: true
                    },
                    useRawBody: {
                        type: 'boolean',
                        description: 'Whether to send data as raw body instead of key-value pairs',
                        bindable: false
                    }
                }
            },
            /* wwEditor:end */
        },
    ],
};
