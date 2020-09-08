// Set variables for page elements (local except for highscoreDiv)
var highscoreDiv = document.querySelector("#highscore");
let gameTimerEl = document.querySelector("#gameTimer");
let quesTimerEl = document.querySelector("#quesTimer");
let mainEl = document.querySelector("#details");
let secEl = document.querySelector("#playTime");
let timerTab = document.querySelector("#timers");

// Set the global variables 
var score = 0;
var quiz = {};
var quizType = "";

var gameDuration = 0;
var gameSecElapsed = 0;
var gameInterval;

var questionDuration = 15;
var questionSecElapsed = 0;
var questionInterval;

// Function call to start building the Instructions and Play-Time containers
init();

// Function to display instructions
function init() {
    clearMainDetails();
    reset();

    // Creates the heading element for main page
    let heading = document.createElement("p");
    heading.setAttribute("id", "main-heading");
    heading.textContent = "Let's test out your JavaScript Fundamentals!";

    // Creates element with the instructions for the game
    let instructions = document.createElement("p");
    instructions.setAttribute("id", "instructions");
    instructions.textContent = "You will have 5 seconds to answer each question. If you answer correctly you will score points. The quicker you answer the more points you will score. If you score incorrectly you will not lose points, but you will be penalized time.";

    // Creates button to start the game
    let startJsQuiz = document.createElement("button");
    startJsQuiz.setAttribute("id", "startJSQuiz");
    startJsQuiz.setAttribute("class", "btn btn-primary");
    startJsQuiz.textContent = "Start the Quiz";

    // place the heading info, instructions, and play button on the screen
    mainEl.appendChild(heading);
    mainEl.appendChild(instructions);
    mainEl.appendChild(startJsQuiz);

    startJsQuiz.addEventListener("click", function () {
        playQuiz(jsQuestions);
    });
}

// Function to clear PlayTime element of all children
function clearSecDetails() {
    secEl.innerHTML = "";
}

// Function to clear Instructions element of all children
function clearMainDetails() {
    mainEl.innerHTML = "";
}

// Clear out the previous score and reset all the game timers
function reset() {
    score = 0;

    gameDuration = 0;
    gameSecElapsed = 0;
    gameInterval;

    questionDuration = 15;
    questionSecElapsed = 0;
    questionInterval;
}

//start game
function playQuiz(questionSet) {
    // select quiz randomize questions
    quiz = setUpQuestions(questionSet);  // _______________________________ THIS DOESN'T WORK YET ___________________

    // Reveal the timers
    timerTab.setAttribute("style", "visibility: visible;");

    // Start timer and give it a time based upon the number of questions in questions.js
    gameDuration = quiz.length * 20;

    startGameTimer();
    renderTime();

    //Go to the first question
    presentQuestion();
}

// function to pull random question out of array
function setUpQuestions(list) {   // ___________________ ERROR: CURRENTLY THIS IS ONLY BEING CALLED ONCE ____________________

    let randomQuestion = [];
    for (let i = 0; i < list.length; i++) {
        randomQuestion.push(list[i]);

    }
    alert("here it is!")
    return randomQuestion;
}

// _________________________  PRESENT QUESTION _________________________
function presentQuestion() {

    questionSecElapsed = 0;  // reset timer

    if (quiz.length === 0) {  // if no more question, then end the game
        endOfGame();
        return;
    }

    //sets current object (curQuestion) by pulling it out of reduced Quiz array leaving the remaining questions in the array
    curQuestion = quiz.pop();


    clearSecDetails(); // clear out any previous info/details in the GamePlay container

    // add question to screen
    //build out display for new item
    let question = document.createElement("h3");
    // adds data value
    question.setAttribute("question", curQuestion.title);
    question.textContent = curQuestion.title;
    secEl.appendChild(question)

    // create list as container to listen for answers
    let choiceBox = document.createElement("ul");
    choiceBox.setAttribute("id", "choiceBox");
    secEl.appendChild(choiceBox);

    //adds answers to screen
    for (let i = 0; i < curQuestion.choices.length; i++) {
        // creates variable for each choice item
        let listChoice = document.createElement("li");
        // adds data value
        listChoice.setAttribute("choice-value", curQuestion.choices[i]);
        listChoice.setAttribute("id", "questionNum-" + i);
        listChoice.textContent = curQuestion.choices[i];
        //add choice to page
        choiceBox.appendChild(listChoice)
    }

    // get answer from user
    choiceBox.addEventListener("click", function () {
        scoreAnswer(curQuestion);
    });
}

function scoreAnswer(cur) {

    // 
    var e = event.target;
    if (e.matches("li")) {
        let selectedItem = e.textContent;
        if (selectedItem === cur.answer) {
            score += questionDuration - questionSecElapsed;
        } else {
            //penalty for being wrong
            gameDuration -= 10;
        }
        showAnswers(cur);
    }
}

function showAnswers(cur) {

    for (let i = 0; i < cur.choices.length; i++) {

        let questid = "#questionNum-" + i;
        let questrow = document.querySelector(questid);

        if (cur.choices[i] !== cur.answer) {
            // Wrong Answer Highlight Color
            questrow.setAttribute("style", "background-color: #e07a5f");
        } else {
            // Right Answer Highlight Color
            questrow.setAttribute("style", "background-color: #d2e9af");
        }
    }
    // pause so user can see results
    setTimeout(presentQuestion, 2000);
}

// function to set time for game timer
function setGameTime() {

    clearInterval(gameInterval);
    gameSeconds = gameDuration;
}


function renderTime() {
    gameTimerEl.textContent = gameDuration - gameSecElapsed;
    quesTimerEl.textContent = questionDuration - questionSecElapsed;

    if ((questionDuration - questionSecElapsed) < 1) {
        // game penalty for letting timer run out
        gameDuration -= 10;
        presentQuestion();
    }

    if ((gameDuration - gameSecElapsed) < 1) {
        endOfGame();
    }
}

function startGameTimer() {
    setGameTime();

    gameInterval = setInterval(function () {
        gameSecElapsed++;
        questionSecElapsed++;
        renderTime();
    }, 1000);
}

function stopTime() {
    gameSeconds = 0;
    questionSeconds = 0;
    clearInterval(gameInterval);
}

// function of end of game
function endOfGame() {
    stopTime();
    clearSecDetails();
    clearMainDetails();

    timerTab.setAttribute("style", "visibility: hidden;");

    let heading = document.createElement("p");
    heading.setAttribute("id", "main-heading");
    heading.textContent = "GAME OVER - I hope you have enjoyed this";

    // creates elements with the instructions for the game
    let instructions = document.createElement("p");
    instructions.setAttribute("id", "instructions");
    instructions.textContent = " Your score is " + score;

    // creates input for user to add initials
    let par = document.createElement("p");

    let initialsLabel = document.createElement("label");
    initialsLabel.setAttribute("for", "userInitials");
    initialsLabel.textContent = "Enter Initials:   ";

    let initialsInput = document.createElement("input");
    initialsInput.setAttribute("id", "userInitials");
    initialsInput.setAttribute("name", "userInitials");
    initialsInput.setAttribute("minlength", "3");
    initialsInput.setAttribute("maxlength", "3");
    initialsInput.setAttribute("size", "3");

    // creates button to RESTART the game
    let playAgain = document.createElement("button");
    playAgain.setAttribute("id", "playAgain");
    playAgain.setAttribute("class", "btn btn-success");
    playAgain.textContent = "Play Again!";

    secEl.appendChild(heading);
    secEl.appendChild(instructions);
    secEl.appendChild(initialsLabel);
    secEl.appendChild(initialsInput);
    secEl.appendChild(par);
    secEl.appendChild(playAgain);

    playAgain.addEventListener("click", reload);

    initialsInput.addEventListener("input", function () {
        initialsInput.value = initialsInput.value.toUpperCase();
        if (initialsInput.value.length === 3) {

            //create object for this score
            let thisScore = [{ type: quizType, name: initialsInput.value, score: score }];

            //get highscores from memory
            let storedScores = JSON.parse(localStorage.getItem("highScores"));

            if (storedScores !== null) {
                storedScores.push(thisScore[0]);
            } else {
                storedScores = thisScore;
            }

            localStorage.setItem("highScores", JSON.stringify(storedScores));
            highScores();
        }
    });
}

function reload() {
    location.reload();
}

function highScores() {
    stopTime();
    var myobj = document.getElementById("details");
    myobj.remove();

    timerTab.setAttribute("style", "visibility: hidden;");

    //get scores from storage
    let storedScores = JSON.parse(localStorage.getItem("highScores"));

    // draw heading
    let heading = document.createElement("h2");
    heading.setAttribute("id", "main-heading");
    heading.textContent = "Top 5 High Scores";

    secEl.appendChild(heading);

    // Render a new li for each score
    if (storedScores !== null) {
        // sort scores
        storedScores.sort((a, b) => (b.score - a.score));

        // sets the number of scores to display to 5 or the number of games played. Which ever is less
        let numScores2Display = 5;
        if (storedScores.length < 5) {
            numScores2Display = storedScores.length;
        }

        for (var i = 0; i < numScores2Display; i++) {
            var s = storedScores[i];

            var p = document.createElement("p");
            p.textContent = s.name + " " + s.score;
            secEl.appendChild(p);
        }
    } else {
        var p = document.createElement("p");
        p.textContent = "Your Initials Here!"
        secEl.appendChild(p);
    }


    // creates button to RESTART the game
    let playAgain = document.createElement("button");
    playAgain.setAttribute("id", "playAgain");
    playAgain.setAttribute("class", "btn btn-primary");
    playAgain.textContent = "Play Again!";

    secEl.appendChild(playAgain);

    playAgain.addEventListener("click", reload);
}

highscoreDiv.addEventListener("click", highScores);