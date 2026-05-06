// Configuración de API
const API_KEY = '8ea61a7eb7msh4472a4908b221eep188f6ajsn5a409dd0c969';
const API_HOST = 'v3.football.api-sports.io';
const LEAGUE_ID = 140; // La Liga
const SEASON = 2025;   // Temporada 2025/2026

// Elementos del DOM
const matchesGrid = document.getElementById('matches-grid');
const scorersList = document.getElementById('scorers-list');

/**
 * Función para obtener los últimos 6 partidos
 */
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
        renderMatches(data.response);
    } catch (error) {
        console.error("Error al obtener partidos:", error);
        matchesGrid.innerHTML = '<div class="loader">Error al cargar resultados.</div>';
    }
}

/**
 * Función para pintar los partidos en pantalla
 */
function renderMatches(matches) {
    matchesGrid.innerHTML = ''; 

    if (!matches || matches.length === 0) {
        matchesGrid.innerHTML = '<div class="loader">No hay resultados recientes disponibles.</div>';
        return;
    }

    matches.forEach(match => {
        const home = match.teams.home;
        const away = match.teams.away;
        const goals = match.goals;
        // Limpiamos el texto de la jornada para que quede mejor
        const roundText = match.league.round.replace('Regular Season - ', 'Jornada ');

        const matchHTML = `
            <div class="match-card">
                <div class="round">${roundText}</div>
                <div class="teams-container">
                    <div class="team">
                        <img src="${home.logo}" alt="${home.name}">
                        <span>${home.name}</span>
                    </div>
                    <div class="score">${goals.home} - ${goals.away}</div>
                    <div class="team">
                        <img src="${away.logo}" alt="${away.name}">
                        <span>${away.name}</span>
                    </div>
                </div>
                <div class="status">Finalizado</div>
            </div>
        `;
        matchesGrid.insertAdjacentHTML('beforeend', matchHTML);
    });
}

/**
 * Función para obtener el Top 10 de jugadores
 */
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
        renderScorers(data.response);
    } catch (error) {
        console.error("Error al obtener jugadores:", error);
        scorersList.innerHTML = '<div class="loader">Error al cargar estadísticas.</div>';
    }
}

/**
 * Función para pintar los jugadores en pantalla
 */
function renderScorers(players) {
    scorersList.innerHTML = ''; 

    if (!players || players.length === 0) {
        scorersList.innerHTML = '<div class="loader">No hay datos de jugadores para esta temporada.</div>';
        return;
    }

    // Cogemos solo los 10 primeros
    const top10 = players.slice(0, 10);

    top10.forEach((item, index) => {
        const p = item.player;
        const s = item.statistics[0]; 
        
        // Protegemos datos que a veces faltan (ej. si no tienen asistencias)
        const assists = s.goals.assists || 0;
        const rating = s.games.rating ? parseFloat(s.games.rating).toFixed(1) : '-';

        const scorerHTML = `
            <div class="scorer-item">
                <div class="scorer-left">
                    <span class="scorer-rank">${index + 1}</span>
                    <img src="${p.photo}" class="scorer-photo" alt="${p.name}">
                    <div class="scorer-info-text">
                        <span class="scorer-name">${p.name}</span>
                        <div class="scorer-team">
                            <img src="${s.team.logo}" alt="${s.team.name}">
                            <span>${s.team.name}</span>
                        </div>
                    </div>
                </div>
                
                <div class="scorer-stats">
                    <div class="stat-box">
                        <span class="stat-value">${s.games.appearences}</span>
                        <span class="stat-label">Partidos</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-value" style="color: var(--accent);">${assists}</span>
                        <span class="stat-label">Asistencias</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-value" style="color: #fbbf24;">${rating}</span>
                        <span class="stat-label">Nota</span>
                    </div>
                    <div class="stat-box goals">
                        <span class="stat-value">${s.goals.total}</span>
                        <span class="stat-label">Goles</span>
                    </div>
                </div>
            </div>
        `;
        scorersList.insertAdjacentHTML('beforeend', scorerHTML);
    });
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    fetchLatestMatches();
    fetchTopScorers();
});
    setInterval(fetchLiveMatches, 60000);
});
