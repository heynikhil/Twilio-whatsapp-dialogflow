const dialogflow = require('dialogflow');
const config = require('./config');


const credentials = {
    client_email: config.client_email,
    private_key: config.private_key,
};

const sessionClient = new dialogflow.SessionsClient(
    {
        projectId: config.project_id,
        credentials
    }
);


module.exports = {

    async sendTextQueryToDialogFlow(sessionIds, sender, text, params = {}) {
        const sessionPath = sessionClient.sessionPath(config.project_id, sessionIds.get(sender));

        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: text,
                    languageCode: config.DF_LANGUAGE_CODE,
                },
            },
            queryParams: {
                payload: {
                    data: params
                }
            }
        };
        const responses = await sessionClient.detectIntent(request);

        return responses[0].queryResult;

    },


    async sendEventToDialogFlow(sessionIds, handleDialogFlowResponse, sender, event, params = {}) {
        const sessionPath = sessionClient.sessionPath(config.GOOGLE_PROJECT_ID, sessionIds.get(sender));
        const request = {
            session: sessionPath,
            queryInput: {
                event: {
                    name: event,
                    parameters: structjson.jsonToStructProto(params), //Dialogflow's v2 API uses gRPC. You'll need a jsonToStructProto method to convert your JavaScript object to a proto struct.
                    languageCode: config.DF_LANGUAGE_CODE,
                },
            }
        };


        const responses = await sessionClient.detectIntent(request);

        const result = responses[0].queryResult;
        handleDialogFlowResponse(sender, result);

    }


}