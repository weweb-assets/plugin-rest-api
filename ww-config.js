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
                description: 'Make a REST API request using axios with configurable method, URL, headers, and data',
                returns: `any - This action performs an HTTP request using axios and returns response.data directly. The returned value structure depends on the API being called. Access the result using context.workflow['api_request'].result followed by the specific API's response structure.`,
                schema: {
                    url: {
                        type: 'string',
                        description: 'The URL to request',
                        bindable: true,
                    },
                    method: {
                        type: 'string',
                        description: 'The HTTP method to use',
                        bindable: false,
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
                        bindable: false,
                    },
                    isThroughServer: {
                        type: 'boolean',
                        description:
                            'Whether to send the request through the WeWeb server to avoid CORS issues, use with caution, only when you know the request will fail due to CORS. This option will change the returns format to the whole response object instead (status,statusText,data,headers,config,request)',
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
                        description:
                            'Whether to send credentials with the request, such as cookies, cannot be used with isThroughServer, use with caution, many API will fail if you enable this',
                        bindable: true,
                    },
                },
            },
            /* wwEditor:end */
        },
    ],
};
