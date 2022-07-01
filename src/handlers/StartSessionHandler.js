const Alexa = require('ask-sdk-core');
const state = require("../utils/state.js");
const services = require('../config/services');
const DEFAULT_CODE = require('../config/config.json').defaultCode;

module.exports = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StartSessionIntent';
    },
    async handle(handlerInput) {
        let currentState = await state.getState();
        if (currentState != state.STATES.IDLE) {
            let speakOutput = handlerInput.t('ALREADY_STARTED_MSG');
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse()
        }

        // Reset from previous game
        await services.serviceFunctions.resetUsers(DEFAULT_CODE);

        let deviceId = Alexa.getDeviceId(handlerInput.requestEnvelope);
        await state.setOwnerId(deviceId);
        await state.setState(state.STATES.AWAITING_NEXT_QUESTION);

        let speakOutput = handlerInput.t('SESSION_STARTED_MSG')

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
}