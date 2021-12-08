/* wwEditor:start */
import './components/CollectionEdit.vue';
import './components/CollectionSummary.vue';
import './components/ApiRequest.vue';
/* wwEditor:end */

export default {
    /*=============================================m_ÔÔ_m=============================================\
        Collection API
    \================================================================================================*/
    /* wwEditor:start */
    // eslint-disable-next-line no-unused-vars
    async fetchCollection(_collection) {
        return { data: null, error: null };
    },
    /* wwEditor:end */
    async apiRequest(url, method, data, params, headers) {
        return await axios({
            url,
            method,
            data: data.reduce((obj, item) => {
                ({ ...obj, [item.key]: item.value });
            }, {}),
            params: params.reduce((obj, item) => {
                ({ ...obj, [item.key]: item.value });
            }, {}),
            headers: headers.reduce((obj, item) => {
                ({ ...obj, [item.key]: item.value });
            }, {}),
        });
    },
};
