# Entra Id Web Auth Reference
The web app provides a authentication to Azure Entra ID and role checking. It is useful to build admin pages out of scratch.
## Purpose detail
The app which fulfills the following requirements for a 
- Quick to initialize
- Debug with breakpoints of Frontend and Backend and just in time compiler
- Debug by starting F5 in VSCode (Starting chrome also)
- Deployment of a productive version with precompiled frontend server
- Deployment to Azure App Service Free Plan with Actions on Pull Request

## Prerequisites
Here are the prerequisites that you have to install before running the app
1. The app requires python3 to be installed on the machine with venv. To install it on on Ubuntu (WSL) just type. On Windows just install from windows store https://apps.microsoft.com/detail/9PNRBTZXMB4Z?hl=en-us&gl=CH&ocid=pdpshare 
```
sudo apt update
sudo apt install python3 python3-venv python3-pip
```
2. Then clone the repository
3. Go into the backend folder `cd ./backend`
4. init venv and install pip packages into it by typing 
On linux
```
python3 -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt
```
On Windows
```
python -m venv venv
.\venv\Scripts\activate.bat
pip install -r requirements.txt
```
5. Go into the frontend folder `cd ./frontend`
6. Run `npm install` which will download and install all frontend package5
### Architecture
Here is the simple architecture description
#### ./backend
Here is the python backend located which is build with simple FastAPI Framework
#### ./frontend
Here is the frontend located which is build with Vite was just slightly modified in `vite.config.js` to output the Dist Build to Backend. This is now build with React but you are free to running the following command from the root folder to setup your own framework with it. 
```
npm create vite frontend
```
__Dont forget to add the following lines to `./frontend/vite.config.js` into `export default defineConfig({})` block or it will not run in production.__
```
  base: "/",
  // Put the dist folder into the backend to enable easier deployment
  build: {
    outDir: '../backend/dist',
    emptyOutDir: true, // also necessary
  }
})
```
## Debugging the app
You need the following Extensions into VS Code
1. Python Debugger
2. Python
3. Pylance

Afterward in __VSCode__ you can 
1. Open your project folder  
2. On the left bar select "Run and Debug"
3. Select Full Stack Debug
4. And simply press __F5__. (It will compile the app and start a debugging session in chrome)
5. Now you can set Breakpoints in each frontend and backend

## Generate a production build (Frontend)
To generate a production compile of the frontend
1. Navigate to frontend folder `cd ./frontend`
2. Type `npm run build`
3. It will create a build into ./__backend__/dist folder where fast-api will start it. `./backend/dist`

## Azure Web App Setup
This section handles how to setup the Azure App Service
1. Create a Azure Web App Service. Select F1 Free Tier as it is enough for this app. 
2. You can select Github as Deploy provider and it will also create you a Action and a user managed identity for deployment. Please make sure that you replace the file afterward with this file from this project to get the correct settings `/.github/deploy_to_azure_app_service.yml` file afterward. You should just preseve copy this block in line 90 from your generated file as it provides the deployment user identites.
```
 - name: Login to Azure
        uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZUREAPPSERVICE_CLIENTID_07118B6326EE492693A4582BDAE9294E }}
          tenant-id: ${{ secrets.AZUREAPPSERVICE_TENANTID_98091920E4D5432E9786AA6ADFC34B54 }}
          subscription-id: ${{ secrets.AZUREAPPSERVICE_SUBSCRIPTIONID_7BFCF659655641B8987A25BBEF11D64A }}
```
2.In Azure Portal go to your App in Settings/Configuration you have to setup the Startup Command as
```
gunicorn --worker-class uvicorn.workers.UvicornWorker --timeout 600 --access-logfile '-' --error-logfile '-' main:app
```