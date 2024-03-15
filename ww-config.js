export default {
    editor: {
        iconPath: '/src/assets/restapi.svg',
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
            /* wwEditor:end */
        },
    ],
};
