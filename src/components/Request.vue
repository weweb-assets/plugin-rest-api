<template>
    <wwEditorFormRow label="URL" required>
        <wwEditorInput
            type="query"
            :model-value="url"
            placeholder="Enter a URL"
            label="URL"
            bindable
            @update:modelValue="setUrl"
        />
    </wwEditorFormRow>
    <wwEditorFormRow label="Method" required>
        <wwEditorInputTextSelect
            :options="methodOptions"
            :model-value="method"
            placeholder="Select a method"
            @update:modelValue="setMethod"
        />
    </wwEditorFormRow>
    <wwEditorFormRow label="Fields">
        <wwEditorInput type="object" :model-value="fields" label="Fields" bindable @update:modelValue="setFields" />
    </wwEditorFormRow>
    <wwEditorFormRow label="Query">
        <wwEditorInput type="object" :model-value="query" label="Query" bindable @update:modelValue="setQuery" />
    </wwEditorFormRow>
    <wwEditorFormRow label="Headers">
        <wwEditorInput type="object" :model-value="headers" label="Headers" bindable @update:modelValue="setHeaders" />
    </wwEditorFormRow>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: { type: Array, default: () => [null, null] },
    },
    emits: ['update:args'],
    data() {
        return {
            methodOptions: [
                { label: 'POST', value: 'POST' },
                { label: 'GET', value: 'GET' },
                { label: 'PUT', value: 'PUT' },
                { label: 'PATCH', value: 'PATCH' },
                { label: 'DELETE', value: 'DELETE' },
                { label: 'OPTIONS', value: 'OPTIONS' },
            ],
        };
    },
    computed: {
        url() {
            return this.args[0];
        },
        method() {
            return this.args[1];
        },
        fields() {
            return this.args[2];
        },
        query() {
            return this.args[3];
        },
        headers() {
            return this.args[4];
        },
    },
    methods: {
        setUrl(url) {
            this.$emit('update:args', [url, this.method, this.fields, this.query, this.headers]);
        },
        setMethod(method) {
            this.$emit('update:args', [this.url, method, this.fields, this.query, this.headers]);
        },
        setFields(fields) {
            this.$emit('update:args', [this.url, this.method, fields, this.query, this.headers]);
        },
        setQuery(query) {
            this.$emit('update:args', [this.url, this.method, this.fields, query, this.headers]);
        },
        setHeaders(headers) {
            this.$emit('update:args', [this.url, this.method, this.fields, this.query, headers]);
        },
    },
};
</script>
