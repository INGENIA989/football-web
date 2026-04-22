const matchesDiv = document.getElementById("matches");

// Simulació de dades (pots substituir per API real)
const matches = [
  {
    home: "Barcelona",
    away: "Real Madrid",
    score: "2 - 1",
    minute: 67
  },
  {
    home: "Manchester City",
    away: "Liverpool",
    score: "1 - 1",
    minute: 45
  }
];

function loadMatches() {
  matchesDiv.innerHTML = "";

  matches.forEach(match => {
    const div = document.createElement("div");
    div.classList.add("match");

    div.innerHTML = `
      <h3>${match.home} vs ${match.away}</h3>
      <p>${match.score}</p>
      <p>Minut: ${match.minute}</p>
    `;

    matchesDiv.appendChild(div);
  });
}

// Simula actualització en directe
setInterval(() => {
  matches.forEach(m => m.minute++);
  loadMatches();
}, 5000);

loadMatches();
