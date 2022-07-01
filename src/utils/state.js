const DEFAULT_CODE = require('../config/config.json').defaultCode;
const services = require('../config/services');

module.exports.STATES = {
    QUESTION_IN_PROGRESS: "QUESTION_IN_PROGRESS",
    AWAITING_NEXT_QUESTION: "AWAITING_NEXT_QUESTION",
    IDLE: "IDLE"
}

module.exports.USER_STATES = {
    NOT_ANSWERED: "NOT_ANSWERED",
    INCORRECT: "INCORRECT",
    CORRECT: "CORRECT"
}

module.exports.getState = async () =>  {
    let room = await services.serviceFunctions.getRoomFromCode(DEFAULT_CODE);
    return room.data.state;
};
module.exports.setState = async (newState) => {
    await services.serviceFunctions.setState(DEFAULT_CODE, newState);
}

module.exports.getQuestions = async () => {
    let questions = await services.serviceFunctions.getQuestionsFromCode(DEFAULT_CODE);
    return questions;
};

module.exports.getUsers = async () => {
    let users = await services.serviceFunctions.getUsersFromCode(DEFAULT_CODE);
    return users;
};

module.exports.getQuestionNumber = async () => {
    let room = await services.serviceFunctions.getRoomFromCode(DEFAULT_CODE);
    return room.data.questionNumber;
};
module.exports.setQuestionNumber = async (newQuestionNumber) => {
    await services.serviceFunctions.setQuestionNumber(DEFAULT_CODE, newQuestionNumber);
}
module.exports.nextQuestion = async () => {
    await services.serviceFunctions.incrementQuestionNumber(DEFAULT_CODE);
}

module.exports.getUserState = async (deviceId) => {
    let user = await services.serviceFunctions.getUser(DEFAULT_CODE, deviceId);
    return user == null ? null : user.data.state;
}
module.exports.setUserState = async (deviceId, newState) => {
    await services.serviceFunctions.setUserState(DEFAULT_CODE, deviceId, newState)
}
// TODO: implement this
module.exports.resetUserStatuses = async () => {
    await services.serviceFunctions.setUserStates(DEFAULT_CODE, this.USER_STATES.NOT_ANSWERED);
}

module.exports.getOwnerId = async () => {
    let room = await services.serviceFunctions.getRoomFromCode(DEFAULT_CODE);
    return room.data.ownerId;
};
module.exports.setOwnerId = async (ownerId) => {
    await services.serviceFunctions.setOwnerId(DEFAULT_CODE, ownerId);
}