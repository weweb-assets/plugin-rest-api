<template>
    <div class="ww-popup-rest-api-sync">
        <button class="rest-api-sync__all ww-editor-button -primary -green" @click="syncAll" :disabled="isFetching">
            <div v-if="!isFetching">Synchronize all</div>
            <div v-else>Fetching...</div>
        </button>
        <div class="rest-api-sync__row" v-for="(api, index) in settings.privateData.APIs" :key="index">
            <div class="paragraph-m">{{ api.name || api.url }}</div>
            <div class="caption-m m-auto-left">
                <template v-if="!isApiFetching(api)">
                    <template v-if="getSource(api).lastSyncDate">
                        {{ getSource(api).lastSyncDate | dateFromNow }}
                    </template>
                    <template v-else>never synchronized</template>
                </template>
            </div>
            <button
                :disabled="isApiFetching(api)"
                class="ww-editor-button -primary -green -small m-left"
                @click="sync(api)"
            >
                <div v-if="!isApiFetching(api)">Synchronize API</div>
                <div v-else>Fetching...</div>
            </button>
        </div>
        <div class="rest-api-sync__separator"></div>
    </div>
</template>

<script>
import moment from 'moment';

export default {
    name: 'SynchronizationPopup',
    props: {
        options: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    filters: {
        dateFromNow(date) {
            return moment(date).fromNow();
        },
    },
    data() {
        return {
            isFetching: false,
            apisFetching: [],
            settings: {
                privateData: {
                    APIs: [],
                },
            },
        };
    },
    methods: {
        getSource(api) {
            return wwLib.$store.getters['cms/getData'][api.id] || {};
        },
        isApiFetching(api) {
            return this.apisFetching.indexOf(api.id) !== -1;
        },
        apiFetching(api, value) {
            if (value) {
                this.apisFetching.push(api.id);
            } else {
                const index = this.apisFetching.indexOf(api.id);
                if (index !== -1) this.apisFetching.splice(index, 1);
            }
        },
        async sync(api) {
            this.apiFetching(api, true);
            try {
                await wwLib.wwPlugin.saveCmsDataSet(this.settings.id, api.id, api.name, api.displayBy, 'RestApi');

                wwLib.wwNotification.open({
                    text: {
                        en: `Api "${api.name}" succesfully fetched`,
                    },
                    color: 'green',
                });
            } catch (err) {
                wwLib.wwNotification.open({
                    text: {
                        en: 'An error occured, please try again later.',
                        fr: 'Une erreur est survenue. Veuillez réessayer plus tard.',
                    },
                    color: 'red',
                });
                wwLib.wwLog.error(err);
            }
            this.apiFetching(api, false);
        },
        async syncAll() {
            this.isFetching = true;
            for (const api of this.settings.privateData.APIs) await this.sync(api);
            this.isFetching = false;
        },
    },
    created() {
        this.settings = _.cloneDeep(this.options.data.settings || this.settings);
    },
};
</script>

<style scoped lang="scss">
.ww-popup-rest-api-sync {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--ww-spacing-03) 0;
    .rest-api-sync {
        &__all {
            margin: 0 auto var(--ww-spacing-02) auto;
        }
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
