/* *
 * We create a language strings object containing all of our strings.
 * The keys for each string will then be referenced in our code, e.g. handlerInput.t('WELCOME_MSG').
 * The localisation interceptor in index.js will automatically choose the strings
 * that match the request's locale.
 * */

module.exports = {
    en: {
        translation: {
            WELCOME_MSG: 'Hello, welcome to Gamify!',
            HELLO_MSG: 'Hello World!',
            HELP_MSG: 'You can either join a game or start a game!',
            GOODBYE_MSG: 'Goodbye!',
            REFLECTOR_MSG: 'You just triggered {{intentName}}',
            FALLBACK_MSG: 'Sorry, I don\'t know about that. Please try again.',
            ERROR_MSG: 'Sorry, I had trouble doing what you asked. Please try again.',
            ALREADY_STARTED_MSG: 'Sorry, the game has already started.',
            NOT_STARTED_YET_MSG: 'Sorry, the game has not yet started.',
            SESSION_STARTED_MSG: 'Your gamify session has been started.',
            JOINED_MSG: 'Hello {{name}}! You have successfully joined the game.',
            NAME_EXISTS_MSG: 'Sorry, this name already exists.',
            DEVICE_EXISTS_MSG: 'Sorry, your device has already joined the game.',
            QUESTION_ALREADY_STARTED_MSG: 'Sorry, the next question has already been started.',
            QUESTION_NOT_STARTED_MSG: 'Sorry, the next question has not started yet.',
            USER_NOT_JOINED_MSG: 'Sorry, you have not yet joined this game.',
            ALREADY_ANSWERED_MSG: 'Sorry, you have already answered the question.',
            ANSWERED_MSG: 'Good choice! Wait until the leader ends the question to find out if you got it right.',
            NOT_OWNER_MSG: 'Sorry, only the owner of the session can start or end questions.',
            INVALID_ANSWER_MSG: 'Sorry, you specified an invalid answer.',
            NOT_FINISHED_MSG: 'Sorry, the game has not finished yet.',
            USER_RESULT_MSG: 'You finished {{place}} place with {{score}} point{{points_S}}.',
            STOPPED_SESSION_MSG: 'You have successfully stopped this gamify session.'
        }
    },
    // es: {
    //     translation: {
    //         WELCOME_MSG: 'Bienvenido, puedes decir Hola o Ayuda. Cual prefieres?',
    //         HELLO_MSG: 'Hola Mundo!',
    //         HELP_MSG: 'Puedes decirme hola. Cómo te puedo ayudar?',
    //         GOODBYE_MSG: 'Hasta luego!',
    //         REFLECTOR_MSG: 'Acabas de activar {{intentName}}',
    //         FALLBACK_MSG: 'Lo siento, no se nada sobre eso. Por favor inténtalo otra vez.',
    //         ERROR_MSG: 'Lo siento, ha habido un error. Por favor inténtalo otra vez.'
    //     }
    // },
    // de: {
    //     translation: {
    //         WELCOME_MSG: 'Wilkommen, du kannst Hallo oder Hilfe sagen. Was würdest du gern tun?',
    //         HELLO_MSG: 'Hallo!',
    //         HELP_MSG: 'Du kannst hallo zu mir sagen. Wie kann ich dir helfen?',
    //         GOODBYE_MSG: 'Tschüss!',
    //         REFLECTOR_MSG: 'Du hast gerade {{intentName}} ausgelöst',
    //         FALLBACK_MSG: 'Es tut mir leid, ich weiss das nicht. Bitte versuche es erneut.',
    //         ERROR_MSG: 'Es tut mir leid, ich konnte das nicht machen. Bitte versuche es erneut.'
    //     }
    // },
    // ja: {
    //     translation: {
    //         WELCOME_MSG: 'ようこそ。こんにちは、または、ヘルプ、と言ってみてください。どうぞ！',
    //         HELLO_MSG: 'ハローワールド',
    //         HELP_MSG: 'こんにちは、と言ってみてください。どうぞ！',
    //         GOODBYE_MSG: 'さようなら',
    //         REFLECTOR_MSG: '{{intentName}}がトリガーされました。',
    //         FALLBACK_MSG: 'ごめんなさい。ちょっとよくわかりませんでした。もう一度言ってみてください。',
    //         ERROR_MSG: 'ごめんなさい。なんだかうまく行かないようです。もう一度言ってみてください。'
    //     }
    // },
    // fr: {
    //     translation: {
    //         WELCOME_MSG: 'Bienvenue sur le génie des salutations, dites-moi bonjour et je vous répondrai',
    //         HELLO_MSG: 'Bonjour à tous!',
    //         HELP_MSG: 'Dites-moi bonjour et je vous répondrai!',
    //         GOODBYE_MSG: 'Au revoir!',
    //         REFLECTOR_MSG: 'Vous avez invoqué l\'intention {{intentName}}',
    //         FALLBACK_MSG: 'Désolé, je ne sais pas. Pouvez-vous reformuler?',
    //         ERROR_MSG: 'Désolé, je n\'ai pas compris. Pouvez-vous reformuler?'
    //     }
    // },
    // it: {
    //     translation: {
    //         WELCOME_MSG: 'Buongiorno! Puoi salutarmi con un ciao, o chiedermi aiuto. Cosa preferisci fare?',
    //         HELLO_MSG: 'Ciao!',
    //         HELP_MSG: 'Dimmi ciao e io ti risponderò! Come posso aiutarti?',
    //         GOODBYE_MSG: 'A presto!',
    //         REFLECTOR_MSG: 'Hai invocato l\'intento {{intentName}}',
    //         FALLBACK_MSG: 'Perdonami, penso di non aver capito bene. Riprova.',
    //         ERROR_MSG: 'Scusa, c\'è stato un errore. Riprova.'
    //     }
    // },
    // pt: {
    //     translation: {
    //         WELCOME_MSG: 'Bem vindo, você pode dizer Olá ou Ajuda. Qual você gostaria de fazer?',
    //         HELLO_MSG: 'Olá!',
    //         HELP_MSG: 'Você pode dizer olá para mim. Como posso te ajudar?',
    //         GOODBYE_MSG: 'Tchau!',
    //         REFLECTOR_MSG: 'Você acabou de ativar {{intentName}}',
    //         FALLBACK_MSG: 'Desculpe, não sei o que dizer. Por favor tente novamente.',
    //         ERROR_MSG: 'Desculpe, não consegui fazer o que você pediu. Por favor tente novamente.'
    //     }
    // },
    // hi: {
    //     translation: {
    //         WELCOME_MSG: 'नमस्ते, आप hello या help कह सकते हैं. आप क्या करना चाहेंगे?',
    //         HELLO_MSG: 'नमस्ते दुनिया ',
    //         HELP_MSG: 'आप मुझसे hello बोल सकते हो.',
    //         GOODBYE_MSG: 'अलविदा ',
    //         REFLECTOR_MSG: 'आपने {{intentName}} trigger किया हैं ',
    //         FALLBACK_MSG: 'Sorry, मैं वो समझ नहीं पायी. क्या आप दोहरा सकते हैं ',
    //         ERROR_MSG: 'Sorry, मैं वो समझ नहीं पायी. क्या आप दोहरा सकते हैं '
    //     }
    // }
}