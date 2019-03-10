# Aliyun Serverless Sample

## Quick Start

1. **[Registe for an Aliyun account](https://account.aliyun.com/register/register.htm)**

2. **Install Docker and start it - [Docker Desktop for Mac](https://hub.docker.com/editions/community/docker-ce-desktop-mac)**

3. **Create workspace via WebIDE(MacOS Only)**
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
    
    
    

