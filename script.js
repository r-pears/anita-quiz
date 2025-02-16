// can hardcode the url in the fetchQuestion function, or if its declared here should be in capital letters
const URL = "https://opentdb.com/api.php?amount=10";
let currentQuestionIdx = 0;
let finalScore = 0;
let response;
async function fetchQuestion(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    fetchedData = await response.json();
    // remove the console.log from production code
    return fetchedData;
  } catch (error) {
    console.error(error.message);
  }
}
playGame();
function playGame() {
  fetchQuestion(URL).then((fetchedData) => {
    response = fetchedData;
    let optionsList = document.getElementById("options_list");
    optionsList.addEventListener("click", (e) => {
      if (e.target.nodeName == "LI") {
        let popUp = document.getElementById("notification");
        if (
          e.target.innerHTML === document.querySelector("#answer").innerHTML
        ) {
          setGreenNotification();
          function setGreenNotification() {
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

    document.querySelector(".questionContainer").innerHTML =
      currentQuestionObj.question;
    let optionArray = [];
    for (let optionIdx = 0; optionIdx < 3; optionIdx++) {
      document.getElementsByClassName("option")[optionIdx].innerHTML =
        currentQuestionObj.incorrect_answers[optionIdx];

      let optionValue = optionArray.push(
        currentQuestionObj.incorrect_answers[optionIdx]
      );
      console.log(optionValue);
    }
    document.querySelector("#answer").innerHTML =
      currentQuestionObj.correct_answer;

    let correctAnswer = currentQuestionObj.correct_answer;
    optionArray.push(correctAnswer);
    console.log(optionArray);
  }
  document.getElementById("nextBtn").addEventListener("click", () => {
    currentQuestionIdx = currentQuestionIdx + 1;
    renderCurrentQuestion(response);
    let popUp = document.getElementById("notification");
    popUp.style.visibility = "hidden";
    document
      .querySelectorAll(".option")
      .forEach((el) => el.classList.remove("disabled"));
  });
}
