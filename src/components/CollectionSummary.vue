<template>
    <div class="rest-api-collection-summary">
        <div class="label-sm content-primary">Method</div>
        <div class="body-sm content-secondary">{{ config.method || '-' }}</div>
        <div class="label-sm content-primary">URL</div>
        <div class="body-sm content-secondary truncate">{{ config.url || '-' }}</div>
    </div>
</template>

<script>
export default {
    props: {
        config: { type: Object, required: true },
    },
};
</script>

<style lang="scss" scoped>
.rest-api-collection-summary {
    display: grid;
    grid-template-columns: 0fr 1fr;
    column-gap: var(--ww-spacing-02);
    row-gap: var(--ww-spacing-02);
}
</style>
