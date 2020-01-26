const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const DF = require("./dfservice");
const twilio = require('./twilio');

const port = 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const sessionIds = new Map();

app.post('/', async (req, res) => {
    const sender = req.body.From;
    const text = req.body.Body;
    const from = req.body.To;
    setSessionAndUser(sender);
    let response;
    try {
        response = await DF.sendTextQueryToDialogFlow(sessionIds, sender, text);
        await twilio.sendText(from, response.fulfillmentText || response.queryText, sender).then(m => console.log(m.sid))
    } catch (error) {
        console.log(error)
    }
});

function setSessionAndUser(senderID) {
    if (!sessionIds.has(senderID)) {
        sessionIds.set(senderID, uuid.v1());
    }
}
app.listen(port, () => console.log(`Magic on ${port}`));
