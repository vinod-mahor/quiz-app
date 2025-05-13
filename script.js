import questions from './questions.js'

// represent questions number
let currentQuestionIndex = 0;
let totalCorrect = 0;
let totalWrong = 0;
const optionNum = ["A", "B", "C", "D"]; // this is an array of question options
const userAnswer = []; // this is an array of user answers
const userClickedAnsIdx = []; // this will store the index of question number and the selected option
const originalAns = []; // this array will store the original anwer of the questions
const correctAnswer = []; // this array will store the correct answer of the questions
const questionNum = document.querySelector(".question-details");// this target the question number
let isUserChoosedAns = false;

const questionName = document.querySelector("p");// this will target the question text
const questionOptions = document.querySelectorAll(".option");// this is an array of question options
const nextBtn = document.querySelector("#next-btn");// this will target the next button
const prevBtn = document.querySelector("#prev-btn");// this will target the prev button
const okBtn = document.querySelector("#checkAns");// this will target the ok button
const quizBox = document.querySelector(".quiz-box");// this will target the quiz box
const resultBox = document.querySelector(".result-box");// this will target the quiz box
const restartBtn = document.querySelector(".restart-btn");// this will target the restart button
const startBtn = document.querySelector("#start-btn");// this will target the start button
const startBox = document.querySelector(".start-box");
const startPara = document.querySelector(".start-para > h5");
console.log(startPara)
let startTime = 0;
let endTime = 0;

function totalCorrectAndIncorrect() {
    for (let i = 0; i < correctAnswer.length; i++) {
        if (correctAnswer[i]) {
            totalCorrect++;
        }
        if (correctAnswer[i]) {
            totalWrong++;
        }
    }
}

function setQuestion() {
    let currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;
    questionNum.innerHTML = `${currentQuestionIndex + 1}/${totalQuestions}`;
    questionName.innerHTML = currentQuestion.question;

    // Always reset next button to disabled
    setDisable("next");
    setDisable("ok");

    // Enable prev button if not the first question
    if (currentQuestionIndex > 0) {
        setEnable("prev");
    } else {
        setDisable("prev");
    }

    for (let i = 0; i < currentQuestion.options.length; i++) {
        questionOptions[i].innerHTML = `${optionNum[i]}.  ` + currentQuestion.options[i];
    }
    if (userClickedAnsIdx[currentQuestionIndex] !== undefined) {
        setEnable("ok");
    }
    // ✅ Check if this question was already answered
    if (userClickedAnsIdx[currentQuestionIndex] !== undefined) {
        setEnable("next");
        if (currentQuestionIndex + 1 == questions.length) {
            setDisable("next");
        }
    }
}


function showResult() {
    checkAnswer();
    totalCorrectAndIncorrect();// this fuction will count correct and incorrect ans
    endTime = performance.now();// this will store the current time
    let timerInSecond = Math.floor((endTime - startTime) / 1000);// time taken in seconds
    let timeInMinute = Math.floor(timerInSecond / 60);// time taken in minutes
    let timeInHours = Math.floor(timeInMinute / 60);// time taken in hours
    const tableBody = document.querySelector("tbody");

    tableBody.innerHTML = "";
    for (let i = 0; i < questions.length; i++) {
        let questionColor = correctAnswer[i];// this gives true or false
        let setColor = "black"
        if (questionColor) {
            setColor = "green"
        } else {
            setColor = "red";
        }
        const tableRow = document.createElement("tr");
        tableRow.setAttribute("scope", "row");
        tableRow.innerHTML = `
                    <td class="result-s">${i + 1}</td>
                    <td class="result-q" style="color:${setColor};">${questions[i].question}</td>
                    <td class="result-ua" style="color:${setColor};">${userAnswer[i]}</td>
                    <td class="result-oa">${originalAns[i]}</td>`;
        tableBody.appendChild(tableRow);
    }

    quizBox.style.display = "none";
    resultBox.style.display = "block";

    document.querySelector(".user-score").innerHTML = `${totalCorrect}/${questions.length}`;
    document.querySelector(".user-accuracy").innerHTML = Math.floor((totalCorrect / questions.length) * 100) + "%";
    if (timeInHours > 0) {
        document.querySelector(".user-time").innerHTML = `${timeInHours} hours ${timeInMinute % 60} minutes ${timerInSecond % 60} seconds`;
    }
    else if (timeInMinute > 0) {
        document.querySelector(".user-time").innerHTML = `${timeInMinute % 60} minutes ${timerInSecond % 60} seconds`;
    }
    else if (timerInSecond > 0) {
        document.querySelector(".user-time").innerHTML = `${timerInSecond % 60} seconds`;
    }
}




function checkAnswer() {
    for (let i = 0; i < questions.length; i++) {
        if (userAnswer[i] == questions[i].answer) {
            correctAnswer[i] = true;
        }
        else {
            correctAnswer[i] = false;
        }

    }
}

function showCheckedOptionColor(currentQuestionIndex) {
    for (let k = 0; k < questionOptions.length; k++) {
        questionOptions[k].classList.remove("active");
    };
    if (userClickedAnsIdx[currentQuestionIndex] != undefined) {
        questionOptions[userClickedAnsIdx[currentQuestionIndex]].classList.add("active");
    }
}
//this function will enabbe and disable the next and previous button
function setDisable(btnName) {
    if (btnName == "next") {
        nextBtn.classList.add("disabled");
    }
    if (btnName == "prev") {
        prevBtn.classList.add("disabled");
    }
    if (btnName == "ok") {
        okBtn.classList.add("disabled");
    }
}
function setEnable(btnName) {
    if (btnName == "next") {
        nextBtn.classList.remove("disabled");
    }
    if (btnName == "prev") {
        prevBtn.classList.remove("disabled");
    }
    if (btnName == "ok") {
        okBtn.classList.remove("disabled");
    }
}



// jump to next question
function setNextQuestion() {
    if (questions.length > currentQuestionIndex + 1) {
        currentQuestionIndex++;
        showCheckedOptionColor(currentQuestionIndex);
    }
    setQuestion();
}

// jump to previous question
function setPrevQuestion() {
    if (currentQuestionIndex + 1 > 1) {
        currentQuestionIndex--;
        showCheckedOptionColor(currentQuestionIndex);
    }
    setQuestion();
}
// this will the set the question number in the start paragagraph
startPara.innerHTML = `In this quiz you have to answer ${questions.length} question related to general knowledge.`
// this will collect the right answer from the obj
for (let i = 0; i < questions.length; i++) {
    originalAns.push(questions[i].answer);

}




for (let i = 0; i < questionOptions.length; i++) {
    questionOptions[i].addEventListener("click", function (e) {
        let selectedOption = e.target.innerText.split(".");
        const realSelcedOption = selectedOption[1].trim() // this will get the selected option
        userAnswer[currentQuestionIndex] = realSelcedOption;// here we store the selected option value
        // ✅ Enable next button after selecting an option
        if (currentQuestionIndex + 1 < questions.length) {
            setEnable("next");
            // Enable OK button if it's the last question
            // console.log(currentQuestionIndex+1,questions.length)
            if (currentQuestionIndex + 1 >= questions.length) {
                setDisable("next");

            }
        }
        if (currentQuestionIndex + 1 >= questions.length) {
            setEnable("ok");
        }
        // here i is the index of the option
        userClickedAnsIdx[currentQuestionIndex] = i; // here we store the index of the selected option
        showCheckedOptionColor(currentQuestionIndex);

    });

}


showCheckedOptionColor(currentQuestionIndex);
setQuestion();
okBtn.onclick = showResult;
restartBtn.onclick = function () {
    window.location.reload();
};
nextBtn.onclick = setNextQuestion;
prevBtn.onclick = setPrevQuestion;
startBtn.onclick = function () {
    quizBox.style.display = "block";
    startBox.style.display = "none";
    startTime = performance.now();
    setQuestion();
}
