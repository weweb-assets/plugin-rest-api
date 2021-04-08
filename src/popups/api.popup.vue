<template>
    <div class="ww-popup-rest-api-api">
        <label class="rest-api-api__label caption-s" for="name-rest-api">
            Name
            <div class="rest-api-api__label-required">required</div>
        </label>
        <input
            type="text"
            name="name-rest-api"
            class="rest-api-api__input caption-m ww-editor-input -large"
            placeholder="My Api"
            v-model="api.name"
            autofocus
        />
        <label class="rest-api-api__label caption-s" for="url-rest-api">
            Url
            <div class="rest-api-api__label-required">required</div>
        </label>
        <input
            type="text"
            name="url-rest-api"
            class="caption-m ww-editor-input -large"
            :class="{ 'rest-api-api__input': !options.data.isSubRequest }"
            placeholder="https://api-url.com/endpoint"
            v-model="api.url"
        />
        <template v-if="options.data.isSubRequest">
            <span class="rest-api-api__description caption-s">
                {{ urlDescription }}
            </span>
        </template>
        <label class="rest-api-api__label caption-s" for="key-rest-api">
            Key
            <div class="rest-api-api__label-required">optional</div>
        </label>
        <input
            type="text"
            name="key-rest-api"
            class="caption-m ww-editor-input -large"
            placeholder="Enter a text"
            v-model="api.key"
        />
        <span class="rest-api-api__description caption-s">
            If the returned JSON is not a list and is instead an object (maybe paginated), enter the key that contains
            the results. Example: "results", "items", "objects", etc... (children via dot syntax supported)
        </span>
        <template v-if="!options.data.isSubRequest">
            <label class="rest-api-api__label caption-s" for="display-by-rest-api">
                Display by
                <div class="rest-api-api__label-required">optional</div>
            </label>
            <input
                type="text"
                name="display-by-rest-api"
                class="rest-api-api__input caption-m ww-editor-input -large"
                placeholder="id"
                v-model="api.displayBy"
            />
        </template>
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
        <div class="rest-api-api__row rest-api-api__input">
            <label class="rest-api-api__label caption-s" for="rest-api-headers"> Sub requests </label>
            <button class="ww-editor-button -primary -small m-auto-left" @click="addSubRequest" :disabled="!api.url">
                Add sub request
            </button>
        </div>
        <div class="rest-api-api__row -space-between" v-for="(subRequest, index) of api.subRequests" :key="index">
            <div class="rest-api-api__row-item rest-api-api__input">
                {{ subRequest.name }}
            </div>
            <div class="rest-api-api__input rest-api-api__button-delete" @click="deleteSubRequest(index)">
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
            urlDescription:
                'Data from the previous request can be used with brackets. Example: "{{id}}", "https://api-url.com/{{id}}", etc... (children via dot syntax supported)',
            api: {
                id: wwLib.wwUtils.getUid(),
                name: undefined,
                url: undefined,
                key: undefined,
                displayBy: undefined,
                headers: [],
                subRequests: [],
            },
        };
    },
    watch: {
        isSetup() {
            this.options.setButtonState('SAVE', this.isSetup ? 'ok' : 'disabled');
        },
    },
    computed: {
        isSetup() {
            return !!this.api.url && !!this.api.url.length && !!this.api.name && !!this.api.name.length;
        },
    },
    methods: {
        addHeader() {
            this.api.headers.push({ key: '', value: '' });
        },
        deleteHeader(index) {
            this.api.headers.splice(index, 1);
        },
        async addSubRequest() {
            try {
                const result = await wwLib.wwPopups.open({
                    firstPage: 'REST_API_ADD_API_POPUP',
                    data: {
                        isSubRequest: true,
                    },
                });
                this.api.subRequests.push(result.api);
            } catch (err) {
                wwLib.wwLog.error(err);
            }
        },
        deleteSubRequest(index) {
            this.api.subRequests.splice(index, 1);
        },
    },
    created() {
        this.api = this.options.data.api || this.api;
        this.options.result.api = this.api;
        this.options.setButtonState('SAVE', this.isSetup ? 'ok' : 'disabled');
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
        &__description {
            display: flex;
            align-items: center;
            color: var(--ww-color-dark-500);
            margin-top: var(--ww-spacing-01);
            margin-bottom: var(--ww-spacing-03);
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
