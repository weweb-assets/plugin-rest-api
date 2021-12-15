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
        v-if="isData"
        type="array"
        :model-value="data"
        label="Fields"
        bindable
        @update:modelValue="setData"
        @add-item="setData([...data, {}])"
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
        :model-value="queries"
        label="Query string"
        bindable
        @update:modelValue="setQueries"
        @add-item="setQueries([...queries, {}])"
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
    <wwEditorFormRow v-if="isData" label="Fields type">
        <wwEditorInputTextSelect
            :options="dataTypeOptions"
            :model-value="dataType"
            small
            @update:modelValue="setDataType"
        />
    </wwEditorFormRow>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: { type: Array, default: () => [null, null, [], [], [], null] },
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
            dataTypeOptions: [
                { label: 'Default (application/json)', value: 'application/json', default: true },
                { label: 'application/x-www-form-urlencoded', value: 'application/x-www-form-urlencoded' },
                { label: 'multipart/form-data', value: 'multipart/form-data' },
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
        data() {
            return this.args[2] || [];
        },
        headers() {
            return this.args[3] || [];
        },
        queries() {
            return this.args[4] || [];
        },
        dataType() {
            return this.args[5];
        },
        isData() {
            return ['POST', 'PUT', 'PATCH'].includes(this.method);
        },
    },
    mounted() {
        if (!this.method) this.setMethod('POST');
    },
    methods: {
        setUrl(url) {
            this.$emit('update:args', [url, this.method, this.data, this.headers, this.queries, this.dataType]);
        },
        setMethod(method) {
            this.$emit('update:args', [this.url, method, this.data, this.headers, this.queries, this.dataType]);
        },
        setData(data) {
            this.$emit('update:args', [this.url, this.method, data, this.headers, this.queries, this.dataType]);
        },
        setQueries(queries) {
            this.$emit('update:args', [this.url, this.method, this.data, this.headers, queries, this.dataType]);
        },
        setHeaders(headers) {
            this.$emit('update:args', [this.url, this.method, this.data, headers, this.queries, this.dataType]);
        },
        setDataType(dataType) {
            this.$emit('update:args', [this.url, this.method, this.data, this.headers, this.queries, dataType]);
        },
    },
};
</script>
