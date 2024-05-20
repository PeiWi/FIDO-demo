import '../assets/css/fidoClentPage.css';
import KeyListTable from '../components/KeyListTable';
import { useState } from 'react';
import { $functionAPI } from '../apis/functionAPI';
import { message, Space } from 'antd';

function FidoClentPage() {
    const [userAccount, setuserAccount] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [pin, setPin] = useState('');
    const [loginToken, setLoginToken] = useState(null);
    const [result, setResult] = useState('');
    const [keyList] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();

    return (
        <div className="App">
            <h1 className="page-title">Fido-client</h1>
            <div className="input-area">
                <div>
                    <span className="title">UserAccount:</span>
                    <input type="text" id="UserAccount" name="UserAccount" onChange={(e) => setuserAccount(e.target.value)} />
                </div>
                <div>
                    <span className="title">DisplayName:</span>
                    <input type="text" id="DisplayName" name="DisplayName" onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <div>
                    <span className="title">Pin:</span>
                    <input type="text" id="pin" name="pin" onChange={(e) => setPin(e.target.value)} />
                </div>
            </div>
            <div className="button-area">
            <button id="Login" onClick={() => login()}>
                    Login
                </button>
                <button id="Register" onClick={() => register()}>
                    Register
                </button>
                <button id="Authenticate" onClick={() => authenticate()}>
                    Authenticate
                </button>
            </div>
            <div>
                <p className="result">{result}</p>
                {keyList.length > 0 && result === '' && <KeyListTable tableItem={keyList} />}
            </div>
            {contextHolder}
            <Space></Space>
        </div>
    );

    async function login() {
        resetResult();
        if (!checkInputValue()) return;
        const loginResult = await $functionAPI.login(userAccount, pin);
        const loginToken = loginResult.loginToken;
        setLoginToken(loginToken);
        if (loginResult.result === true)
            setResult("Successful!");
        else 
            setResult("Fail!");

    }
    
    async function register() {
        resetResult();
        if (!checkInputValue()) return;
        const operationUser = "1";
        await $functionAPI.register(userAccount, displayName, operationUser, loginToken).then((registerRes) => {
            if (registerRes === true) 
                setResult("Successful!");
            else 
                setResult("Fail!");
        })
    }

    async function authenticate() {
        resetResult();
        if (!checkInputValue()) return;
        const operationUser = "1";
        await $functionAPI.authentication(userAccount, operationUser).then((authenticateRes) => {
            if (authenticateRes.result === true)  {
                console.log(authenticateRes.info)
                setResult("Successful!");
            }
            else 
                setResult("Fail!");
        })
    }

    function resetResult() {
        setResult('');
    }

    function checkInputValue() {
        if (userAccount === '') {
            openMessage('error', 'please enter UserName');
            return false;
        }
        return true;
    }

    function openMessage(type, text) {
        messageApi.open({
            type: type,
            content: text
        });
    }
}

export default FidoClentPage;
