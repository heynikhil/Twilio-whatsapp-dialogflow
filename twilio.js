const accountSid = 'AC8ece75843df629e1fd5401f96ae6c9eb';
const authToken = '5241c5f55be2ef336362c118036f2124';
const client = require('twilio')(accountSid, authToken);



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