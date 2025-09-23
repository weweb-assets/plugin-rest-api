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
        <template v-if="isFields">
            <wwEditorFormRow>
                <wwEditorInputRadio
                    :choices="dataChoices"
                    :model-value="api.useRawBody"
                    @update:modelValue="setProp('useRawBody', $event)"
                />
            </wwEditorFormRow>
            <wwEditorInputRow
                v-if="api.useRawBody"
                type="query"
                :model-value="api.data"
                label="Body"
                :bindable="collection.mode === 'dynamic'"
                @update:modelValue="setProp('data', $event)"
            />
            <wwEditorInputRow
                v-else
                label="Fields"
                type="array"
                :model-value="api.data"
                :bindable="collection.mode === 'dynamic'"
                @update:modelValue="setProp('data', $event)"
                @add-item="setProp('data', [...(api.data || []), {}])"
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
        </template>
        <wwEditorInputRow
            label="Headers"
            type="array"
            :model-value="api.headers"
            :bindable="collection.mode === 'dynamic'"
            @update:modelValue="setProp('headers', $event)"
            @add-item="setProp('headers', [...(api.headers || []), {}])"
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
            @add-item="setProp('queries', [...(api.queries || []), {}])"
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
        <wwEditorFormRow v-if="isFields" label="Content type">
            <wwEditorInputTextSelect
                :options="dataTypeOptions"
                :model-value="api.dataType"
                small
                @update:modelValue="setProp('dataType', $event)"
            />
        </wwEditorFormRow>
        <wwEditorFormRow label="Result key">
            <wwEditorInputText
                type="text"
                :model-value="api.resultKey"
                placeholder="result.key"
                small
                @update:modelValue="setProp('resultKey', $event)"
            />
        </wwEditorFormRow>
        <wwEditorFormRow v-if="collection.mode === 'dynamic'" label="Proxy request server side (bypass CORS)">
            <div class="flex items-center">
                <wwEditorInput
                    type="onoff"
                    bindable
                    small
                    :model-value="api.isThroughServer"
                    @update:modelValue="
                        setProp('isThroughServer', api.dataType === 'multipart/form-data' ? false : $event)
                    "
                />
                <wwEditorQuestionMark
                    v-if="api.dataType === 'multipart/form-data'"
                    tooltip-position="top-left"
                    forced-content="Not allowed with content-type multipart/form-data"
                    class="ml-2 text-yellow-500"
                />
                <wwEditorQuestionMark
                    v-else
                    tooltip-position="top-left"
                    tooltip-name="rest-api-through-server"
                    class="ml-2"
                />
            </div>
        </wwEditorFormRow>
        <wwEditorFormRow v-if="collection.mode === 'dynamic' && !api.isThroughServer">
            <div class="flex items-center">
                <wwEditorInputSwitch
                    :model-value="api.isWithCredentials"
                    @update:modelValue="setProp('isWithCredentials', $event)"
                />
                <div class="body-2 ml-2">Send credentials</div>
                <wwEditorQuestionMark tooltip-position="top-left" tooltip-name="rest-api-credentials" class="ml-auto" />
            </div>
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
            dataChoices: [
                { label: 'Parsed fields', value: false, default: true },
                { label: 'Raw body', value: true },
            ],
            dataTypeOptions: [
                { label: 'Default (application/json)', value: 'application/json', default: true },
                { label: 'application/x-www-form-urlencoded', value: 'application/x-www-form-urlencoded' },
                { label: 'application/javascript', value: 'application/javascript' },
                { label: 'application/xml', value: 'application/xml' },
                { label: 'application/merge-patch+json', value: 'application/merge-patch+json' },
                { label: 'multipart/form-data', value: 'multipart/form-data' },
                { label: 'text/plain', value: 'text/plain' },
                { label: 'text/html', value: 'text/html' },
            ],
            methodOptions: [
                { value: 'GET', label: 'GET', default: true },
                { value: 'POST', label: 'POST' },
                { value: 'PUT', label: 'PUT' },
                { value: 'PATCH', label: 'PATCH' },
            ],
        };
    },
    watch: {
        'api.dataType'(value) {
            if (value === 'multipart/form-data' && this.api.isThroughServer) {
                this.setProp('isThroughServer', false);
            }
        },
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
                dataType: undefined,
                isThroughServer: false,
                isWithCredentials: false,
                useRawBody: false,
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
