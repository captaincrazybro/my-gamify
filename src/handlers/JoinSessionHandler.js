const state = require('../utils/state');
const services = require('../config/services');
const Alexa = require('ask-sdk-core');
const DEFAULT_CODE = require('../config/config.json').defaultCode;

module.exports = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'JoinSessionIntent';
    },
    async handle(handlerInput) {
        let currentState = await state.getState();
        if (currentState == state.STATES.IDLE) {
            let speakOutput = handlerInput.t('NOT_STARTED_YET_MSG');
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse()
        }

        let deviceId = Alexa.getDeviceId(handlerInput.requestEnvelope);
        let user = await services.serviceFunctions.getUser(DEFAULT_CODE, deviceId);
        if (user) {
            let speakOutput = handlerInput.t('DEVICE_EXISTS_MSG');
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse()
        }

        let nameSlotValue = Alexa.getSlotValue(handlerInput.requestEnvelope, "name");
        // TODO: Prevent duplicate names
        // if (users.find(user => user.name == nameSlotValue)) {
        //     let speakOutput = handlerInput.t('NAME_EXISTS_MSG');
        //     return handlerInput.responseBuilder
        //         .speak(speakOutput)
        //         .reprompt(speakOutput)
        //         .getResponse()
        // }
        
        await services.serviceFunctions.addUser(state.USER_STATES.NOT_ANSWERED, deviceId, nameSlotValue, DEFAULT_CODE);    

        let speakOutput = handlerInput.t('JOINED_MSG', {name: nameSlotValue});

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
}