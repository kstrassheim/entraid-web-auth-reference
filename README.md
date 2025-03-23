# Entra Id Web Auth Reference
The web app provides a authentication to Azure Entra ID and role checking and full automatic terraform resource deployment. It is useful to build admin pages out of scratch. You do not have to setup anything on specific resources. Setup like env variables becomes obsolete here. Just create the resource group, connect github to it, connect terraform states and deploy. 
## Purpose detail
This project fulfills the following requirements.
### From this project [EntraId-Web-Auth-Reference]https://github.com/kstrassheim/entraid-web-auth-reference 
- Create the whole infrastructure with terraform
- Provide all required settings for the environment via terraform output
- Build and connect all the applications according to the terraform config for each environment. __Without manual setup of environment variables__
- Deploy and connect to the Authentication automatically

### From [FastAPI-Reference](https://github.com/kstrassheim/fastapi-reference)
- Quick to initialize
- Debug with breakpoints of Frontend and Backend and just in time compiler
- Debug by starting F5 in VSCode (Starting chrome also)
- Deployment of a productive version with precompiled frontend server

## Prerequisites
Here are the prerequisites that you have to install before running the app
1. The app requires python3 to be installed on the machine with venv. To install it on on Ubuntu (WSL) just type. On Windows just install from windows store https://apps.microsoft.com/detail/9PNRBTZXMB4Z?hl=en-us&gl=CH&ocid=pdpshare. 
```sh
sudo apt update
sudo apt install python3 python3-venv python3-pip
```
2. Then clone the repository
3. Go into the project folder and run init script (for detail read that script)

On linux
```sh
./init.sh
```
On Windows
```bash
./init.cmd
```
4. Make sure the name (venv) username appears in the console 
5. Download and install VSCode Python Plugins for debugging experience.
6. In VSCode go to Debug Settings and select "Full Stack Debug"
7. Press key F5 to run the project which should start with a new browser and show you the page

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
## Azure Setup
Create an empty resource group and make sure that you are at least Contributor of it.
## Github Setup
The github actions require permissions to create the structure with terraform. Do the following steps to create and assign a ServicePricipal to that specific Github Project' Environment if neccessary.
1. Go to your Project's (Env) Resouce Group click on Create and Create a User assigned Managed Identity. There is no special setup on this point. Just create it.
2. Open the Managed Identity goto Settings/Federated Credentials and click Add Credential and select the Federated credential scenario "Configure a Github issued token..."
3. Add your Organization/Personal Accountname, enter the repository name and __environment__ name as Entity. Also choose a credential name for it.
4. Click on Add
5. Go to overview Page and save the following IDs from it
  - Client ID
  - Subcription ID
  - Tenant ID (Open JSON View on the top right for that)
6. Go on Github and open you repository and open Settings
7. In Environments select "new environment" and enter the name of the __environment__ you choosen in the federated credential. then click on configure environment.
8. Enter the following Environment __Secrets__ which you saved from the managed identites. The key names have to be exactly like that. The values you got from the federated credential.
  - AZURE_CLIENT_ID=[Client ID]
  - AZURE_SUBSCRIPTION_ID=[Subcription ID]
  - AZURE_TENANT_ID=[Tenant ID] 
9. make sure that you have set up the environment name in any job that requires these credentials.
  ```yaml
    jobs:
      terraform:
        environment:
          name: 'dev'
  ```
10. In the jobs where you need them add the with statement to make sure they are provided. The services should usually auto grab them otherwise you can map them.
  ```yaml
      with:
        # auth-type: SERVICE_PRINCIPAL
        client-id: ${{ secrets.AZURE_CLIENT_ID }}
        tenant-id: ${{ secrets.AZURE_TENANT_ID }}
        subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
  ```
11. You are done here. Run the Action and check if it can authorize on azure for it.
## Azure Storage Setup
When you have a Storage Account for all Terraform states of all projects on your Tenant then create a Container `[projectname_env]` and
1. Check if terraform azurerm backend is configured with use_azuread_auth = true
2. Assign yourself as **Storage Data Contributor** to the container
3. Assign the Github Managed Identity also **Storage Data Contributor** Permissions to the container

## Terraform deployment
When you have set up everything then terraform will do the whole deployment of the resources and the web application. 
