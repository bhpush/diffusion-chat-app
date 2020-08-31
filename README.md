# diffusion-chat-app

This is sample chat application using Node JS & Diffusion Cloud
Users can chat in realtime across various meeting rooms.
A simple projects, illustrating production and consumption of chat messages to and from a Diffusion Cloud instance.

# Requirements
* A Diffusion Cloud service, version 6.5.0 or greater.
    * Configure your Diffusion Cloud service to allow anonymous sessions.
* node.js v12.
* npm v6.
* A Web browser supported by Diffusion.

# Installation
```
./diffusion-chat-app user$ npm install
```

Set lines 12 of `public/js/app.js` to the hostname of your Diffusion Cloud service, which you can find in your service dashboard.
You can also leave the default values and connect to our sandbox service:
  diffusionchatapp.eu.diffusion.cloud
  user: admin
  password: password

# Execution

To run a minimal web server, and open a web browser with Diffusion Chat App.
To create JSON topic `Chat/chatroom` with JSON value `{"text": ,"name": ,"timestamp": }` every time we hit submit message button.
```
./diffusion-chat-app user$ npm run chat
```