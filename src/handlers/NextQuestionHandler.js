const state = require("../utils/state.js");
const services = require('../config/services');
const DEFAULT_CODE = require('../config/config.json').defaultCode;
const Alexa = require('ask-sdk-core');

module.exports = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NextQuestionIntent';
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
        let ownerId = await state.getOwnerId();
        if (deviceId != ownerId) {
            let speakOutput = handlerInput.t('NOT_OWNER_MSG');
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse()
        }

        if (currentState == state.STATES.QUESTION_IN_PROGRESS) {
            let speakOutput = handlerInput.t('QUESTION_ALREADY_STARTED_MSG');
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse()
        }

        let questions = await services.serviceFunctions.getQuestionsFromCode(DEFAULT_CODE);
        let questionNumber = await state.getQuestionNumber();    
        let question = questions[questionNumber];
        console.log(question + " and " + questionNumber);

        if (question.data.answers.length != 4) {
            let speakOutput = "Sorry, the number of answers for this question is not correct."
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse()
        }

        await state.nextQuestion();
        await state.resetUserStatuses();
        await state.setState(state.STATES.QUESTION_IN_PROGRESS);

        let speakOutput = `The next question is ${question.data.prompt + (question.data.prompt.charAt(question.data.prompt.length - 1) != '?' ? "?" : "")} Here are the possible answers. One, ${question.data.answers[0]}. Two, ${question.data.answers[1]}. Three, ${question.data.answers[2]}. Four, ${question.data.answers[3]}.`;

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