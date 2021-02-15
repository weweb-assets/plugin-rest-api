<template>
    <div class="ww-popup-rest-api-api">
        <label class="rest-api-api__label caption-s" for="url-rest-api">
            Url
            <div class="rest-api-api__label-required">required</div>
        </label>
        <input
            type="text"
            name="url-rest-api"
            class="rest-api-api__input caption-m ww-editor-input -large"
            placeholder="https://api-url.com/endpoint"
            v-model="api.url"
            autofocus
        />
        <label class="rest-api-api__label caption-s" for="name-rest-api">
            Name
            <div class="rest-api-api__label-required">optional</div>
        </label>
        <input
            type="text"
            name="name-rest-api"
            class="rest-api-api__input caption-m ww-editor-input -large"
            placeholder="My Api "
            v-model="api.name"
            :disabled="!api.url"
        />
        <label class="rest-api-api__label caption-s" for="display-by-rest-api">
            Display by
            <div class="rest-api-api__label-required">optional</div>
        </label>
        <input
            type="text"
            name="display-by-rest-api"
            class="rest-api-api__input caption-m ww-editor-input -large"
            placeholder="name"
            v-model="api.displayBy"
            :disabled="!api.url"
        />
        <div class="rest-api-api__row rest-api-api__input">
            <label class="rest-api-api__label caption-s" for="rest-api-headers"> Headers </label>
            <button class="ww-editor-button -primary -small m-auto-left" @click="addHeader" :disabled="!api.url">
                Add header field
            </button>
        </div>
        <div class="rest-api-api__row -space-between" v-for="(header, index) of api.headers" :key="index">
            <div class="rest-api-api__row-item">
                <input
                    type="text"
                    class="rest-api-api__input caption-m ww-editor-input"
                    placeholder="Key"
                    v-model="header.key"
                />
            </div>
            <div class="rest-api-api__row-item">
                <input
                    type="text"
                    class="rest-api-api__input caption-m ww-editor-input"
                    placeholder="value"
                    v-model="header.value"
                />
            </div>
            <div class="rest-api-api__input rest-api-api__button-delete" @click="deleteHeader(index)">
                <wwEditorIcon name="delete" small />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ApiPopup',
    props: {
        options: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    data() {
        return {
            directionOptions: [
                { value: 'asc', label: 'Asc', default: true },
                { value: 'desc', label: 'Desc' },
            ],
            api: {
                id: wwLib.wwUtils.getUid(),
                url: undefined,
                name: undefined,
                displayBy: undefined,
                headers: [],
            },
        };
    },
    watch: {
        'api.url'() {
            this.options.setButtonState('SAVE', this.api.url ? 'ok' : 'disabled');
        },
    },
    methods: {
        addHeader() {
            this.api.headers.push({ key: '', value: '' });
        },
        deleteHeader(index) {
            this.api.headers.splice(index, 1);
        },
    },
    created() {
        this.api = this.options.data.api || this.api;
        this.options.result.api = this.api;
        this.options.setButtonState('SAVE', this.api.url ? 'ok' : 'disabled');
    },
};
</script>

<style scoped lang="scss">
.ww-popup-rest-api-api {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--ww-spacing-03) 0;
    .rest-api-api {
        &__label {
            display: flex;
            align-items: center;
            font-weight: 500;
            color: var(--ww-color-dark-500);
            margin-bottom: var(--ww-spacing-01);
            &-required {
                margin-left: auto;
                color: var(--ww-color-dark-400);
            }
        }
        &__link {
            color: var(--ww-color-blue-500);
            margin-left: var(--ww-spacing-02);
        }
        &__input {
            margin-bottom: var(--ww-spacing-03);
        }
        &__select {
            min-width: 65px;
            margin-left: var(--ww-spacing-02);
        }
        &__row {
            display: flex;
            align-items: center;
            &.-space-between {
                justify-content: space-between;
            }
            &-item {
                display: flex;
                flex-direction: column;
                width: 100%;
                margin-right: var(--ww-spacing-02);
                &:last-child {
                    margin-right: 0;
                    margin-left: var(--ww-spacing-02);
                }
            }
        }
        &__button-delete {
            margin-right: var(--ww-spacing-03);
            cursor: pointer;
            transition: color 0.3s ease;
            &:hover {
                color: var(--ww-color-red-500);
            }
        }
    }
    .m-auto-left {
        margin-left: auto;
    }
}
</style>
