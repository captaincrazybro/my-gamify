const state = require("../utils/state.js");
const Alexa = require('ask-sdk-core');
const services = require('../config/services');
const DEFAULT_CODE = require('../config/config.json').defaultCode;

module.exports = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AnswerQuestionIntent';
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
        if (currentState == state.STATES.AWAITING_NEXT_QUESTION) {
            let speakOutput = handlerInput.t('QUESTION_NOT_STARTED_MSG');
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

        let userState = await state.getUserState(deviceId);
        if (userState != state.USER_STATES.NOT_ANSWERED) {
            let speakOutput = handlerInput.t('ALREADY_ANSWERED_MSG');
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse()
        }

        let questions = await services.serviceFunctions.getQuestionsFromCode(DEFAULT_CODE);
        let questionNumber = await state.getQuestionNumber();
        let question = questions[questionNumber - 1];
        let answerIndex = parseAnswerSlot(Alexa.getSlotValue(handlerInput.requestEnvelope, "answer"))
        
        if(answerIndex == -1) {
            let speakOutput = handlerInput.t('INVALID_ANSWER_MSG');
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }

        let gotCorrect = question.data.index == answerIndex;
        if (gotCorrect) {
            await services.serviceFunctions.incrementUserScoreFromDeviceId(DEFAULT_CODE, deviceId);
        }
        
        await state.setUserState(deviceId, gotCorrect ? state.USER_STATES.CORRECT : state.USER_STATES.INCORRECT);
        let speakOutput = handlerInput.t('ANSWERED_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
}

function parseAnswerSlot(answer) {
    if (answer == "one" || answer == "1st" || answer == 1) return 0
    else if (answer == "two" || answer == "2nd" || answer == 2) return 1
    else if (answer == "three" || answer == "3rd" || answer == 3) return 2
    else if (answer == "four" || answer == "4th" || answer == 4) return 3
    else return -1
}