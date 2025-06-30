const Alexa = require('ask-sdk-core');

class BreathHandler {
    constructor(handlerInput, duration = 5) {
        this.handlerInput = handlerInput;
        this.duration = duration * 60; // Convert minutes to seconds
        this.breathPattern = {
            inhale: 4,
            hold: 6,
            exhale: 4
        };
        this.currentPhase = 'inhale';
        this.remainingTime = this.duration;
    }

    async startSession() {
        await this.guidePhase(this.currentPhase);
        return this.handlerInput.responseBuilder
            .speak(`Starting Kumbhaka Pranayama. Inhale for ${this.breathPattern.inhale} seconds, hold for ${this.breathPattern.hold} seconds, exhale for ${this.breathPattern.exhale} seconds. Let's begin.`)
            .reprompt('Would you like to pause or stop the session?')
            .getResponse();
    }

    async guidePhase(phase) {
        const phaseInstructions = {
            inhale: `Inhale deeply... for ${this.breathPattern.inhale} seconds`,
            hold: `Hold your breath... for ${this.breathPattern.hold} seconds`,
            exhale: `Exhale slowly... for ${this.breathPattern.exhale} seconds`
        };

        // In a real implementation, you would use Alexa's Progressive Response API
        // or track state with a database for longer sessions
        console.log(phaseInstructions[phase]);

        // Rotate through phases
        this.currentPhase =
            phase === 'inhale' ? 'hold' :
                phase === 'hold' ? 'exhale' : 'inhale';

        this.remainingTime -=
            phase === 'inhale' ? this.breathPattern.inhale :
                phase === 'hold' ? this.breathPattern.hold : this.breathPattern.exhale;
    }

    async pauseSession() {
        return this.handlerInput.responseBuilder
            .speak('Pausing your Kumbhaka Pranayama session. Say resume to continue.')
            .getResponse();
    }

    async resumeSession() {
        await this.guidePhase(this.currentPhase);
        return this.handlerInput.responseBuilder
            .speak('Resuming your session. ' +
                (this.currentPhase === 'inhale' ? 'Inhale...' :
                    this.currentPhase === 'hold' ? 'Hold...' : 'Exhale...'))
            .reprompt('Continue your practice or say stop to end.')
            .getResponse();
    }

    async stopSession() {
        return this.handlerInput.responseBuilder
            .speak('Ending your Kumbhaka Pranayama session. Well done!')
            .withShouldEndSession(true)
            .getResponse();
    }
}

module.exports = BreathHandler;