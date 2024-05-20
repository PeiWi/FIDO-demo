import { $fidoAPI } from './fidoAPI.js';
import * as base64url from '../script/base64url.js';

var base64urlToRegularbase64 = (rawString) => {
    // decode base64url to regular base64
    let base64 = rawString.replace(/-/g, '+').replace(/_/g, '/');

    while (base64.length % 4) {
        base64 += '=';
    }

    // decode base64 to UTF-8
    let raw = atob(base64);
    let rawLength = raw.length;
    let array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }

    let decoder = new TextDecoder('utf-8');
    let decodeString = decoder.decode(array);
    let jsonObject = JSON.parse(decodeString);

    return jsonObject;
}


var preformatMakeCredReq = (makeCredReq) => {
    /* ----- DO NOT MODIFY THIS CODE ----- */
    makeCredReq.challenge = base64url.decode(makeCredReq.challenge);
    makeCredReq.user.id = base64url.decode(makeCredReq.user.id);

    for (let excludeCred of makeCredReq.excludeCredentials) {
        excludeCred.id = base64url.decode(excludeCred.id);
    }

    return makeCredReq
}

var preformatGetAssertReq = (getAssert) => {
    /* ----- DO NOT MODIFY THIS CODE ----- */
    getAssert.challenge = base64url.decode(getAssert.challenge);

    for (let allowCred of getAssert.allowCredentials) {
        allowCred.id = base64url.decode(allowCred.id);
    }

    return getAssert
}

var publicKeyCredentialToJSON = (pubKeyCred) => {
    /* ----- DO NOT MODIFY THIS CODE ----- */
    if (pubKeyCred instanceof Array) {
        let arr = [];
        for (let i of pubKeyCred)
            arr.push(publicKeyCredentialToJSON(i));

        return arr
    }

    if (pubKeyCred instanceof ArrayBuffer) {
        return base64url.encode(pubKeyCred)
    }

    if (pubKeyCred instanceof Object) {
        let obj = {};

        for (let key in pubKeyCred) {
            obj[key] = publicKeyCredentialToJSON(pubKeyCred[key])
        }

        return obj
    }

    return pubKeyCred
}


export const $functionAPI = {
    login: async (userAccount, userPin) => {
        const loginResult = await $fidoAPI.login('login', { userAccount, userPin });
        console.log(loginResult)
        if (loginResult.result === true) {
            console.log(loginResult)
            return {
                loginToken: loginResult.loginToken,
                result: true
            }
        } else return false;
    },

    register: async (userAccount, displayname, operationUser, loginToken) => {
        const response = await $fidoAPI.register('preregister', { userAccount, displayname, operationUser }, loginToken);
        console.log(response)

        let rawString = response.data.rawString;
        console.log(rawString)
        let jsonData = base64urlToRegularbase64(rawString);
        let publicKey = preformatMakeCredReq(jsonData.Response);
        console.log("publicKey", publicKey)
        const credential = await navigator.credentials.create({ publicKey });

        console.log("credential:", credential)
        console.log("credential_id", credential.id)
        console.log("credential_rawId", credential.rawId)

        let makeCredResponse = publicKeyCredentialToJSON(credential);

        const credentialData = { 
            userAccount: userAccount, 
            id: makeCredResponse.id, 
            rawId: makeCredResponse.rawId, 
            attestationObject: makeCredResponse.response.attestationObject, 
            clientDataJSON: makeCredResponse.response.clientDataJSON,
            origin: window.location.host, 
            operationUser 
        };

        const Response = await $fidoAPI.register('register', credentialData, loginToken);
        if (Response.result === true) 
            return true;
        else 
            return false;
    },

    authentication: async (userAccount, operationUser) => {
        const response = await $fidoAPI.authenticate('preauthenticate', { userAccount, operationUser });

        let rawString = response.data.rawString;
        let jsonData = base64urlToRegularbase64(rawString);
        let publicKey = preformatGetAssertReq(jsonData.Response);

        publicKey.userVerification = "required";
        console.log(publicKey)
        const credential = await navigator.credentials.get({ publicKey });
        let makeCredResponse = publicKeyCredentialToJSON(credential);
        console.log(makeCredResponse)

        const credentialData = { 
            userAccount: userAccount, 
            id: makeCredResponse.id, 
            rawId: makeCredResponse.rawId, 
            authenticatorData: makeCredResponse.response.authenticatorData, 
            clientDataJSON: makeCredResponse.response.clientDataJSON,
            signature: makeCredResponse.response.signature,
            origin: window.location.host, 
            operationUser 
        };

        const Response = await $fidoAPI.authenticate('authenticate', credentialData);
        console.log(Response)
        if (Response.result === true)
            return {
                result: true,
                info: Response.data
            }
        else
            return false;
    }
}