<template>
    <div class="rest-api-collection-edit">
        <wwEditorFormRow label="Method" required>
            <wwEditorInputTextSelect
                :options="methodOptions"
                :model-value="api.method"
                placeholder="Select a method"
                @update:modelValue="setProp('method', $event)"
            />
        </wwEditorFormRow>
        <wwEditorInputRow
            label="URL"
            required
            type="query"
            name="url"
            :model-value="api.url"
            placeholder="https://api-url.com/endpoint"
            :bindable="collection.mode === 'dynamic'"
            @update:modelValue="setProp('url', $event)"
        />
        <wwEditorInputRow
            v-if="isFields"
            label="Fields"
            type="array"
            :model-value="api.data"
            :bindable="collection.mode === 'dynamic'"
            @update:modelValue="setProp('data', $event)"
            @add-item="setProp('data', [...api.data, {}])"
        >
            <template #default="{ item, setItem }">
                <wwEditorInputRow
                    type="query"
                    :model-value="item.key"
                    label="Key"
                    placeholder="Enter a value"
                    small
                    :bindable="collection.mode === 'dynamic'"
                    @update:modelValue="setItem({ ...item, key: $event })"
                />
                <wwEditorInputRow
                    type="query"
                    :model-value="item.value"
                    label="Value"
                    placeholder="Enter a value"
                    small
                    :bindable="collection.mode === 'dynamic'"
                    @update:modelValue="setItem({ ...item, value: $event })"
                />
            </template>
        </wwEditorInputRow>
        <wwEditorInputRow
            label="Headers"
            type="array"
            :model-value="api.headers"
            :bindable="collection.mode === 'dynamic'"
            @update:modelValue="setProp('headers', $event)"
            @add-item="setProp('headers', [...api.headers, {}])"
        >
            <template #default="{ item, setItem }">
                <wwEditorInputRow
                    type="query"
                    :model-value="item.key"
                    label="Key"
                    placeholder="Enter a value"
                    small
                    :bindable="collection.mode === 'dynamic'"
                    @update:modelValue="setItem({ ...item, key: $event })"
                />
                <wwEditorInputRow
                    type="query"
                    :model-value="item.value"
                    label="Value"
                    placeholder="Enter a value"
                    small
                    :bindable="collection.mode === 'dynamic'"
                    @update:modelValue="setItem({ ...item, value: $event })"
                />
            </template>
        </wwEditorInputRow>
        <wwEditorInputRow
            label="Query string"
            type="array"
            :model-value="api.queries"
            :bindable="collection.mode === 'dynamic'"
            @update:modelValue="setProp('queries', $event)"
            @add-item="setProp('queries', [...api.queries, {}])"
        >
            <template #default="{ item, setItem }">
                <wwEditorInputRow
                    type="query"
                    :model-value="item.key"
                    label="Key"
                    placeholder="Enter a value"
                    small
                    :bindable="collection.mode === 'dynamic'"
                    @update:modelValue="setItem({ ...item, key: $event })"
                />
                <wwEditorInputRow
                    type="query"
                    :model-value="item.value"
                    label="Value"
                    placeholder="Enter a value"
                    small
                    :bindable="collection.mode === 'dynamic'"
                    @update:modelValue="setItem({ ...item, value: $event })"
                />
            </template>
        </wwEditorInputRow>
        <wwEditorFormRow label="Result key">
            <wwEditorInputText
                type="text"
                :model-value="api.resultKey"
                placeholder="result.key"
                small
                @update:modelValue="setProp('resultKey', $event)"
            />
        </wwEditorFormRow>
    </div>
</template>

<script>
export default {
    props: {
        collection: { type: Object, required: true },
        config: { type: Object, required: true },
    },
    emits: ['update:config'],
    data() {
        return {
            methodOptions: [
                { value: 'GET', label: 'GET', default: true },
                { value: 'POST', label: 'POST' },
                { value: 'PUT', label: 'PUT' },
                { value: 'PATCH', label: 'PATCH' },
            ],
        };
    },
    computed: {
        api() {
            return {
                method: 'GET',
                url: undefined,
                headers: [],
                queries: [],
                data: [],
                resultKey: '',
                ...this.config,
            };
        },
        isFields() {
            return ['POST', 'PUT', 'PATCH'].includes(this.api.method);
        },
    },
    methods: {
        setProp(key, value) {
            this.$emit('update:config', { ...this.api, [key]: value });
        },
    },
};
</script>
