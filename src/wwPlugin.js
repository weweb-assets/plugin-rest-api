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
        try {
            wwUtils?.log('debug', '[REST API] Input parameters', {
                type: 'debug',
                preview: {
                    url,
                    method,
                    data: typeof data === 'undefined' ? 'undefined' : data === null ? 'null' : data,
                    headers: typeof headers === 'undefined' ? 'undefined' : headers === null ? 'null' : headers,
                    params: typeof params === 'undefined' ? 'undefined' : params === null ? 'null' : params,
                    dataType,
                    useRawBody,
                    isWithCredentials,
                    useStreaming,
                    streamVariableId,
                },
            });

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
            wwUtils?.log('debug', '[REST API Stream] Starting stream request', {
                type: 'debug',
                preview: {
                    url,
                    method,
                    data: typeof data === 'undefined' ? 'undefined' : data === null ? 'null' : data,
                    headers: typeof headers === 'undefined' ? 'undefined' : headers === null ? 'null' : headers,
                    params: typeof params === 'undefined' ? 'undefined' : params === null ? 'null' : params,
                },
            });

            wwLib.wwVariable.updateValue(streamVariableId, []);

            const payload = computePayload(method, data, headers, params, dataType, useRawBody, wwUtils);

            wwUtils?.log('debug', '[REST API Stream] Computed payload', {
                type: 'debug',
                preview: payload,
            });

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
                                wwUtils?.log('debug', '[REST API Stream] Received chunk', {
                                    type: 'debug',
                                    preview: {
                                        parsedData,
                                        currentDataType: Array.isArray(currentData) ? 'array' : typeof currentData,
                                    },
                                });
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
        wwUtils?.log('debug', '[REST API] computePayload input', {
            type: 'debug',
            preview: {
                method,
                data: typeof data === 'undefined' ? 'undefined' : data === null ? 'null' : data,
                headers: typeof headers === 'undefined' ? 'undefined' : headers === null ? 'null' : headers,
                params: typeof params === 'undefined' ? 'undefined' : params === null ? 'null' : params,
                dataType,
                useRawBody,
            },
        });

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

        wwUtils?.log('debug', '[REST API] computePayload result', {
            type: 'debug',
            preview: {
                data: processedData,
                params: processedParams,
                headers: processedHeaders,
            },
        });

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
        wwUtils?.log('debug', `[REST API] computeList for ${label}`, {
            type: 'debug',
            preview: {
                list: typeof list === 'undefined' ? 'undefined' : list === null ? 'null' : list,
                type: typeof list,
                isArray: Array.isArray(list),
            },
        });

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

        wwUtils?.log('debug', `[REST API] computeList result for ${label}`, {
            type: 'debug',
            preview: result,
        });

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
