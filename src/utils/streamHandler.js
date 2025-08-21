export async function consumeEventStream(response, streamVariableId, wwUtils) {
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

            if (!line) continue;

            if (line.startsWith('data:')) {
                const dataContent = line.substring(5).trim();
                if (dataContent === '[DONE]') {
                    streamActive = false;
                    wwUtils?.log('info', '[REST API Stream] Received [DONE] in data: line.');
                    break;
                }
                if (dataContent) {
                    try {
                        const parsedData = JSON.parse(dataContent);
                        const currentData = wwLib.wwVariable.getValue(streamVariableId) || [];
                        wwLib.wwVariable.updateValue(streamVariableId, [...currentData, parsedData]);
                    } catch (parseError) {
                        wwUtils?.log('warn', `[REST API Stream] Non-JSON data in data: line: ${dataContent}`, {
                            parseError,
                        });
                        const currentData = wwLib.wwVariable.getValue(streamVariableId) || [];
                        wwLib.wwVariable.updateValue(streamVariableId, [...currentData, dataContent]);
                    }
                }
            } else if (line === '[DONE]') {
                streamActive = false;
                wwUtils?.log('info', '[REST API Stream] Received [DONE] on its own line.');
                break;
            } else if (
                line.startsWith('id:') ||
                line.startsWith('event:') ||
                line.startsWith('retry:') ||
                line.startsWith(':')
            ) {
                wwUtils?.log('debug', `[REST API Stream] Ignoring SSE metadata line: ${line}`);
            } else {
                try {
                    const parsedData = JSON.parse(line);
                    const currentData = wwLib.wwVariable.getValue(streamVariableId) || [];
                    wwLib.wwVariable.updateValue(streamVariableId, [...currentData, parsedData]);
                } catch (parseError) {
                    wwUtils?.log('debug', `[REST API Stream] Adding raw line as non-JSON: ${line}`, {
                        parseError,
                    });
                    const currentData = wwLib.wwVariable.getValue(streamVariableId) || [];
                    wwLib.wwVariable.updateValue(streamVariableId, [...currentData, line]);
                }
            }
        }
        if (!streamActive) break;
    }

    const finalBufferTrimmed = buffer.trim();
    if (finalBufferTrimmed) {
        if (finalBufferTrimmed.startsWith('data:')) {
            const dataContent = finalBufferTrimmed.substring(5).trim();
            if (dataContent && dataContent !== '[DONE]') {
                try {
                    const parsedData = JSON.parse(dataContent);
                    const currentData = wwLib.wwVariable.getValue(streamVariableId) || [];
                    wwLib.wwVariable.updateValue(streamVariableId, [...currentData, parsedData]);
                } catch (e) {
                    wwUtils?.log(
                        'warn',
                        `[REST API Stream] Failed to parse JSON from final buffer data: line: ${dataContent}`,
                        { e }
                    );
                    const currentData = wwLib.wwVariable.getValue(streamVariableId) || [];
                    wwLib.wwVariable.updateValue(streamVariableId, [...currentData, dataContent]);
                }
            } else if (dataContent === '[DONE]') {
                wwUtils?.log('info', '[REST API Stream] Received [DONE] in final buffer data: line.');
            }
        } else if (finalBufferTrimmed === '[DONE]') {
            wwUtils?.log('info', '[REST API Stream] Received [DONE] as final buffer content.');
        } else if (
            finalBufferTrimmed.startsWith('id:') ||
            finalBufferTrimmed.startsWith('event:') ||
            finalBufferTrimmed.startsWith('retry:') ||
            finalBufferTrimmed.startsWith(':')
        ) {
            wwUtils?.log('debug', `[REST API Stream] Ignoring SSE metadata in final buffer: ${finalBufferTrimmed}`);
        } else {
            try {
                const parsedData = JSON.parse(finalBufferTrimmed);
                const currentData = wwLib.wwVariable.getValue(streamVariableId) || [];
                wwLib.wwVariable.updateValue(streamVariableId, [...currentData, parsedData]);
            } catch (e) {
                wwUtils?.log('debug', `[REST API Stream] Adding raw final buffer as non-JSON: ${finalBufferTrimmed}`, {
                    e,
                });
                const currentData = wwLib.wwVariable.getValue(streamVariableId) || [];
                wwLib.wwVariable.updateValue(streamVariableId, [...currentData, finalBufferTrimmed]);
            }
        }
    }

    return wwLib.wwVariable.getValue(streamVariableId);
}
