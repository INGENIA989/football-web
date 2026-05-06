// 1. Configuración
const API_KEY = '8ea61a7eb7msh4472a4908b221eep188f6ajsn5a409dd0c969';
const API_HOST = 'api-football-v1.p.rapidapi.com'; // <-- ¡Este es el servidor correcto!
const LEAGUE_ID = 140; // La Liga
const SEASON = 2023;

// 2. Elementos del DOM
const matchesGrid = document.getElementById('matches-grid');
const scorersList = document.getElementById('scorers-list');

// 3. Función para últimos partidos
async function fetchLatestMatches() {
    try {
        const response = await fetch(`https://${API_HOST}/fixtures?league=${LEAGUE_ID}&season=${SEASON}&last=6`, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': API_HOST,
                'x-rapidapi-key': API_KEY
            }
        });
        
        const data = await response.json();
        
        matchesGrid.innerHTML = ''; 
        if (!data.response || data.response.length === 0) {
            matchesGrid.innerHTML = '<div class="loader">No hay resultados.</div>';
            return;
        }

        data.response.forEach(match => {
            const roundText = match.league.round.replace('Regular Season - ', 'Jornada ');
            const html = `
                <div class="match-card">
                    <div class="round">${roundText}</div>
                    <div class="teams-container">
                        <div class="team">
                            <img src="${match.teams.home.logo}" alt="Local">
                            <span>${match.teams.home.name}</span>
                        </div>
                        <div class="score">${match.goals.home} - ${match.goals.away}</div>
                        <div class="team">
                            <img src="${match.teams.away.logo}" alt="Visitante">
                            <span>${match.teams.away.name}</span>
                        </div>
                    </div>
                    <div class="status">Finalizado</div>
                </div>
            `;
            matchesGrid.insertAdjacentHTML('beforeend', html);
        });
    } catch (error) {
        console.error("Error en partidos:", error);
        matchesGrid.innerHTML = '<div class="loader">Error de conexión.</div>';
    }
}

// 4. Función para Top Goleadores
async function fetchTopScorers() {
    try {
        const response = await fetch(`https://${API_HOST}/players/topscorers?league=${LEAGUE_ID}&season=${SEASON}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': API_HOST,
                'x-rapidapi-key': API_KEY
            }
        });
        
        const data = await response.json();
        
        scorersList.innerHTML = '';
        if (!data.response || data.response.length === 0) {
            scorersList.innerHTML = '<div class="loader">No hay datos de jugadores.</div>';
            return;
        }

        const top10 = data.response.slice(0, 10);
        top10.forEach((item, index) => {
            const p = item.player;
            const s = item.statistics[0];
            const assists = s.goals.assists || 0;
            const rating = s.games.rating ? parseFloat(s.games.rating).toFixed(1) : '-';

            const html = `
                <div class="scorer-item">
                    <div class="scorer-left">
                        <span class="scorer-rank">${index + 1}</span>
                        <img src="${p.photo}" class="scorer-photo" alt="Foto">
                        <div class="scorer-info-text">
                            <span class="scorer-name">${p.name}</span>
                            <div class="scorer-team">
                                <img src="${s.team.logo}" alt="Escudo">
                                <span>${s.team.name}</span>
                            </div>
                        </div>
                    </div>
                    <div class="scorer-stats">
                        <div class="stat-box"><span class="stat-value">${s.games.appearences}</span><span class="stat-label">Partidos</span></div>
                        <div class="stat-box"><span class="stat-value" style="color: var(--accent);">${assists}</span><span class="stat-label">Asist.</span></div>
                        <div class="stat-box"><span class="stat-value" style="color: #fbbf24;">${rating}</span><span class="stat-label">Nota</span></div>
                        <div class="stat-box goals"><span class="stat-value">${s.goals.total}</span><span class="stat-label">Goles</span></div>
                    </div>
                </div>
            `;
            scorersList.insertAdjacentHTML('beforeend', html);
        });
    } catch (error) {
        console.error("Error en jugadores:", error);
        scorersList.innerHTML = '<div class="loader">Error de conexión.</div>';
    }
}

// 5. Iniciar todo
document.addEventListener('DOMContentLoaded', () => {
    fetchLatestMatches();
    fetchTopScorers();
});
