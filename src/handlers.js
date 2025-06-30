const Alexa = require('ask-sdk-core');
const BreathHandler = require('./breathHandler');

const StartPranayamaHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StartPranayamaIntent';
    },
    handle(handlerInput) {
        const duration = handlerInput.requestEnvelope.request.intent.slots.duration.value || 5;
        const breathHandler = new BreathHandler(handlerInput, duration);

        // Store session in attributes for pause/resume
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        attributes.breathHandler = breathHandler;
        handlerInput.attributesManager.setSessionAttributes(attributes);

        return breathHandler.startSession();
    }
};

const PauseIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.PauseIntent';
    },
    handle(handlerInput) {
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        if (!attributes.breathHandler) {
            return handlerInput.responseBuilder
                .speak("There's no active session to pause.")
                .getResponse();
        }
        return attributes.breathHandler.pauseSession();
    }
};

const ResumeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.ResumeIntent';
    },
    handle(handlerInput) {
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        if (!attributes.breathHandler) {
            return handlerInput.responseBuilder
                .speak("There's no session to resume. Say start to begin a new session.")
                .getResponse();
        }
        return attributes.breathHandler.resumeSession();
    }
};

const StopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent');
    },
    handle(handlerInput) {
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        if (!attributes.breathHandler) {
            return handlerInput.responseBuilder
                .speak("There's no active session to stop.")
                .getResponse();
        }
        return attributes.breathHandler.stopSession();
    }
};

module.exports = {
    StartPranayamaHandler,
    PauseIntentHandler,
    ResumeIntentHandler,
    StopIntentHandler
};