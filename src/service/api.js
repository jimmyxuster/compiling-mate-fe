const baseUrl = '/api';
const request = (method, url, data = null) => {
    method = method.toUpperCase();
    return new Promise(((resolve, reject) => {
        if (method === 'GET' && data) {
            let paramsArray = [];
            Object.keys(data).forEach(key => paramsArray.push(key + '=' + data[key]));
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
        let option = {
            method,
        };
        if (method !== 'GET' && method !== 'HEAD' && data) {
            option = {
                ...option,
                body:  JSON.stringify(data),
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', }
            }
        }
        fetch(baseUrl + url, option).then(response => {
            console.log('response', response);
            let contentType = response.headers.get("content-type");
            if(contentType && contentType.includes("application/json")) {
                return response.json();
            }
            throw new TypeError("Wrong type returned.");
        })
            .then(json => {
                resolve(json);
            })
            .catch(err => reject(err));
    }))
};

class api {
    static parsingSyntaxProcessingOutput() {
        return request('POST', '/syntax/parsingProcessingOutput');
    }

    static reProcessingOutput(data) {
        return request('POST', '/lex/reProcessingOutput', data);
    }

    static runCoLangCode(data) {
        return request('POST', '/co/compile', data);
    }
}

export default api;
