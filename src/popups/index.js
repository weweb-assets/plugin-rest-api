import settingsPopup from './settings.popup.vue';
import apisPopup from './apis.popup.vue';
import apiPopup from './api.popup.vue';
import synchronizationPopup from './synchronization.popup.vue';
import webhooksPopup from './webhooks.popup.vue';

wwLib.wwPopups.addPopup('restApiSettingsPopup', settingsPopup);
wwLib.wwPopups.addPopup('restApiApisPopup', apisPopup);
wwLib.wwPopups.addPopup('restApiApiPopup', apiPopup);
wwLib.wwPopups.addPopup('restApiSynchronizationPopup', synchronizationPopup);
wwLib.wwPopups.addPopup('restApiWebhooksPopup', webhooksPopup);

wwLib.wwPopups.addStory('REST_API_POPUP', {
    title: {
        en: 'Rest API',
        fr: 'Rest API',
    },
    type: 'restApiSettingsPopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
});

wwLib.wwPopups.addStory('REST_API_APIS_POPUP', {
    title: {
        en: 'Rest API - APIs',
        fr: 'Rest API - APIs',
    },
    type: 'restApiApisPopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
    buttons: {
        SAVE: {
            text: {
                en: 'Save APIs',
                fr: 'Enregistrer les APIs',
            },
            next: 'REST_API_SYNCHRONIZATION_POPUP',
        },
    },
});

wwLib.wwPopups.addStory('REST_API_ADD_API_POPUP', {
    title: {
        en: 'Rest API - Add API',
        fr: 'Rest API - Ajouter une API',
    },
    type: 'restApiApiPopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
    buttons: {
        SAVE: {
            text: {
                en: 'Add API',
                fr: 'Ajouter une API',
            },
        },
    },
});

wwLib.wwPopups.addStory('REST_API_EDIT_API_POPUP', {
    title: {
        en: 'Rest API - Edit API',
        fr: "Rest API - Editer l'API",
    },
    type: 'restApiApiPopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
    buttons: {
        SAVE: {
            text: {
                en: 'Edit API',
                fr: "Editer l'API",
            },
        },
    },
});

wwLib.wwPopups.addStory('REST_API_WEBHOOKS_POPUP', {
    title: {
        en: 'Rest API - Webhooks',
        fr: 'Rest API - Webhooks',
    },
    type: 'restApiWebhooksPopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
    buttons: {
        DONE: {
            text: {
                en: 'Done',
                fr: 'Done',
            },
        },
    },
});

wwLib.wwPopups.addStory('REST_API_SYNCHRONIZATION_POPUP', {
    title: {
        en: 'Rest API - Synchronization',
        fr: 'Rest API - Synchronization',
    },
    type: 'restApiSynchronizationPopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
    buttons: {
        DONE: {
            text: {
                en: 'Done',
                fr: 'Done',
            },
        },
    },
});
