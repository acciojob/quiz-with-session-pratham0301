
const questions = [
  { question: "What is the capital of France?", choices: ["Paris", "London", "Berlin", "Madrid"], answer: "Paris" },
  { question: "What is the highest mountain in the world?", choices: ["Everest", "Kilimanjaro", "Denali", "Matterhorn"], answer: "Everest" },
  { question: "What is the largest country by area?", choices: ["Russia", "China", "Canada", "United States"], answer: "Russia" },
  { question: "Which is the largest planet in our solar system?", choices: ["Earth", "Jupiter", "Mars", "Saturn"], answer: "Jupiter" },
  { question: "What is the capital of Canada?", choices: ["Toronto", "Montreal", "Vancouver", "Ottawa"], answer: "Ottawa" },
];

window.addEventListener("DOMContentLoaded", () => {
  const questionDiv = document.getElementById("questions");
  const submitBtn = document.getElementById("submit");
  const scoreDiv = document.getElementById("score");

  // Load saved progress
  const progress = JSON.parse(sessionStorage.getItem("progress")) || {};

  // Render questions
  questions.forEach((q, i) => {
    const container = document.createElement("div"); // wrap each question
    container.classList.add("question-container");

    const h2 = document.createElement("h2");
    h2.textContent = q.question; // exact match for Cypress
    container.appendChild(h2);

    q.choices.forEach(choice => {
      const label = document.createElement("label");
      label.innerHTML = `
        <input type="radio" name="question${i}" value="${choice}">
        ${choice} <br>
      `;
      container.appendChild(label);
    });

    questionDiv.appendChild(container);
  });

  // Restore previous selections and attach event listeners
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    if (progress[radio.name] === radio.value) {
      radio.checked = true;
      radio.setAttribute("checked", "true"); // for Cypress
    }

    radio.addEventListener("change", e => {
      const question = e.target.name;
      const answer = e.target.value;

      const progress = JSON.parse(sessionStorage.getItem("progress")) || {};
      progress[question] = answer;
      sessionStorage.setItem("progress", JSON.stringify(progress));

      // update checked attribute for Cypress
      document.querySelectorAll(`input[name="${question}"]`).forEach(r => r.removeAttribute("checked"));
      e.target.setAttribute("checked", "true");
    });
  });

  // Submit button
  submitBtn.addEventListener("click", () => {
    const progress = JSON.parse(sessionStorage.getItem("progress")) || {};
    let totalScore = 0;

    for (let i = 0; i < questions.length; i++) {
      const key = `question${i}`;
      if (progress[key] === questions[i].answer) totalScore++;
    }

    // Store in localStorage
    localStorage.setItem("score", totalScore);

    // Display score with period
    scoreDiv.textContent = `Your score is ${totalScore} out of ${questions.length}.`;
  });

  // Restore score if page refreshed
  const savedScore = localStorage.getItem("score");
  if (savedScore !== null) {
    scoreDiv.textContent = `Your score is ${savedScore} out of ${questions.length}.`;
  }
});