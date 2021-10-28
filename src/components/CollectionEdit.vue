<template>
    <div class="rest-api-collection-edit">
        <wwEditorFormRow label="Method" required>
            <wwEditorInputTextSelect
                :options="methodOptions"
                :model-value="api.method"
                placeholder="Select a method"
                large
                @update:modelValue="setProp('method', $event)"
            />
        </wwEditorFormRow>
        <wwEditorFormRow label="URL" required>
            <wwEditorInputText
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
                <button type="button" class="ww-editor-button -icon -primary -small m-auto-left" @click="addHeader">
                    <wwEditorIcon class="ww-editor-button-icon" name="add" small />
                </button>
            </template>
            <div
                v-for="(header, index) in api.headers"
                :key="index"
                class="rest-api-collection-edit__row -space-between"
                :class="{ 'm-top': index }"
            >
                <wwEditorInputText
                    class="rest-api-collection-edit__input"
                    type="text"
                    :model-value="header.key"
                    placeholder="Key"
                    small
                    @update:modelValue="setHeaderProp(index, { key: $event })"
                />
                <wwEditorInputText
                    class="rest-api-collection-edit__input"
                    type="text"
                    :model-value="header.value"
                    placeholder="Value"
                    small
                    @update:modelValue="setHeaderProp(index, { value: $event })"
                />
                <button type="button" class="ww-editor-button -tertiary -small -icon -red" @click="deleteHeader(index)">
                    <wwEditorIcon class="ww-editor-button-icon" name="delete" small />
                </button>
            </div>
        </wwEditorFormRow>
        <wwEditorFormRow label="Query">
            <template #append-label>
                <button type="button" class="ww-editor-button -icon -primary -small m-auto-left" @click="addQuery">
                    <wwEditorIcon class="ww-editor-button-icon" name="add" small />
                </button>
            </template>
            <div
                v-for="(query, index) in api.queries"
                :key="index"
                class="rest-api-collection-edit__row -space-between"
                :class="{ 'm-top': index }"
            >
                <wwEditorInputText
                    class="rest-api-collection-edit__input"
                    type="text"
                    :model-value="query.key"
                    placeholder="Key"
                    small
                    @update:modelValue="setQueryProp(index, { key: $event })"
                />
                <wwEditorInputText
                    class="rest-api-collection-edit__input"
                    type="text"
                    :model-value="query.value"
                    placeholder="Value"
                    small
                    @update:modelValue="setQueryProp(index, { value: $event })"
                />
                <button type="button" class="ww-editor-button -tertiary -small -icon -red" @click="deleteQuery(index)">
                    <wwEditorIcon class="ww-editor-button-icon" name="delete" small />
                </button>
            </div>
        </wwEditorFormRow>
        <wwEditorFormRow v-if="isData" label="Data">
            <template #append-label>
                <button type="button" class="ww-editor-button -icon -primary -small m-auto-left" @click="addData">
                    <wwEditorIcon class="ww-editor-button-icon" name="add" small />
                </button>
            </template>
            <div
                v-for="(data, index) in api.data"
                :key="index"
                class="rest-api-collection-edit__row -space-between"
                :class="{ 'm-top': index }"
            >
                <wwEditorInputText
                    class="rest-api-collection-edit__input"
                    type="text"
                    :model-value="data.key"
                    placeholder="Key"
                    small
                    @update:modelValue="setDataProp(index, { key: $event })"
                />
                <wwEditorInputText
                    class="rest-api-collection-edit__input"
                    type="text"
                    :model-value="data.value"
                    placeholder="Value"
                    small
                    @update:modelValue="setDataProp(index, { value: $event })"
                />
                <button type="button" class="ww-editor-button -tertiary -small -icon -red" @click="deleteData(index)">
                    <wwEditorIcon class="ww-editor-button-icon" name="delete" small />
                </button>
            </div>
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
                { value: 'PATCH', label: 'PATCH' },
                { value: 'DELETE', label: 'DELETE' },
                { value: 'OPTIONS', label: 'OPTIONS' },
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
        isData() {
            return this.api.method !== 'GET' && this.api.method !== 'DELETE' && this.api.method !== 'OPTIONS';
        },
    },
    methods: {
        addArrayItem(path) {
            const array = _.cloneDeep(this.api[path] || []);
            array.push({ key: '', value: '' });
            this.setProp(path, array);
        },
        setArrayItemProp(path, index, value) {
            const array = _.cloneDeep(this.api[path]);
            array.splice(index, 1, { ...array[index], ...value });
            this.setProp(path, array);
        },
        deleteArrayItem(path, index) {
            const array = _.cloneDeep(this.api[path]);
            array.splice(index, 1);
            this.setProp(path, array);
        },
        addHeader() {
            this.addArrayItem('headers');
        },
        setHeaderProp(index, value) {
            this.setArrayItemProp('headers', index, value);
        },
        deleteHeader(index) {
            this.deleteArrayItem('headers', index);
        },
        addQuery() {
            this.addArrayItem('queries');
        },
        setQueryProp(index, value) {
            this.setArrayItemProp('queries', index, value);
        },
        deleteQuery(index) {
            this.deleteArrayItem('queries', index);
        },
        addData() {
            this.addArrayItem('data');
        },
        setDataProp(index, value) {
            this.setArrayItemProp('data', index, value);
        },
        deleteData(index) {
            this.deleteArrayItem('data', index);
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
    &__input {
        width: calc(50% - 10px - var(--ww-spacing-02));
    }
    .m-auto-left {
        margin-left: auto;
    }
    .m-top {
        margin-top: var(--ww-spacing-02);
    }
}
</style>
