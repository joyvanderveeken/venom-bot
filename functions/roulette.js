
const venomMembers = [
  "Adam",
  "Alex",
  "Binu",
  "Erick",
  "Harinder",
  "Joy",
  "Lewis",
  "Luke",
  "Manjari",
  "Mark",
  "Mieszko",
  "Ola",
  "Prabhat",
  "Priyanka",
  "Richard",
  "Tomasz",
];

let names = [];
let choice;
// let numberOfDays;
// let memberName;
// let rouletteIterations = 0;

const randomMessage = (choice) => {
  const messages = [
    `With great power comes great responsibility. ${choice} is on standup tomorrow.`,
    `You were the chosen one ${choice}! You were meant to bring balance to the standup!`,
    `${choice} is never late, they lead standup precisely when they mean to.`,
    `Help me, ${choice}. You're my only hope [for leading standup].`,
    `You're a wizard, ${choice}. A standup wizard.`,
    `My name is ${choice} Pricus Promotius, commander of the Armies of the North, General of the Felix Legions, loyal servant to the true emperor, Marcus Kellius. And I will lead standup, in this life or the next (day).`,
    `Standup motherf--er [${choice}], do you lead it!?`,
    `Yippi-ki-yay ${choice}! You're on standup!`,
    `The first rule of standup is: you do not talk about standup. The second rule of standup is: ${choice} leads standup.`,
    `Standup, my dear ${choice}.`,
    `Standup, ${choice}. Nothing in the world smells like that. I love the smell of standup in the morning.`,
    `You've got to ask yourself one question: 'Do I feel lucky?' Well, do ya ${choice}? Because you're on standup.`,
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

const whosOnStandup = () => {
  // Grab a random member from the venomMembers array
  const randomMember = () =>
    venomMembers[Math.floor(Math.random() * venomMembers.length)];

  // Declare choice and assign randomMember to it
  choice = randomMember();

  // Loop over the names array, check if the randomMember assigned to choice is already in the array,
  // if it is, rerun the randomMember to select a new member
  while (names.includes(choice) === true) {
    // console.log(`${choice} has been on standup, retrying`)
    choice = randomMember();
  }
  return choice;
};

const pushToRotation = (choice) => {
  // Push the chosen member into the names array
  names.push(choice);
  console.log("Names", names);
};

// function to remove a member from rotation for x amount of days
// const giveTimeout = (memberName: string, numberOfDays: number) => {
//   const currentIteration = rouletteIterations;
//   const indexOfMember = venomMembers.indexOf(memberName);
//   const memberOnTimeout = venomMembers.splice(indexOfMember, 1);

//   const returnMember = () => venomMembers.push(memberOnTimeout[0]);
// };

// Once the names array has the same length as the original array,
// it means everyone has done standup once this rotation,
// names will be emptied and a new rotation begins
const emptyArrays = () => {
  if (names.length === venomMembers.length) {
    console.log("Rotation complete, starting a new one!");
    names = [];
  }
};

// Announces the destined-for-standup in the correct channel
const announceRotation = (web, choice) => {
  console.log(`${choice} has been chosen for standup!`);
  web.chat.postMessage({
    text: randomMessage(choice),
    channel: "C01G3RJJL3Y",
  });
};

// this is the full execution to run the roulette
const runRoulette = (web) => {
  console.log("Running standup roulette!");
  whosOnStandup();
  pushToRotation(choice);
  emptyArrays();
  announceRotation(web, choice);
  rouletteIterations++;
  return choice;
};

// this makes the function run daily (weekdays) using cron
const cronRouletteTrigger = (web) =>
  cron.schedule("0 30 9 * * MON-FRI", () => {
    runRoulette(web);
  });

// it's friday
const itsFridayYeah = (web) =>
  cron.schedule("0 0 16 * * FRI", () => {
    web.chat.postMessage({
      text: `https://www.youtube.com/watch?v=4z95SAFud7w`,
      channel: "C01G3RJJL3Y",
    });
  });

// call cronTrigger function
cronRouletteTrigger(web);
itsFridayYeah(web);
