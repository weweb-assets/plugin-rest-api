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
        const payload = computePayload(method, data, headers, params, dataType, useRawBody);
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

            const payload = computePayload(method, data, headers, params, dataType, useRawBody);

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

            if (!response.body) {
                throw new Error('ReadableStream not supported in this browser.');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            let streamActive = true;
            while (streamActive) {
                const { done, value } = await reader.read();

                if (done) {
                    streamActive = false;
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                let newlineIndex;
                while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
                    let line = buffer.slice(0, newlineIndex).trim();
                    buffer = buffer.slice(newlineIndex + 1);

                    if (line) {
                        // Handle SSE 'data: ' prefix
                        if (line.startsWith('data: ')) {
                            line = line.substring(5).trim();
                        }

                        // Handle potential [DONE] signal in SSE
                        if (line === '[DONE]') {
                            wwUtils?.log('info', '[REST API Stream] Received [DONE] signal.');
                            break;
                        }

                        try {
                            if (line) {
                                const parsedData = JSON.parse(line);
                                const currentData = wwLib.wwVariable.getValue(streamVariableId) || [];
                                wwLib.wwVariable.updateValue(streamVariableId, [...currentData, parsedData]);
                            }
                        } catch (parseError) {
                            wwUtils?.log('warn', `[REST API Stream] Non-JSON data line: ${line}`, { parseError });
                            // For non-JSON data, still add as string
                            const currentData = wwLib.wwVariable.getValue(streamVariableId) || [];
                            wwLib.wwVariable.updateValue(streamVariableId, [...currentData, line]);
                        }
                    }
                }
            }

            if (buffer.trim()) {
                try {
                    const parsedData = JSON.parse(buffer.trim());
                    const currentData = wwLib.wwVariable.getValue(streamVariableId) || [];
                    wwLib.wwVariable.updateValue(streamVariableId, [...currentData, parsedData]);
                } catch (e) {
                    // If not JSON, add as string
                    const currentData = wwLib.wwVariable.getValue(streamVariableId) || [];
                    wwLib.wwVariable.updateValue(streamVariableId, [...currentData, buffer.trim()]);
                }
            }

            wwUtils?.log('info', '[REST API Stream] Stream completed', { type: 'response' });

            return wwLib.wwVariable.getValue(streamVariableId);
        } catch (error) {
            wwUtils?.log('error', '[REST API Stream] Error', {
                type: 'error',
                preview: error,
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

function computePayload(method, data, headers, params, dataType, useRawBody) {
    if (!useRawBody) {
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
    }

    switch (method) {
        case 'OPTIONS':
        case 'GET':
        case 'DELETE':
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
