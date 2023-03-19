[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) [![Gatekeeper](https://github.com/aws-hebrew-book/whatsapp-logger/actions/workflows/main.yml/badge.svg)](https://github.com/aws-hebrew-book/whatsapp-logger/actions/workflows/main.yml) [![security: bandit](https://img.shields.io/badge/security-bandit-yellow.svg)](https://github.com/PyCQA/bandit)


<!-- PROJECT LOGO -->
<br />
<div align="center">
    <img width="256" height="256" src="https://user-images.githubusercontent.com/110536677/216813972-ea76373f-bfaa-4875-bdfa-5c93bd91acb7.png" alt="A 3d art showing whatsapp application turning into small water drops that fall">

<h3 align="center">WhatsApp Group Manager</h3>

  <p align="center">
   Introducing a new application that helps you keep track of your WhatsApp group discussions. If you have several WhatsApp groups, you may sometimes find it challenging to keep up with the conversations and discussions, especially if you are a new member. This application solves this problem by saving the content of your WhatsApp groups in a Google Sheet and to create a daily summary of the conversations using ChatGPT.

With this application, new members can easily review previous discussions, even if they weren't a part of the group when the discussions took place. The Google Sheet acts as a database of all the discussions, allowing new members to search for relevant information using keywords or specific dates.

In the future, we will provide access to any media shared in the group, such as images, videos, and audio clips. With these features, you will have all the information you need at your fingertips, making it easier than ever to stay connected with your WhatsApp groups.
    </p>
<img src="https://user-images.githubusercontent.com/110536677/217352491-ad533419-45db-4c30-ba28-ed3a843e7fa3.png">
    <br />
    <br />
    <a href="https://github.com/aws-hebrew-book/reminders/issues">Report Bug</a>
    ·
    <a href="https://github.com/aws-hebrew-book/reminders/issues">Request Feature</a>
  </p>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#high-level-architecture">High level architecture</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
    </li>
    <li>
      <a href="#operation-costs">Operation Costs</a>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#logo">Logo</a></li>
  </ol>
</details>

## High level architecture

<div align="center">
    <img src="https://user-images.githubusercontent.com/110536677/224486399-e0b2c8f9-91b8-47af-acbc-a84bb8077286.png" alt="Architecture diagram">
</div>

This architecture consists of several AWS components that work together to allow for capturing and storing data from the popular messaging application, WhatsApp. The components in the architecture include:

* WhatsApp, the web application that serves as the source of data
* Admin Lambda, a tool used for viewing and updating the configuration of the application
* S3 bucket, which stores a QR image generated by the system
* ECS Fargate, a container service that runs the WhatsApp web listener application and listens to the incoming data from WhatsApp web using headless chrome
* SNS, which acts as a channel for pushing WhatsApp messages
* SQS, a messaging service that also receives the WhatsApp messages
* Write to Sheet Lambda, a function that reads the messages from SQS and writes them to a Google Sheet
* AWS Secrets Manager, which holds secrets such as google and admin credentials
* Parameters Store, which holds the configuration information for the application
* Google Sheet, which acts as the final storage location for the messages, organized by group and each message as a separate line.


## Getting started
### Prerequisites
* Make sure to have the [latest CDK version installed](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html#getting_started_install) (V2).
* An AWS enviornment.
* Python 3.9 (I highly recommend using [pyenv](https://github.com/pyenv/pyenv#installation)).
* [Python Poetry](https://python-poetry.org/docs/#installation)
* Add [Poe the Poet](https://github.com/nat-n/poethepoet) to Poetry by running `poetry self add 'poethepoet[poetry_plugin]'`


### Installation
* Clone this repository.
* The application uses CDK as IaC framework. 
* Run `poetry install` to install relevant dependencies.
* Next run the `poetry poe deploy`. It will run the CDK deployment script. Approve the deployment of the various stacks. Sit tight, it will take a couple of minutes.
* When the installation is complete you should get two links - 1. to the admin dashboard and 2. to the admin password stored in AWS.
![New Project](https://user-images.githubusercontent.com/110536677/220544692-63814d36-6b3d-45f6-8f0f-22591963b724.png)


* Get the secret password, by going to the secret manager, scroll down and click `Retrieve secret value`
![image](https://user-images.githubusercontent.com/110536677/217345589-d2851311-8bfc-4d37-9871-3efc33335780.png)

* Go to the admin dashboard, the user name is `admin`and the password is the one you have copied.
![image](https://user-images.githubusercontent.com/110536677/220544849-6a6f21c0-0b4f-44be-b4b2-b21008a41ef0.png)

### Setting up OpenAI
* You can create daily summary of your various WhatsApp groups.
* Behind the scene this app is using OpenAI ChatGPT engine to summerize the conversations.
* You need to setup an OpenAI  dev account.
* Signup to [OpenAI](https://platform.openai.com/signup)
* Create a secret key by going to the `manage account` and choose API Keys
![New Project (1)](https://user-images.githubusercontent.com/110536677/224487016-4950b611-2b92-4980-a797-1c297e914541.png)
* Copy the key and paste it the OpenAI Key in the admin panel.
![image](https://user-images.githubusercontent.com/110536677/224487060-77059cd6-0db8-45f3-987b-cbd548b2f83d.png)
* Every one hour, the list of available groups in your WhatsApp account are collected and shown under Groups Configuration.
* You can choose per group where do you want the summary to be written at.

### Setting up Google
* Create a new spreadsheet in google sheet.
* In case you want to save yur whatsapp chats into google sheets, you need to configure a google cloud account.
* Head to [Google Developers Console](https://console.cloud.google.com/apis/dashboard?project=serverless-demo-210412) and create a new project (or select the one you already have).
* In the box labeled "Search for APIs and Services", search for “Google Drive API” and enable it.
* In the box labeled "Search for APIs and Services", search for “Google Sheets API” and enable it.

Service account is a special type of Google account intended to represent a non-human user that needs to authenticate and be authorized to access data in Google APIs.

Since it’s a separate account, by default it does not have access to any spreadsheet until you share it with this account. Just like any other Google account.

Here’s how to get one:
* Enable API Access for a Project if you haven’t done it yet.
* Go to “APIs & Services > Credentials” and choose “Create credentials > Service account key”.
* Fill out the form
* Click “Create” and “Done”.
* Press “Manage service accounts” above Service Accounts.
* Press on ⋮ near recently created service account and select “Manage keys” and then click on “ADD KEY > Create new key”.
* Select JSON key type and press “Create”.
* You will automatically download a JSON file with credentials. It may look like this:
```
{
    "type": "service_account",
    "project_id": "api-project-XXX",
    "private_key_id": "2cd … ba4",
    "private_key": "-----BEGIN PRIVATE KEY-----\nNrDyLw … jINQh/9\n-----END PRIVATE KEY-----\n",
    "client_email": "473000000000-yoursisdifferent@developer.gserviceaccount.com",
    "client_id": "473 … hd.apps.googleusercontent.com",
    ...
}
```
* Remember the path to the downloaded credentials file. Also, in the next step you’ll need the value of client_email from this file.
* Very important! Go to your spreadsheet and share it with a client_email from the step above. Just like you do with any other Google account.
* Now go to the admin dashboard from the previous section.
* Paste the json into the `Google Secret` text box.
* Copy the the spreadsheet url you created in step one and paste it into the `Sheet URL` text box.
![image](https://user-images.githubusercontent.com/110536677/224486473-d2f71418-2058-4785-808b-8f3464e9ba36.png)

* Click save and you are done.

### Connecting WhatsApps
* Behind the scenes this application uses [WhatsApp web](https://github.com/pedroslopez/whatsapp-web.js/) to pull chat content.
* In order to connect to WhatsApp you need to scan a QR code with your **Real WhatsApp instance**, that is, the one that runs on a real phone.
* **Please be aware** that this process is experimental and may result in your WhatsApp number being identified as a bot and disconnected. It is recommended to use a disposable number instead.
* In the admin dashboard click on `WebApp Client Status`, and scan the image with your WhatsApp app.
* You are good to go. See your spreadsheet gets updated.

![image](https://user-images.githubusercontent.com/110536677/224486661-90f4ddd4-94be-4b37-a1c3-561924fb7dc7.png)

## Usage
After configuring the OpenAI and WhatsApp integration, the application will begin to collect a list of available groups associated with your WhatsApp account. These available groups can be viewed under the Groups Configuration tab, as shown in the image below:![image](https://user-images.githubusercontent.com/110536677/226162191-2480bfd4-465c-46f9-ba99-3b6eb29a2840.png)

For each group, you have the option to define whether you want it to be summarized and, if so, where you want the summary to be sent. You have three options to choose from:
* Myself - The summary messages will be sent to your own chat. This is a good option if you want to keep the summary private. ![image](https://user-images.githubusercontent.com/110536677/226162322-bf763d65-79ae-4a0d-91cf-e27cd3922669.png).
* Original Group - The summary will be written in the original group where the discussion occurred.
* None - This option will stop the daily summary for that specific group. This is the default for all new groups.

Once you've chosen where to send the summary, you can select the language in which the summary will be written. Currently, the application supports eight languages:
* English - the default
* Hebrew
* Mandarin Chinese
* Spanish
* Hindi
* Arabic
* French
* German

![image](https://user-images.githubusercontent.com/110536677/226162512-837f0eaf-8f43-4bbc-881f-16b81f10abf0.png)

## Operation Costs
The Serverless components in use, such as Lambda, DynamoDB, and SQS, are very inexpensive and are fully covered under the free tier. 
The only elements that cost money are a NAT instance and a single Fargate instance. 
* A t3.micro NAT instance costs around $7.4 per month, 
* while a Fargate instance with 0.25 vCPU and 1GB of memory costs approximately $10.4 per month. Using an ARM architecture may result in some savings for the Fargate instance. 

**Overall, the total monthly cost is approximately $17.8.**

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


<!-- LICENSE -->
## License

Distributed under the Apache License Version 2.0 License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

Efi Merdler-Kravitz - [@TServerless](https://twitter.com/TServerless)



## Logo
The project's logo was created by Dall-E 2 with the following description _A 3d art showing whatsapp application turning into small water drops that fall_


<p align="right">(<a href="#readme-top">back to top</a>)</p>
