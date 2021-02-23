<template>
    <div class="ww-popup-rest-api-apis">
        <button class="rest-api-apis__all ww-editor-button -primary" @click="addApi">Add API</button>
        <div class="rest-api-apis__row" v-for="(api, index) in settings.privateData.APIs" :key="index">
            <div class="paragraph-m">{{ api.name || api.url }}</div>
            <button class="ww-editor-button -secondary -small m-auto-left" @click="editApi(index, api)">Edit</button>
            <div class="rest-api-apis__button-delete m-left" @click="deleteApi(index)">
                <wwEditorIcon name="delete" small />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ApisPopup',
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
                privateData: {},
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
            return this.settings.privateData.APIs && this.settings.privateData.APIs.length;
        },
    },
    methods: {
        async addApi() {
            try {
                const result = await wwLib.wwPopups.open({
                    firstPage: 'REST_API_ADD_API_POPUP',
                });
                this.settings.privateData.APIs.push(result.api);
            } catch (err) {
                wwLib.wwLog.error(err);
            }
        },
        async editApi(index, api) {
            try {
                const result = await wwLib.wwPopups.open({
                    firstPage: 'REST_API_EDIT_API_POPUP',
                    data: { api },
                });
                this.settings.privateData.APIs.splice(index, 1, result.api);
            } catch (err) {
                wwLib.wwLog.error(err);
            }
        },
        async deleteApi(index) {
            const confirm = await wwLib.wwModals.open({
                title: {
                    en: 'Delete data source?',
                    fr: 'Supprimer la source de données?',
                },
                text: {
                    en: 'Are you sure you want to delete the data source?',
                    fr: 'Voulez-vous vraiment supprimer la source de données ?',
                },
                buttons: [
                    {
                        text: {
                            en: 'Cancel',
                            fr: 'Annuler',
                        },
                        color: '-secondary',
                        value: false,
                        escape: true,
                    },
                    {
                        text: {
                            en: 'Delete',
                            fr: 'Supprimer',
                        },
                        color: '-primary -red',
                        value: true,
                        enter: true,
                    },
                ],
            });
            if (!confirm) return;
            this.settings.privateData.APIs.splice(index, 1);
        },
        async beforeNext() {
            this.options.setLoadingStatus(true);
            try {
                const plugin = wwLib.wwPlugins.pluginRestApi;
                plugin.settings = await wwLib.wwPlugin.saveSettings(
                    plugin.id,
                    plugin.settings.id,
                    this.settings.data,
                    this.settings.privateData
                );

                const oldApis = this.options.data.settings.privateData.APIs;
                const newApis = this.options.result.settings.privateData.APIs;
                const deletedApis = oldApis.filter(api => !newApis.find(elem => elem.id === api.id));
                deletedApis.forEach(api => wwLib.wwPlugin.deleteCmsDataSet(api.id));

                wwLib.wwPlugins.pluginRestApi.settings = plugin.settings;
                this.options.data.settings = plugin.settings;
            } catch (err) {
                wwLib.wwLog.error(err);
            }
            this.options.setLoadingStatus(false);
        },
    },
    created() {
        this.settings = _.cloneDeep(this.options.data.settings || this.settings);
        this.options.result.settings = this.settings;
        this.options.setButtonState('SAVE', this.isSetup ? 'ok' : 'disabled');
    },
};
</script>

<style scoped lang="scss">
.ww-popup-rest-api-apis {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--ww-spacing-03) 0;
    .rest-api-apis {
        &__all {
            margin: 0 auto var(--ww-spacing-02) auto;
        }
        &__row {
            display: flex;
            align-items: center;
            margin-bottom: var(--ww-spacing-04);
        }
        &__button-delete {
            margin: 0 var(--ww-spacing-03);
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
    .m-left {
        margin-left: var(--ww-spacing-03);
    }
}
</style>
