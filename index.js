require("dotenv").config();
const helmet = require("helmet");
const express = require("express");
const { WebClient } = require("@slack/web-api");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;
const cron = require('node-cron')

// The bot token from https://api.slack.com/apps/AT4N00UKU/
const token = process.env.SLACK_AUTH_TOKEN;

// Initiating a new bot user with the uth scopes of our app
const web = new WebClient(token);

const venomMembers = [
  'Adam',
  'Alex',
  'Binu',
  'Erick',
  'Harinder',
  'Joy',
  'Lewis',
  'Luke',
  'Manjari',
  'Mark',
  'Mieszko',
  'Ola',
  'Prabhat',
  'Priyanka',
  'Richard',
  'Tomasz'
]

let names = []
let choice

const randomMessage = (choice) => {
  const messages = [
    `With great power comes great responsibility. ${choice} is on standup tomorrow.`,
    `You were the chosen one ${choice}! You were meant to bring balance to the standup!`,
    `${choice} is never late, they lead standup precisely when they mean to.`,
    `Help me, ${choice}. You're my only hope [for leading standup].`,
    `You're a wizard ${choice}. A standup wizard.`,
    `My name is ${choice} Pricus Promotius, commander of the Armies of the North, General of the Felix Legions, loyal servant to the true emperor, Marcus Kellius. And I will lead standup, in this life or the next.`,
    `Standup motherf--er [${choice}], do you lead it?`,
    `Yippi-ki-yay ${choice}! You're on standup!`,
    `The first rule of standup is: you do not talk about standup. The second rule of standup is: ${choice} leads standup.`,
    `Standup, my dear ${choice}.`,
    `Standup, ${choice}. Nothing in the world smells like that. I love the smell of standup in the morning.`,
    `You've got to ask yourself one question: 'Do I feel lucky?' Well, do ya ${choice}?`,
  ]
  return messages[Math.floor(Math.random()*messages.length)]
}

const whosOnStandup = () => {
  // Grab a random member from the venomMembers array
  const randomMember = () => venomMembers[Math.floor(Math.random()*venomMembers.length)]
  
  // Declare choice and assign randomMember to it
  choice = randomMember();
  
  // Loop over the names array, check if the randomMember assigned to choice is already in the array,
  // if it is, rerun the randomMember to select a new member
  while (names.includes(choice) === true) {
    // console.log(`${choice} has been on standup, retrying`)
    choice = randomMember()
  }

  return choice
}

const pushToRotation = () => {
  // Push the chosen member into the names array
  names.push(choice);
  console.log('Names', names)
}

// Once the names array has the same length as the original array,
// it means everyone has done standup once this rotation,
// names will be emptied and a new rotation begins
const emptyArrays = () => {
  if (names.length === venomMembers.length) {
    console.log('Rotation complete, starting a new one!')
    names = [];
  }
}

// Announces the destined-for-standup in the correct channel
const announceRotation = (web, choice) => {
  console.log(`${choice} has been chosen for standup!`)
  web.chat.postMessage({
    text: randomMessage(choice),
    channel: 'C01G3RJJL3Y'
  })
}

// this is the full execution to
const runRoulette = (web) => {
  console.log('Running standup roulette!')
  whosOnStandup()
  pushToRotation(choice)
  emptyArrays()
  announceRotation(web, choice)
  return choice
}

// this makes the function run daily using cron
const cronTrigger = (web) => cron.schedule('1 * * * * MON-FRI', () => {
  runRoulette(web)
})

// call cronTrigger function
cronTrigger(web)

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
  console.log(req.body)
  // If we want to add new slash commands to this bot,
  // we need to extract this logic and place it in
  // it's own function and trigger it when the
  // req.body.command variable returns as "bug"

  // Retreive the text submitted after the slash command
  switch (req.body.command) {
    case '/venom':
      // this triggers the roulette manually in case someone's not around
      runRoulette(web)
      res.send({
        text: `${choice} is on standup tomorrow!`
      })
      break;
      
    default:
      res.send({
        text: `Something has gone wrong!`
      })
      break;
    }
  }
);
