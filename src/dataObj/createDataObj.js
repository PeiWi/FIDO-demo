import * as base64url from '../script/base64url.js';

export const $createDataObj = {
    getPublicKeyCredentialCreationOptions: (data, challenge) => {
        return {
            challenge,
            rp: {
                name: data.rp.name,
                id: data.rp.id
            },
            user: {
                id: Uint8Array.from(data.user.id, (c) => c.charCodeAt(0)),
                name: data.user.name,
                displayName: data.user.displayName
            },
            pubKeyCredParams: data.pubKeyCredParams,
            timeout: 60000,
            attestation: data.attestation
        };
    },

    getRegisterObj: (userName, credential) => {
        return {
            svcinfo: {
                did: 1,
                protocol: 'FIDO2_0',
                authtype: 'PASSWORD',
                svcusername: 'svcfidouser',
                svcpassword: 'Abcd1234!'
            },
            payload: {
                strongkeyMetadata: {
                    version: '1.0',
                    create_location: 'Sunnyvale, CA',
                    origin: 'https://$domain:8080',
                    username: userName
                },
                publicKeyCredential: {
                    id: credential.id,
                    rawId: base64url.encode(credential.rawId),
                    response: {
                        attestationObject: base64url.encode(credential.response.attestationObject),
                        clientDataJSON: base64url.encode(credential.response.clientDataJSON)
                    },
                    type: credential.type,

                    appTXID: 'exampleappTXID'
                }
            }
        };
    },

    getPreregisterObj: (userName, displayName) => {
        return {
            svcinfo: {
                did: 1,
                protocol: 'FIDO2_0',
                authtype: 'PASSWORD',
                svcusername: 'svcfidouser',
                svcpassword: 'Abcd1234!'
            },
            payload: {
                username: userName,
                displayname: displayName,
                options: {
                    attestation: 'direct'
                },
                extensions: '{}',
                appTXID: 'exampleappTXID'
            }
        };
    },

    getPublicKeyCredentialRequestOptions: (data, challenge) => {
        const keylength = data.allowCredentials.length;
        let CredentialsId = [];

        for (let i = 0; i < keylength; i++) {
            CredentialsId.push({
                id: base64url.decode(data.allowCredentials[i].id),
                type: 'public-key',
                transports: ['usb', 'ble', 'nfc'],
            });
        }
        const publicKeyCredentialRequestOptions = {
            challenge,
            allowCredentials: CredentialsId,
            timeout: 60000,
        };
        
        return publicKeyCredentialRequestOptions;
    },

    getAuthenticateObj: (userName, assertion) => {
        return {
            svcinfo: {
                did: 1,
                protocol: 'FIDO2_0',
                authtype: 'PASSWORD',
                svcusername: 'svcfidouser',
                svcpassword: 'Abcd1234!'
            },
            payload: {
                strongkeyMetadata: {
                    version: '1.0',
                    last_used_location: 'Cupertino, CA',
                    origin: '$domain',
                    username: userName
                },
                publicKeyCredential: {
                    id: assertion.id,
                    rawId: base64url.encode(assertion.rawId),
                    response: {
                        authenticatorData: base64url.encode(assertion.response.authenticatorData),
                        signature: base64url.encode(assertion.response.signature),
                        userHandle: assertion.response.userHandle,
                        clientDataJSON: base64url.encode(assertion.response.clientDataJSON)
                    },
                    type: assertion.type,
                    appTXID: 'exampleappTXID'
                }
            }
        };
    },

    getKeysInfo: (userName) => {
        return {
            svcinfo: {
                did: 1,
                protocol: 'FIDO2_0',
                authtype: 'PASSWORD',
                svcusername: 'svcfidouser',
                svcpassword: 'Abcd1234!'
            },
            payload: {
                username: userName,
                appTXID: 'exampleappTXID'
            }
        };
    }
};
