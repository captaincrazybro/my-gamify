const state = require("../utils/state.js");
const Alexa = require('ask-sdk-core');

module.exports = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'EndQuestionIntent';
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

        currentState = await state.getState();
        if (currentState == state.STATES.AWAITING_NEXT_QUESTION) {
            let speakOutput = handlerInput.t('QUESTION_NOT_STARTED_MSG');
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse()
        }

        let questions = await state.getQuestions();
        let users = await state.getUsers();
        let question = questions[(await state.getQuestionNumber()) - 1];
        state.setState(state.STATES.AWAITING_NEXT_QUESTION);
        let speakOutput = `Times up! The answer was ${question.data.answers[question.data.index]}. ${getAnsweredCount(users)} out of ${users.length} players answered and ${getCorrectCount(users)} got it right.`;

        let questionNumber = state.getQuestionNumber();
        if (await questionNumber == questions.length) {
            // End logic

            let winningUser = getWinningUser(users);
            speakOutput += ` There are no more questions and the game is now over. The winner is ${winningUser.data.name} with ${winningUser.data.score} points.`
            // Resets state values
            state.setState(state.STATES.IDLE);
            state.resetUserStatuses();
            state.setOwnerId(null);
            state.setQuestionNumber(0);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
}

function getAnsweredCount(users) {
    let count = 0;
    users.forEach(user => {
        if (user.data.state != state.USER_STATES.NOT_ANSWERED) count++;
    })
    return count;
}

function getCorrectCount(users) {
    let count = 0;
    users.forEach(user => {
        if (user.data.state == state.USER_STATES.CORRECT) count++;
    })
    return count;
}

function getWinningUser(users) {
    let outcome = null;
    let sortedUsers = users.sort((a, b) => b.data.score - a.data.score);
    return (sortedUsers[0] == null) ? outcome : sortedUsers[0];
}

// module.exports = {
//     canHandle(handlerInput) {
//         return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
//         && Alexa.getIntentName(handlerInput.requestEnvelope) === 'EndQuestionIntent';
//     },
//     handle(handlerInput) {
//         if (state.getStatus() == state.STATUSES.IDLE) {
//             let speakOutput = handlerInput.t('NOT_STARTED_YET_MSG');
//             return handlerInput.responseBuilder
//                 .speak(speakOutput)
//                 .reprompt(speakOutput)
//                 .getResponse()
//         }

//         let deviceId = Alexa.getDeviceId(handlerInput.requestEnvelope);
//         if (deviceId != state.getOwnerId()) {
//             let speakOutput = handlerInput.t('NOT_OWNER_MSG');
//             return handlerInput.responseBuilder
//                 .speak(speakOutput)
//                 .reprompt(speakOutput)
//                 .getResponse()
//         }

//         if (state.getStatus() == state.STATUSES.AWAITING_NEXT_QUESTION) {
//             let speakOutput = handlerInput.t('QUESTION_NOT_STARTED_MSG');
//             return handlerInput.responseBuilder
//                 .speak(speakOutput)
//                 .reprompt(speakOutput)
//                 .getResponse()
//         }

//         let questions = data.room[defaultIndex].questions;
//         let question = questions[state.getQuestionNumber() - 1];
//         state.setStatus(state.STATUSES.AWAITING_NEXT_QUESTION);
//         let speakOutput = `Times up! The answer was ${question.answers[question.correctIndex]}.`;

//         if (state.getQuestionNumber() == questions.length) {
//             // End logic

//             let winningUser = getWinningUser(data.room[defaultIndex].users);
//             speakOutput += ` There are no more questions and the game is now over. The winner is ${winningUser.name} with ${winningUser.score} points.`
//             // Resets state values
//             state.setStatus(state.STATUSES.IDLE);
//             state.resetUserStatuses();
//             state.setOwnerId(null);
//             state.setQuestionNumber(0);
//         }

//         return handlerInput.responseBuilder
//             .speak(speakOutput)
//             .reprompt(speakOutput)
//             .getResponse();
//     }
// }

// function getWinningUser(users) {
//     let outcome = null;
//     let sortedUsers = users.sort((a, b) => b.score - a.score);
//     return sortedUsers[0];
// }
