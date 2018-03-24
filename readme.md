# A Simple App for Recording Voice and Getting A Sentiment Analysis

This small application uses Google Speech Recognition API to convert spoken
words to text then uses a websocket connection to send the text back to a Node.js
server that analyses the sentiment of the words.  It is intended as a small demo
of real-time communication using sockets.

http://sentiment.dawsongoodell.com/

## Installation

(Only works on Google Chrome)
Accessing the microphone requires an SSL connection even for local development.
I recommend using Lets Encrypt (https://letsencrypt.org) to generate a set of
certificates.  Move the resulting certificates (two .pem files) to the 
`/certificates` folder.  The Express server will read them and boot secured.

After moving the certificates:
```
yarn install
yarn start
```