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
                const responseData = await this._apiRequest(url, method, data, headers, queries);
                return { data: _.get(responseData, resultKey, responseData), error: null };
            } catch (err) {
                return {
                    error: Object.getOwnPropertyNames(err).reduce((obj, key) => ({ ...obj, [key]: err[key] }), {}),
                };
            }
        } else {
            return { data: null, error: null };
        }
    },
    async apiRequest(url, method, data, headers, params, dataType, wwUtils) {
        /* wwEditor:start */
        const payload = computePayload(method, data, headers, params, dataType);
        wwUtils.log({ label: 'Request', preview: `${method} ${url}` });
        wwUtils.log({
            label: 'Payload',
            preview: {
                Data: payload.data,
                Headers: payload.headers,
                'Query string': payload.params,
            },
        });
        /* wwEditor:end */
        return this._apiRequest(url, method, data, headers, params, dataType);
    },
    async _apiRequest(url, method, data, headers, params, dataType) {
        const payload = computePayload(method, data, headers, params, dataType);

        const response = await axios({
            url,
            method,
            data: payload.data,
            params: payload.params,
            headers: payload.headers,
        });

        return response.data;
    },
};

function computePayload(method, data, headers, params, dataType) {
    data = computeList(data);

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

    switch (method) {
        case 'OPTIONS':
        case 'GET':
        case 'DELETE':
            data = undefined;
            break;
        default:
            break;
    }

    return {
        data,
        params: computeList(params),
        headers: {
            'content-type': dataType || 'application/json',
            ...computeList(headers),
        },
    };
}

function computeList(list) {
    return (list || []).reduce((obj, item) => ({ ...obj, [item.key]: item.value }), {});
}
