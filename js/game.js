const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswer = true;
let score = 0;
let questionCounter = 0;
let availableQuestion = [];

let questions = [];

fetch('https://opentdb.com/api.php?amount=10')
    .then(res => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        startGame();
    });

    /*.catch((err) =>{
        console.log(err);
    });*/

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestion = [...questions];
    console.log(availableQuestion);
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    if (availableQuestion.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem("mostRecentScore", score);
        //go to the end page
        return window.location.assign('../html/end.html');
    }

    questionCounter++;
    progressText.innerText =  `Question ${questionCounter}/${MAX_QUESTIONS}`;

    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestion.length);
    currentQuestion = availableQuestion[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice =>{
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion["choice" + number]
    });

    availableQuestion.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener("click", (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

        if (classToApply === "correct") {
            incrementScore(CORRECT_BONUS);
        }    
        
        selectedChoice.classList.add(classToApply);
        
        setTimeout(() => {
            selectedChoice.classList.remove(classToApply);
            getNewQuestion();
        }, 1000); 
    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};