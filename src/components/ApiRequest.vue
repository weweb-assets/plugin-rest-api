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
    <template v-if="isData">
        <wwEditorFormRow>
            <wwEditorInputRadio :choices="dataChoices" :model-value="useRawBody" @update:modelValue="setUseRawBody" />
        </wwEditorFormRow>
        <wwEditorInputRow
            v-if="useRawBody"
            type="query"
            :model-value="data"
            label="Body"
            bindable
            @update:modelValue="setData"
        />
        <wwEditorInputRow
            v-else
            type="array"
            :model-value="data"
            label="Fields"
            bindable
            @update:modelValue="setData"
            @add-item="setData([...(data || []), {}])"
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
    <wwEditorInputRow
        label="Headers"
        type="array"
        :model-value="headers"
        bindable
        @update:modelValue="setHeaders"
        @add-item="setHeaders([...(headers || []), {}])"
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
        @add-item="setQueries([...(queries || []), {}])"
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
    <wwEditorFormRow v-if="isData" label="Content type">
        <wwEditorInputTextSelect
            :options="dataTypeOptions"
            :model-value="dataType"
            small
            @update:modelValue="setDataType"
        />
    </wwEditorFormRow>
    <wwEditorFormRow label="Proxy request server side (bypass CORS)">
        <div class="flex items-center">
            <wwEditorInput
                type="onoff"
                bindable
                small
                :model-value="isThroughServer"
                @update:modelValue="setIsThroughServer"
            />
            <wwEditorQuestionMark
                v-if="dataType === 'multipart/form-data'"
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
    <wwEditorFormRow v-if="!isThroughServer">
        <div class="flex items-center">
            <wwEditorInputSwitch :model-value="isWithCredentials" @update:modelValue="setIsWithCredentials" />
            <div class="body-2 ml-2">Send credentials</div>
            <wwEditorQuestionMark tooltip-position="top-left" tooltip-name="rest-api-credentials" class="ml-auto" />
        </div>
    </wwEditorFormRow>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: {
            type: Object,
            default: () => ({
                url: null,
                method: null,
                data: [],
                headers: [],
                queries: [],
                dataType: null,
                isThroughServer: false,
                isWithCredentials: false,
            }),
        },
    },
    emits: ['update:args'],
    data() {
        return {
            dataChoices: [
                { label: 'Parsed fields', value: false, default: true },
                { label: 'Raw body', value: true },
            ],
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
                { label: 'application/javascript', value: 'application/javascript' },
                { label: 'application/xml', value: 'application/xml' },
                { label: 'application/merge-patch+json', value: 'application/merge-patch+json' },
                { label: 'multipart/form-data', value: 'multipart/form-data' },
                { label: 'text/plain', value: 'text/plain' },
                { label: 'text/html', value: 'text/html' },
            ],
        };
    },
    computed: {
        url() {
            return this.args.url;
        },
        method() {
            return this.args.method;
        },
        data() {
            return this.args.data || [];
        },
        headers() {
            return this.args.headers || [];
        },
        queries() {
            return this.args.queries || [];
        },
        dataType() {
            return this.args.dataType;
        },
        isThroughServer() {
            return this.args.isThroughServer || false;
        },
        isWithCredentials() {
            return this.args.isWithCredentials || false;
        },
        useRawBody() {
            return this.args.useRawBody || false;
        },
        isData() {
            return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(this.method);
        },
    },
    mounted() {
        if (!this.method) this.setMethod('POST');
    },
    methods: {
        setUrl(url) {
            this.$emit('update:args', { ...this.args, url });
        },
        setMethod(method) {
            this.$emit('update:args', { ...this.args, method });
        },
        setData(data) {
            this.$emit('update:args', { ...this.args, data });
        },
        setQueries(queries) {
            this.$emit('update:args', { ...this.args, queries });
        },
        setHeaders(headers) {
            this.$emit('update:args', { ...this.args, headers });
        },
        setDataType(dataType) {
            this.$emit('update:args', {
                ...this.args,
                dataType,
                isThroughServer: dataType === 'multipart/form-data' ? false : this.isThroughServer,
            });
        },
        setIsThroughServer(isThroughServer) {
            if (this.dataType === 'multipart/form-data' && isThroughServer) return;
            this.$emit('update:args', { ...this.args, isThroughServer });
        },
        setIsWithCredentials(isWithCredentials) {
            this.$emit('update:args', { ...this.args, isWithCredentials });
        },
        setUseRawBody(useRawBody) {
            this.$emit('update:args', { ...this.args, useRawBody, data: useRawBody ? null : [] });
        },
    },
};
</script>
