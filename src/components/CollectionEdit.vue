<template>
    <div class="rest-api-collection-edit">
        <wwEditorFormRow label="Method" required>
            <wwEditorSelect
                :options="methodOptions"
                :value="api.method"
                @input="setProp('method', $event)"
                placeholder="Select a method"
                large
            />
        </wwEditorFormRow>
        <wwEditorFormRow label="URL" required>
            <wwEditorFormInput
                type="text"
                name="url"
                :value="api.url"
                @input="setProp('url', $event)"
                placeholder="https://api-url.com/endpoint"
                v-on:keyup.native.enter="$emit('next')"
                large
            />
        </wwEditorFormRow>
        <wwEditorFormRow label="Headers">
            <template slot="append-label">
                <button class="ww-editor-button -primary -small m-auto-left m-bottom" @click="addHeader">
                    Add header field
                </button>
            </template>
            <div
                class="rest-api-collection-edit__row -space-between m-bottom"
                v-for="(header, index) in api.headers"
                :key="index"
            >
                <wwEditorFormInput
                    type="text"
                    :value="header.key"
                    @input="setHeaderProp(index, { key: $event })"
                    placeholder="Key"
                    v-on:keyup.native.enter="$emit('next')"
                />
                <wwEditorFormInput
                    type="text"
                    :value="header.value"
                    @input="setHeaderProp(index, { value: $event })"
                    placeholder="Value"
                    v-on:keyup.native.enter="$emit('next')"
                />
                <button class="ww-editor-button -tertiary -small -icon -red" @click="deleteHeader(index)">
                    <wwEditorIcon class="ww-editor-button-icon" name="delete" small />
                </button>
            </div>
        </wwEditorFormRow>
    </div>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        config: { type: Object, required: true },
    },
    data() {
        return {
            methodOptions: [
                { value: 'GET', label: 'GET' },
                { value: 'POST', label: 'POST' },
                { value: 'PUT', label: 'PUT' },
            ],
        };
    },
    watch: {
        isSetup: {
            immediate: true,
            handler(value) {
                this.$emit('update-is-valid', value);
            },
        },
    },
    computed: {
        isSetup() {
            return !!this.api.method && !!this.api.url;
        },
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
            this.$emit('update-config', { ...this.api, [key]: value });
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
