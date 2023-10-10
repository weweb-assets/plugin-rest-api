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
            aiDescription: {
                description: 'Make an API request with a POST, GET, PUT, PATCH, DELETE or OPTIONS method.',
                return: 'Content of the response',
                syntax: `{
                    "args": {
                        "method": "{{method of the request as string}}",
                        "url": "{{url of the request as string of ACTION_VALUE}}",
                        "isWithCredentials": {{ true to send credentials cookies to the server, false otherwise }},
                        "data": {{data of the request as an array formated like : {"key": "key or ACTION_VALUE", "value": "value or ACTION_VALUE" } }},
                        "headers": {{headers of the request as an array formated like : {"key": "key or ACTION_VALUE", "value": "value or ACTION_VALUE" } }},
                        "queries": {{queries of the request as an array formated like : {"key": "key or ACTION_VALUE", "value": "value or ACTION_VALUE" } }},
                    }
                    
                }`,
            },
            /* wwEditor:end */
        },
    ],
};
