module.exports = {
    componentPath: './src/index.js',
    editor: {
        collection: {
            edit: () => import('./src/components/CollectionEdit.vue'),
            summary: () => import('./src/components/CollectionSummary.vue'),
        },
    },
};
