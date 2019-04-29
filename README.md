# Reflection
An example of web application, it demonstrates how to setup your own Serverless Application by using Function, Tablestore(OTS), Api-gateway and OSS, all of them are provided by Alibaba Cloud.
## Quick Start

1. **[Registe for an Aliyun account](https://account.aliyun.com/register/register.htm)**

2. **[Install Fun](https://github.com/aliyun/fun/blob/master/docs/usage/installation-zh.md)**
    - npm install @alicloud/fun -g
3. **[Configuration, there are two ways, choose one of the following](https://github.com/aliyun/fun/blob/master/docs/usage/getting_started-zh.md#%E9%85%8D%E7%BD%AE)**
    - fun config, just execute this command
    - add .env file and remember add it to .gitignore
        ```ACCOUNT_ID=xxxxxxxx
        REGION=cn-shenzhen
        ACCESS_KEY_ID=xxxxxxxxxxxx
        ACCESS_KEY_SECRET=xxxxxxxxxx
        ```
4. **Create a Table Store Instance and Table, [the table store address of Aliyun](https://ots.console.aliyun.com)**
    - Create Instance, the default name is serverless, if you'd like to change it, you need to replace the EnvironmentVariables.InstanceName of the template.yml with yours.
    - Create Table, the defualt name is reflection, if you'd like to change it, you need to replace the EnvironmentVariables.InstanceName of the template.yml with yours.
    - Add primary keys, id's type is autoIncrement
            company
              Type: INTEGER
            Name: id
              Type: INTEGER
    
5. **`Fun Deploy`**
6. **Build and Deploy frontend application**
    - npm build
        ```cd frontend
        npm install
        npm run build
        ```
    - create OSS buket
    

## How it works
### TODO


## Another Way for Developing

#### WebIDE, it can be used to debug and deploy
1. **Install Docker and start it - [Docker Desktop for Mac](https://hub.docker.com/editions/community/docker-ce-desktop-mac)**
2. **Create workspace via WebIDE(MacOS Only)**
    - [Open Function Window](https://fc.console.aliyun.com/overview/cn-shenzhen), don't forget to choose the region you'd like to deploy your server to. In my case, I choose ShenZhen. The region is on the top of page.
    - [Open WebIDE Window](https://ide.fc.aliyun.com/cn-hangzhou) via clicking the WebIDE link on the middle of the Function page, WebIDE only support to choose the HangZhou region, but it doesn't matter.
    - Create host in WebIDE, File -> Create Host, it'll show you a command, Copy and execute the command locally
    ```
    curl -sL https://cn-hangzhou.ide.fc.aliyun.com/v1/agent/scripts/install?platform=linux | bash -s - -r cn-hangzhou -t xxxxxxxxxxx
    ```
    - Add your ide bin full path to $Path, the full path has been provided to you after you execute the curl command
    ```
    sudo ln -s  /Users/xxx/.ide_home/bin/ide /usr/local/bin
    ```
    and then start the ide agent
    ```
    ide start
    ```
    or you can use ide full path to start it directly.
    ```
    /Users/xxx/.ide_home/bin/ide start
    ```
    - Create Workspace, File -> Create Workspace, choose the host you've created and then input the workspace name you'd to create.
    
    
    

