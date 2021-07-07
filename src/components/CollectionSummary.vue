<template>
    <div class="rest-api-collection-summary">
        <div class="rest-api-collection-summary__elem caption-s">Method: {{ config.method || '-' }}</div>
        <div class="rest-api-collection-summary__elem caption-s">URL: {{ config.url || '-' }}</div>
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
    &__elem {
        margin-bottom: var(--ww-spacing-01);
    }
}
</style>
