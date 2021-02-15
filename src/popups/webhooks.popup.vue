<template>
    <div class="ww-popup-rest-api-webhooks">
        <div class="rest-api-webhooks__row" v-for="(api, index) in settings.privateData.APIs" :key="index">
            <div class="paragraph-m">{{ api.name || api.url }}</div>
            <button class="ww-editor-button -primary -green -small m-auto-left" @click="copyUrl(api)">
                <wwEditorIcon class="ww-editor-button-icon -left" name="copy-paste" small />
                Copy url
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WebhooksPopup',
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
            settings: {
                privateData: {
                    APIs: [],
                },
            },
        };
    },
    methods: {
        async copyUrl(api) {
            const designId = wwLib.wwWebsiteData.getInfo().id;
            await wwLib
                .getManagerWindow()
                .navigator.clipboard.writeText(
                    `https://data.weweb.io/designs/${designId}/cms_data_set/${api.id}/callback`
                );
            wwLib.wwNotification.open({
                text: {
                    en: 'Url copied to clipboard',
                },
                color: 'green',
            });
        },
    },
    created() {
        this.settings = _.cloneDeep(this.options.data.settings || this.settings);
    },
};
</script>

<style scoped lang="scss">
.ww-popup-rest-api-webhooks {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--ww-spacing-03) 0;
    .rest-api-webhooks {
        &__row {
            display: flex;
            align-items: center;
            margin-bottom: var(--ww-spacing-04);
        }
    }
    .m-auto-left {
        margin-left: auto;
    }
    .m-left {
        margin-left: var(--ww-spacing-02);
    }
}
</style>
