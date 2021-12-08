<template>
    <wwEditorFormRow label="Method" required>
        <wwEditorInputTextSelect
            :options="methodOptions"
            :model-value="method"
            placeholder="Select a method"
            @update:modelValue="setMethod"
        />
    </wwEditorFormRow>
    <wwEditorInputRow
        label="URL"
        required
        type="query"
        :model-value="url"
        placeholder="https://api-url.com/endpoint"
        bindable
        @update:modelValue="setUrl"
    />
    <wwEditorInputRow
        v-if="isFields"
        type="array"
        :model-value="fields"
        label="Fields"
        bindable
        @update:modelValue="setFields"
        @add-item="setFields([...fields, {}])"
    >
        <template #default="{ item, setItem }">
            <wwEditorInputRow
                type="query"
                :model-value="item.key"
                label="Key"
                placeholder="Enter a value"
                bindable
                small
                @update:modelValue="setItem({ ...item, key: $event })"
            />
            <wwEditorInputRow
                type="query"
                :model-value="item.value"
                label="Value"
                placeholder="Enter a value"
                bindable
                small
                @update:modelValue="setItem({ ...item, value: $event })"
            />
        </template>
    </wwEditorInputRow>
    <wwEditorInputRow
        label="Headers"
        type="array"
        :model-value="headers"
        bindable
        @update:modelValue="setHeaders"
        @add-item="setHeaders([...headers, {}])"
    >
        <template #default="{ item, setItem }">
            <wwEditorInputRow
                type="query"
                :model-value="item.key"
                label="Key"
                placeholder="Enter a value"
                bindable
                small
                @update:modelValue="setItem({ ...item, key: $event })"
            />
            <wwEditorInputRow
                type="query"
                :model-value="item.value"
                label="Value"
                placeholder="Enter a value"
                bindable
                small
                @update:modelValue="setItem({ ...item, value: $event })"
            />
        </template>
    </wwEditorInputRow>
    <wwEditorInputRow
        type="array"
        :model-value="query"
        label="Query string"
        bindable
        @update:modelValue="setQuery"
        @add-item="setQuery([...query, {}])"
    >
        <template #default="{ item, setItem }">
            <wwEditorInputRow
                type="query"
                :model-value="item.key"
                label="Key"
                placeholder="Enter a value"
                bindable
                small
                @update:modelValue="setItem({ ...item, key: $event })"
            />
            <wwEditorInputRow
                type="query"
                :model-value="item.value"
                label="Value"
                placeholder="Enter a value"
                bindable
                small
                @update:modelValue="setItem({ ...item, value: $event })"
            />
        </template>
    </wwEditorInputRow>
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
                { label: 'GET', value: 'GET' },
                { label: 'POST', value: 'POST', default: true },
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
            return this.args[2] || [];
        },
        headers() {
            return this.args[3] || [];
        },
        query() {
            return this.args[4] || [];
        },
        isFields() {
            return ['POST', 'PUT', 'PATCH'].includes(this.method);
        },
    },
    mounted() {
        if (!this.method) this.setMethod('POST');
    },
    methods: {
        setUrl(url) {
            this.$emit('update:args', [url, this.method, this.fields, this.headers, this.query]);
        },
        setMethod(method) {
            this.$emit('update:args', [this.url, method, this.fields, this.headers, this.query]);
        },
        setFields(fields) {
            this.$emit('update:args', [this.url, this.method, fields, this.headers, this.query]);
        },
        setQuery(query) {
            this.$emit('update:args', [this.url, this.method, this.fields, this.headers, query]);
        },
        setHeaders(headers) {
            this.$emit('update:args', [this.url, this.method, this.fields, headers, this.query]);
        },
    },
};
</script>
