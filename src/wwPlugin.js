import qs from 'qs';
import { consumeEventStream } from './utils/streamHandler';
/* wwEditor:start */
import './components/CollectionEdit.vue';
import './components/CollectionSummary.vue';
import './components/ApiRequest.vue';
/* wwEditor:end */

export default {
    /*=============================================m_ÔÔ_m=============================================\
        Collection API
    \================================================================================================*/
    async _fetchCollection(collection) {
        if (collection.mode === 'dynamic' && !collection.config.isThroughServer) {
            try {
                const { url, method, data, headers, queries, resultKey, dataType, useRawBody, isWithCredentials } =
                    collection.config;
                const responseData = await this._apiRequest(
                    url,
                    method,
                    data,
                    headers,
                    queries,
                    dataType,
                    useRawBody,
                    isWithCredentials
                );
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
    async apiRequest(
        {
            url,
            method,
            data,
            headers,
            queries: params,
            dataType,
            isThroughServer,
            useRawBody = false,
            isWithCredentials = false,
            useStreaming = false,
            streamVariableId = null,
        },
        wwUtils
    ) {
        /* wwEditor:start */
        try {
            const payload = computePayload(method, data, headers, params, dataType, useRawBody, wwUtils);
            if (wwUtils) {
                wwUtils.log(
                    'info',
                    `Executing request ${method} on ${url} ${isThroughServer ? '(through weweb server)' : ''}${
                        useStreaming ? ' (streaming)' : ''
                    }`,
                    {
                        type: 'request',
                        preview: {
                            Data: payload.data,
                            Headers: payload.headers,
                            'Query string': payload.params,
                        },
                    }
                );
            }
        } catch (err) {
            wwUtils?.log('error', '[REST API] Error in preparing request', {
                type: 'error',
                preview: {
                    error: err.message,
                    stack: err.stack,
                },
            });
            throw err;
        }
        /* wwEditor:end */

        if (useStreaming) {
            if (isThroughServer) {
                throw new Error('Streaming is not supported with server-side requests.');
            }
            return await this._streamApiRequest(
                url,
                method,
                data,
                headers,
                params,
                dataType,
                useRawBody,
                isWithCredentials,
                streamVariableId,
                wwUtils
            );
        } else if (isThroughServer) {
            const websiteId = wwLib.wwWebsiteData.getInfo().id;
            const pluginURL = wwLib.wwApiRequests._getPluginsUrl();

            return await axios.post(`${pluginURL}/designs/${websiteId}/rest-api/request`, {
                url,
                method,
                data,
                queries: params,
                headers,
                dataType,
                useRawBody,
            });
        } else {
            return await this._apiRequest(url, method, data, headers, params, dataType, useRawBody, isWithCredentials);
        }
    },
    async _apiRequest(url, method, data, headers, params, dataType, useRawBody, isWithCredentials) {
        const payload = computePayload(method, data, headers, params, dataType, useRawBody);

        const response = await axios({
            url,
            method,
            data: payload.data,
            params: payload.params,
            headers: payload.headers,
            withCredentials: isWithCredentials,
        });

        return response.data;
    },
    async _streamApiRequest(
        url,
        method,
        data,
        headers,
        params,
        dataType,
        useRawBody,
        isWithCredentials,
        streamVariableId,
        wwUtils
    ) {
        try {
            wwLib.wwVariable.updateValue(streamVariableId, []);

            const payload = computePayload(method, data, headers, params, dataType, useRawBody, wwUtils);

            const streamHeaders = {
                ...payload.headers,
                Accept: 'text/event-stream',
            };

            const response = await fetch(url, {
                method,
                headers: streamHeaders,
                body: ['GET', 'HEAD'].includes(method) ? undefined : payload.data,
                credentials: isWithCredentials ? 'include' : 'same-origin',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error ${response.status}: ${errorText}`);
            }

            return await consumeEventStream(response, streamVariableId, wwUtils);
        } catch (error) {
            wwUtils?.log('error', '[REST API Stream] Error', {
                type: 'error',
                preview: {
                    message: error.message,
                    stack: error.stack,
                },
            });
            throw error;
        }
    },
    /* wwEditor:start */
    getCollectionErrorDetails(collection) {
        return (
            collection.error &&
            collection.error.message &&
            collection.error.message === 'Network Error' &&
            '⚠️ There is a network error. That can happen when the server you are trying to call is down, or it is not found, or there is a CORS issue because the server expects a call from another server and not a frontend like WeWeb. If the network error is caused by a CORS issue, you may contact the administrator of the API to allow the "weweb.io" domain to make requests or, if this is not possible, consider enabling the "Proxy the request to bypass CORS issues" option before clicking on "Continue".'
        );
    },
    /* wwEditor:end */
};

function computePayload(method, data, headers, params, dataType, useRawBody, wwUtils) {
    try {
        let processedData = data;
        if (!useRawBody) {
            processedData = computeList(data, 'data', wwUtils);

            switch (dataType) {
                case 'application/x-www-form-urlencoded': {
                    processedData = qs.stringify(processedData);
                    break;
                }
                case 'multipart/form-data': {
                    const formData = new FormData();
                    for (const key in processedData) formData.append(key, processedData[key]);
                    processedData = formData;
                    break;
                }
                default:
                    break;
            }
        }

        switch (method) {
            case 'OPTIONS':
            case 'GET':
            case 'DELETE':
            default:
                break;
        }

        const processedParams = computeList(params, 'params', wwUtils);
        const processedHeaders = {
            'content-type': dataType || 'application/json',
            ...computeList(headers, 'headers', wwUtils),
        };

        return {
            data: processedData,
            params: processedParams,
            headers: processedHeaders,
        };
    } catch (error) {
        wwUtils?.log('error', '[REST API] Error in computePayload', {
            type: 'error',
            preview: {
                error: error.message,
                stack: error.stack,
            },
        });
        throw error;
    }
}

function computeList(list, label, wwUtils) {
    try {
        if (!list) return {};

        if (!Array.isArray(list)) {
            wwUtils?.log('warn', `[REST API] computeList expected array but got ${typeof list}`, {
                type: 'warn',
                preview: list,
            });
            return {};
        }

        const result = (list || []).reduce((obj, item) => {
            if (!item || typeof item !== 'object' || !('key' in item)) {
                wwUtils?.log('warn', `[REST API] computeList skipping invalid item`, {
                    type: 'warn',
                    preview: item,
                });
                return obj;
            }
            return { ...obj, [item.key]: item.value };
        }, {});

        return result;
    } catch (error) {
        wwUtils?.log('error', `[REST API] Error in computeList for ${label}`, {
            type: 'error',
            preview: {
                error: error.message,
                stack: error.stack,
                list: typeof list === 'undefined' ? 'undefined' : list === null ? 'null' : list,
            },
        });
        throw new Error(`Failed to process ${label}: ${error.message}`);
    }
}
