const loginURL = 'loginService';
const serverURL = 'Server';

export const $fidoAPI = {
    login: async (loginOrLogout, formBody) => {
        return fetch(`${loginURL}/${loginOrLogout}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formBody)
        })
        .then((response) => response.json())
        .then((response) => {
            if (response.result !== true) {
                return false;
            } else {
                const loginToken = response.data.loginToken;
                return {
                    result: response.result,
                    loginToken: loginToken
                }
            }
        })
    },

    register: async (preregisterOrRegister, formBody, loginToken) => {
        return fetch(`${serverURL}/${preregisterOrRegister}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${loginToken}`
            },
            body: JSON.stringify(formBody)
        })
        .then((response) => response.json())
        .then((response) => {
            if(response.result !== true) return false;
            return response;
        })
    },
    
    authenticate: async (preauthenticateOrAuthenticate, formBody) => {
        return fetch(`${serverURL}/${preauthenticateOrAuthenticate}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(formBody)
        })
        .then((response) => response.json())
        .then((response) => {
            if(response.result !== true) return false;
            return response;
        })
    }
};
