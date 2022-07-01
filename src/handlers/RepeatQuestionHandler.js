const state = require("../utils/state.js");
const Alexa = require('ask-sdk-core');
const services = require('../config/services');
const DEFAULT_CODE = require('../config/config.json').defaultCode;

module.exports = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RepeatQuestionIntent';
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

        let questions = await services.serviceFunctions.getQuestionsFromCode(DEFAULT_CODE);
        let questionNumber = await state.getQuestionNumber();
        let question = questions[questionNumber - 1];
        
        console.log(question);
        let speakOutput = `The question was ${question.data.prompt + (question.data.prompt.charAt(question.data.prompt.length - 1) != '?' ? "?" : "")} Here are the possible answers. One, ${question.data.answers[0]}. Two, ${question.data.answers[1]}. Three, ${question.data.answers[2]}. Four, ${question.data.answers[3]}.`

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .withSimpleCard(
                `${question.data.prompt + (question.data.prompt.charAt(question.data.prompt.length - 1) != '?' ? "?" : "")}`,
                `Here are the possible answers:\r\n1. ${question.data.answers[0]}\r\n2. ${question.data.answers[1]}\r\n3. ${question.data.answers[2]}\r\n4. ${question.data.answers[3]}`
            )
            .getResponse();
    }
}