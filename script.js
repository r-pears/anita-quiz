const url = "https://opentdb.com/api.php?amount=10";
let currentQuestionIdx = 0;
let finalScore = 0;
let response;
// random comment for git
async function fetchQuestion(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    fetchedData = await response.json();
    console.log(fetchedData);
    return fetchedData;
  } catch (error) {
    console.error(error.message);
  }
}
playGame();
function playGame() {
  fetchQuestion(url).then((fetchedData) => {
    response = fetchedData;
    let optionsList = document.getElementById("options_list");
    let nextButton = document.getElementById("nextBtn");

    nextButton.disabled = true;
    optionsList.addEventListener("click", (e) => {
      if (e.target.nodeName == "LI") {
        let popUp = document.getElementById("notification");
        nextButton.disabled = false;
        if (e.target.getAttribute("data-correct") === "true") {
          setGreenNotification();
          function setGreenNotification() {
            popUp.innerHTML = "Your answer is correct";
            popUp.style.background = "green";
            popUp.style.visibility = "visible";
            document.querySelectorAll(".circle")[
              currentQuestionIdx
            ].style.background = "green";
            finalScore++;
          }
        } else {
          setRedNotification();
          function setRedNotification() {
            popUp.innerHTML = "Your answer is incorrect";
            popUp.style.background = "red";
            popUp.style.visibility = "visible";
            document.querySelectorAll(".circle")[
              currentQuestionIdx
            ].style.background = "red";
            //finalScore = finalScore + 0;
          }
        }
        document.querySelector(".scoreNumber").innerHTML = `${finalScore}/10`;
        document
          .querySelectorAll(".option")
          .forEach((el) => el.classList.add("disabled"));
        if (currentQuestionIdx == 9) {
          document.querySelector(
            ".gameContainer"
          ).innerHTML = `<div id="final_msg">Your final score is ${finalScore}/10</div>
      <button id="restart_btn">Restart game</button>`;
          document
            .getElementById("restart_btn")
            .addEventListener("click", () => {
              location.reload();
            });
        }
      }
    });
    renderCurrentQuestion(fetchedData);
  });

  function renderCurrentQuestion(fetchedData) {
    let currentQuestionObj = fetchedData.results[currentQuestionIdx];
    let nextButton = document.getElementById("nextBtn");
    nextButton.disabled = true;

    document.querySelector(".questionContainer").innerHTML =
      currentQuestionObj.question;
    let incorrectAnswers = [...currentQuestionObj.incorrect_answers];
    let correctAnswer = currentQuestionObj.correct_answer;
    let randomIndex = Math.floor(Math.random() * 4);
    incorrectAnswers.splice(randomIndex, 0, correctAnswer);
    let options = document.getElementsByClassName("option");
    for (let i = 0; i < incorrectAnswers.length; i++) {
      options[i].innerHTML = incorrectAnswers[i];
      options[i].setAttribute(
        "data-correct",
        incorrectAnswers[i] === correctAnswer
      );
    }
  }
  document.getElementById("nextBtn").addEventListener("click", () => {
    if (!document.querySelector(".option.disabled")) return;
    currentQuestionIdx++;
    renderCurrentQuestion(response);
    let popUp = document.getElementById("notification");
    popUp.style.visibility = "hidden";
    document
      .querySelectorAll(".option")
      .forEach((el) => el.classList.remove("disabled"));
  });
}
