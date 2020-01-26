const config = require('./config');

const client = require('twilio')(config.accountSid, config.authToken);



function sendText(from, message, to) {
    console.log(from,message, to);
    
    return client.messages
        .create({
            from: from,
            body: message,
            to: to
        })
}

module.exports = { sendText }