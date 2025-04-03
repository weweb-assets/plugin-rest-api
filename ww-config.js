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
                returns: `any - response body directly (the action automatically extracts the response body). Access the result using context.workflow['action_ref'].result (NOT .result.data as the data property is already extracted). The returned value structure depends on the API being called.`,
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
                    useRawBody: {
                        type: 'boolean',
                        description:
                            'Controls how the data field is processed:\n' +
                            'false (default): Use UI-friendly key-value pairs array format\n' +
                            'true: Send data field content directly without transformation. When enabled, the data field MUST be bound to a formula returning your payload structure.',
                        bindable: true,
                    },
                    data: {
                        type: 'Array<{key: string, value: string}> | any',
                        description:
                            'How to send request data:\n' +
                            '1. Default mode (UI-friendly): Provide data as an array of key-value pairs. Example: [{key: "name", value: "John"}] will be converted to {name: "John"}\n' +
                            '2. Raw body mode: When enabled, data MUST be bound to a formula returning the exact structure to send. Example: =({name: "John", age: 25})',
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
                            'Whether to send the request through the WeWeb server to avoid CORS issues, use with caution, only when you know the request will fail due to CORS. This option will change the returns format to the whole response object instead (status,statusText,data,headers,config,request), body will not be automatically extracted anymore',
                        bindable: true,
                    },
                    isWithCredentials: {
                        type: 'boolean',
                        description:
                            'Whether to send credentials with the request, such as cookies, cannot be used with isThroughServer, use with caution, many API will fail if you enable this',
                        bindable: true,
                    },
                    useStreaming: {
                        type: 'boolean',
                        description: 'Whether to use streaming',
                        bindable: true,
                    },
                    streamVariableId: {
                        type: 'string',
                        description: 'The variable ID of the array variable that will receive the stream data',
                        bindable: true,
                    },
                },
            },
            /* wwEditor:end */
        },
    ],
};
