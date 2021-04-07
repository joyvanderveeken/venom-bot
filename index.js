require("dotenv").config();
const helmet = require("helmet");
const express = require("express");
const { WebClient } = require("@slack/web-api");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;
const cron = require("node-cron");

// The bot token from https://api.slack.com/apps/A01FXJF9AKA/
const token = process.env.SLACK_AUTH_TOKEN;

// Initiating a new bot user with the auth scopes of our app
const web = new WebClient(token);

// send a message to a channel and to the person who last pushed to the pipeline
const venomPipelineState = (userId, slackId, status, stagename) => {
  status = 'Failed'
  stagename = 'Acceptance'
  
  const succeedMessage = `your most recent merge to master has successfully passed ${stagename}!`
  const failedMessage = `your most recent merge to master has not passed ${stagename}. Could you please have a look as soon as possible?`

  status === 'Succeeded' ? message = succeedMessage : message = failedMessage

  console.log('Broadcasting pipeline state to specified channel.')

  web.chat.postMessage({
    text: `Hey <@UT2V73HJ5>, ${message}`,
    channel: 'D01F4LKM8MB'
  })
}

app.listen(process.env.PORT || PORT, () => {
  console.log(
    "Bot is listening on port " +
      PORT +
      " and running in " +
      process.env.NODE_ENV +
      " mode."
  );
});

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post("/", (req, res) => {
  console.log(req.body);
  // If we want to add new slash commands to this bot,
  // we need to extract this logic and place it in
  // it's own function and trigger it when the
  // req.body.command variable returns as "bug"

  // Retrieve the text submitted after the slash command
  switch (req.body.command) {
    case `/venomroulette`:
      // this triggers the roulette manually in case someone's not around
      runRoulette(web);
      res.send({
        text: `${choice} is on standup tomorrow!`,
      });
      break;
    case `/venomstate`:
      venomPipelineState();
      break;
    // case `/venom timeout ${memberName} ${numberOfDays}`:
    //   res.send({
    //     text: `${memberName} has been removed from rotation for ${numberOfDays} days.`,
    //   });
    //   break;
    default:
      res.send({
        text: `Something has gone wrong!`,
      });
      break;
  }
});
