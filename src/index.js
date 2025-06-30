require('dotenv').config();
const { ExpressAdapter } = require('ask-sdk-express-adapter');
const express = require('express');
const Alexa = require('ask-sdk-core');
const {
    StartPranayamaHandler,
    PauseIntentHandler,
    ResumeIntentHandler,
    StopIntentHandler
} = require('./handlers');

const skillBuilder = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        StartPranayamaHandler,
        PauseIntentHandler,
        ResumeIntentHandler,
        StopIntentHandler,
        // Add default handlers
        require('./defaultHandlers')
    )
    .create();

const adapter = new ExpressAdapter(skillBuilder, false, false);

const app = express();
app.post('/', adapter.getRequestHandlers());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Kumbhaka Pranayama skill running on port ${PORT}`);
});