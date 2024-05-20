
## Install Certificate

#### Windows
1. `安裝 Chocolatey` 用系統管理員運行 PowerShell 並貼上
`Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))`

2. 安裝完成後，執行以下指令 `choco install mkcert`
3. `mkcert -install`

4. 在 FIDO-Client 專案下，建置 key & cert，請修改成自己專案放置的位置
   `mkcert -key-file $Path\FIDO-demo\ssl\key.pem -cert-file $Path\FIDO-demo\ssl\cert.pem "$domain"`

#### macOS
1. `安裝 Chocolatey` 使用 `brew install mkcert`
2. `mkcert -install`
3. 在 FIDO-Client 專案下，建置 key & cert，請修改成自己專案放置的位置
   `mkcert -key-file (路徑)\FIDO-demo\react\ssl\key.pem -cert-file (路徑)\FIDO-demo\ssl\cert.pem "$domain"`
## Run
#### Windows
---
1. 把 `localhost(127.0.0.1)` 指向 `$domain`，在 **C:\Windows\System32\drivers\etc\hosts** 加入 `127.0.0.1 $domain`

2. 將 Chrome 的整個資料夾複製到 `C:\`
![chrome](https://i.imgur.com/EnENS0h.jpeg)


1. `npm i`

2. `npm run windows-start`
#### macOS
---
1. 把 `localhost(127.0.0.1)` 指向 `$domain`，在 **/private/etc/hosts** 加入 `127.0.0.1 (domain)`

2. 將 Chrome 的整個資料夾複製到 `User/(username)/`

3. `npm i`

4. `npm run mac-dev`

5. `npm run mac-chrome` 請修改 `package.json` 中把 `mac-chrome` 的路徑

# Sample Code

|Variable   |Type  |Null?|
|-----------|------|-----|
|displayName|String|No   |
|userName   |String|No   |

    import { $functionAPI } from 'src/apis/functionAPI';

    const operationUser = "1";

    let displayName = window.prompt("displayName");
    let userAccount = window.prompt("userName");
    let pin = window.prompt("pin");
    let loginToken; //Just for example, please do not use global variable.
    
    async function login() {
      const loginResult = await $functionAPI.login(userAccount, pin);
      loginToken = loginResult.loginToken;
      if (loginResult.result === true)
         console.log("Successful!");
      else 
         console.log("Fail!");
    }

    async function register() {
      const operationUser = "1";
      let registerRes = await $functionAPI.register(userAccount, displayName, operationUser, loginToken)
      if (registerRes === true) 
         console.log("Successful!");
      else 
         console.log("Fail!");
    }

    async function authenticate() {
      let authenticateRes = await $functionAPI.authentication(userAccount, operationUser)
      if (authenticateRes.result === true)  {
         console.log(authenticateRes.info);
         console.log("Successful!");
      }
      else 
         console.log("Fail!");
    }
