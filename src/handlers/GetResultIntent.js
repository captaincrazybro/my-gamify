const state = require("../utils/state.js");
const Alexa = require('ask-sdk-core');
const services = require('../config/services');
const DEFAULT_CODE = require('../config/config.json').defaultCode;

module.exports = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetResultsIntent';
    },
    async handle(handlerInput) {
        let currentState = await state.getState();
        if (currentState != state.STATES.IDLE) {
            let speakOutput = handlerInput.t('NOT_FINISHED_MSG');
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse()
        }

        let deviceId = Alexa.getDeviceId(handlerInput.requestEnvelope);
        let user = await services.serviceFunctions.getUser(DEFAULT_CODE, deviceId);
        if (!user) {
            let speakOutput = handlerInput.t('USER_NOT_JOINED_MSG');
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse()
        }

        let users = await state.getUsers();
        let place = getPlace(user, users);

        let speakOutput = handlerInput.t('USER_RESULT_MSG', {place: place, score: user.data.score, points_S: user.data.score != 1 ? "s" : ""})

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
}

function getPlace(user, users) {
    let outcome;
    let sortedUsers = users.sort((a, b) => {
        return b.data.score - a.data.score
    })

    sortedUsers.forEach((u, i) => {
        if (u.data.device_id == user.data.device_id) {
            outcome = i;
        }
    })
 
    let place = outcome + 1;
    if (place == 1) return "1st"
    else if (place == 2) return "2nd"
    else if (place == 3) return "3rd"
    else return `${place}th`
}