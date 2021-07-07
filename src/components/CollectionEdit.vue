<template>
    <div class="rest-api-collection-edit">
        <wwEditorFormRow label="Method" required>
            <wwEditorSelect
                :options="methodOptions"
                :model-value="api.method"
                placeholder="Select a method"
                large
                @update:modelValue="setProp('method', $event)"
            />
        </wwEditorFormRow>
        <wwEditorFormRow label="URL" required>
            <wwEditorFormInput
                type="text"
                name="url"
                :model-value="api.url"
                placeholder="https://api-url.com/endpoint"
                large
                @update:modelValue="setProp('url', $event)"
            />
        </wwEditorFormRow>
        <wwEditorFormRow label="Headers">
            <template #append-label>
                <button type="button" class="ww-editor-button -primary -small m-auto-left m-bottom" @click="addHeader">
                    Add header field
                </button>
            </template>
            <div
                v-for="(header, index) in api.headers"
                :key="index"
                class="rest-api-collection-edit__row -space-between m-bottom"
            >
                <wwEditorFormInput
                    type="text"
                    :model-value="header.key"
                    placeholder="Key"
                    @update:modelValue="setHeaderProp(index, { key: $event })"
                />
                <wwEditorFormInput
                    type="text"
                    :model-value="header.value"
                    placeholder="Value"
                    @update:modelValue="setHeaderProp(index, { value: $event })"
                />
                <button type="button" class="ww-editor-button -tertiary -small -icon -red" @click="deleteHeader(index)">
                    <wwEditorIcon class="ww-editor-button-icon" name="delete" small />
                </button>
            </div>
        </wwEditorFormRow>
    </div>
</template>

<script>
export default {
    props: {
        config: { type: Object, required: true },
    },
    emits: ['update:config'],
    data() {
        return {
            methodOptions: [
                { value: 'GET', label: 'GET' },
                { value: 'POST', label: 'POST' },
                { value: 'PUT', label: 'PUT' },
            ],
        };
    },
    computed: {
        api() {
            return {
                method: 'GET',
                url: undefined,
                headers: [],
                ...this.config,
            };
        },
    },
    methods: {
        addHeader() {
            const headers = _.cloneDeep(this.api.headers || []);
            headers.push({ key: '', value: '' });
            this.setProp('headers', headers);
        },
        setHeaderProp(index, value) {
            const headers = _.cloneDeep(this.api.headers);
            headers.splice(index, 1, { ...headers[index], ...value });
            this.setProp('headers', headers);
        },
        deleteHeader(index) {
            const headers = _.cloneDeep(this.api.headers);
            headers.splice(index, 1);
            this.setProp('headers', headers);
        },
        setProp(key, value) {
            this.$emit('update:config', { ...this.api, [key]: value });
        },
    },
};
</script>

<style scoped lang="scss">
.rest-api-collection-edit {
    display: flex;
    flex-direction: column;
    &__row {
        display: flex;
        align-items: center;
        &.-space-between {
            justify-content: space-between;
        }
    }
    .m-auto-left {
        margin-left: auto;
    }
    .m-bottom {
        margin-bottom: var(--ww-spacing-02);
    }
}
</style>
