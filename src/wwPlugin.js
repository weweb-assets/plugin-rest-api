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
    async fetchCollection(collection) {
        if (collection.mode === 'dynamic') {
            try {
                const { url, method, data, headers, queries, resultKey } = collection.config;
                const response = await this.apiRequest(url, method, data, headers, queries);
                return { data: _.get(response.data, resultKey, response.data), error: null };
            } catch (error) {
                return { error };
            }
        } else {
            return { data: null, error: null };
        }
    },
    async apiRequest(url, method, data, headers, params, dataType) {
        data = (data || []).reduce((obj, item) => ({ ...obj, [item.key]: item.value }), {});

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
            params: (params || []).reduce((obj, item) => ({ ...obj, [item.key]: item.value }), {}),
            headers: {
                'content-type': dataType,
                ...(headers || []).reduce((obj, item) => ({ ...obj, [item.key]: item.value }), {}),
            },
        });
    },
};
