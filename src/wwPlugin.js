import qs from 'qs';
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
    async apiRequest(url, method, data, headers, params, dataType) {
        data = data.reduce((obj, item) => ({ ...obj, [item.key]: item.value }), {});

        switch (dataType) {
            case 'application/x-www-form-urlencoded': {
                data = qs.stringify(data);
                break;
            }
            case 'multipart/form-data': {
                const formData = new FormData();
                for (const key in data) formData.append(key, data[key]);
                data = formData;
                break;
            }
            default:
                break;
        }

        return await axios({
            url,
            method,
            data,
            params: params.reduce((obj, item) => ({ ...obj, [item.key]: item.value }), {}),
            headers: {
                'content-type': dataType,
                ...headers.reduce((obj, item) => ({ ...obj, [item.key]: item.value }), {}),
            },
        });
    },
};
