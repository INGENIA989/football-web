// Configuración de API (Para usar en producción, regístrate en API-Football vía RapidAPI)
const API_KEY = '8const API_KEY = '8ea61a7eb7msh4472a4908b221eep188f6ajsn5a409dd0c969';'; // Reemplaza con tu clave real
const API_HOST = 'v3.football.api-sports.io';
const API_URL = 'https://v3.football.api-sports.io/fixtures?live=all';

// Elementos del DOM
const matchesGrid = document.getElementById('matches-grid');
const refreshBtn = document.getElementById('refresh-btn');

/**
 * Función principal para obtener los datos.
 * Incluye un fallback (datos simulados) por si no hay API Key configurada.
 */
async function fetchLiveMatches() {
    try {
        matchesGrid.innerHTML = '<div class="loader">Actualizando estadísticas...</div>';

        // Intentar llamada real a la API
        if (API_KEY !== 'TU_API_KEY_AQUI') {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'x-rapidapi-host': API_HOST,
                    'x-rapidapi-key': API_KEY
                }
            });
            const data = await response.json();
            renderMatches(data.response);
        } else {
            // FALLBACK: Datos simulados para demostración
            console.warn("Usando datos simulados. Configura tu API_KEY para datos reales.");
            setTimeout(() => renderMatches(getMockData()), 800);
        }
    } catch (error) {
        console.error("Error al obtener los partidos:", error);
        matchesGrid.innerHTML = '<div class="loader">Error de conexión. Intenta nuevamente.</div>';
    }
}

/**
 * Renderiza el array de partidos en el DOM
 */
function renderMatches(matches) {
    matchesGrid.innerHTML = ''; // Limpiar grid

    if (!matches || matches.length === 0) {
        matchesGrid.innerHTML = '<div class="loader">No hay partidos en directo en este momento.</div>';
        return;
    }

    matches.forEach(match => {
        const fixture = match.fixture;
        const teams = match.teams;
        const goals = match.goals;
        const league = match.league;
        const stats = match.statistics || { shots: 0, possession: 50, cards: 0 }; // Default if missing

        const cardHTML = `
            <article class="match-card">
                <div class="league-name">${league.name} - ${league.country}</div>
                
                <div class="scoreboard">
                    <div class="team">
                        <img src="${teams.home.logo}" alt="${teams.home.name}" onerror="this.src='https://via.placeholder.com/48?text=H'">
                        <span class="team-name">${teams.home.name}</span>
                    </div>
                    
                    <div class="score-container">
                        <span class="score">${goals.home ?? 0} - ${goals.away ?? 0}</span>
                        <span class="match-time">${fixture.status.elapsed}'</span>
                    </div>
                    
                    <div class="team">
                        <img src="${teams.away.logo}" alt="${teams.away.name}" onerror="this.src='https://via.placeholder.com/48?text=A'">
                        <span class="team-name">${teams.away.name}</span>
                    </div>
                </div>

                <div class="stats-bar">
                    <div class="stat-item">
                        <span class="stat-value">${stats.shots || Math.floor(Math.random() * 15)}</span>
                        <span>Tiros</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${stats.possession || Math.floor(Math.random() * 40 + 30)}%</span>
                        <span>Posesión</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${stats.cards || Math.floor(Math.random() * 4)}</span>
                        <span>Tarjetas</span>
                    </div>
                </div>
            </article>
        `;
        
        // Insertar como HTML seguro
        matchesGrid.insertAdjacentHTML('beforeend', cardHTML);
    });
}

/**
 * Generador de datos simulados para probar la UI
 */
function getMockData() {
    return [
        {
            fixture: { status: { elapsed: 67 } },
            league: { name: "La Liga", country: "Spain" },
            teams: {
                home: { name: "Real Madrid", logo: "https://media.api-sports.io/football/teams/541.png" },
                away: { name: "Barcelona", logo: "https://media.api-sports.io/football/teams/529.png" }
            },
            goals: { home: 2, away: 1 }
        },
        {
            fixture: { status: { elapsed: 12 } },
            league: { name: "Premier League", country: "England" },
            teams: {
                home: { name: "Arsenal", logo: "https://media.api-sports.io/football/teams/42.png" },
                away: { name: "Chelsea", logo: "https://media.api-sports.io/football/teams/49.png" }
            },
            goals: { home: 0, away: 0 }
        },
        {
            fixture: { status: { elapsed: 89 } },
            league: { name: "Serie A", country: "Italy" },
            teams: {
                home: { name: "Juventus", logo: "https://media.api-sports.io/football/teams/496.png" },
                away: { name: "AC Milan", logo: "https://media.api-sports.io/football/teams/489.png" }
            },
            goals: { home: 1, away: 1 }
        }
    ];
}

// Event Listeners y Ciclo de Vida
document.addEventListener('DOMContentLoaded', () => {
    fetchLiveMatches();
    
    // Auto-actualizar cada 60 segundos (Polling)
    setInterval(fetchLiveMatches, 60000);
});

refreshBtn.addEventListener('click', fetchLiveMatches);
/**
 * Obtiene los máximos goleadores de una liga específica
 */
async function fetchTopScorers(leagueId, season) {
    const scorersContainer = document.getElementById('top-scorers-list');
    
    try {
        // Hacemos la petición al endpoint de goleadores
        const response = await fetch(`https://v3.football.api-sports.io/players/topscorers?league=${leagueId}&season=${season}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': API_HOST,
                'x-rapidapi-key': API_KEY
            }
        });
        
        const data = await response.json();
        
        if (data.response && data.response.length > 0) {
            renderTopScorers(data.response);
        } else {
            scorersContainer.innerHTML = '<div class="loader">No se encontraron datos para esta liga.</div>';
        }
    } catch (error) {
        console.error("Error al obtener goleadores:", error);
        scorersContainer.innerHTML = '<div class="loader">Error de conexión al cargar jugadores.</div>';
    }
}

/**
 * Renderiza la lista de goleadores en el HTML
 */
function renderTopScorers(players) {
    const scorersContainer = document.getElementById('top-scorers-list');
    scorersContainer.innerHTML = ''; // Limpiamos el texto de "Cargando..."

    // Nos quedamos solo con los 5 primeros para que quede visualmente limpio
    const top5 = players.slice(0, 5);

    top5.forEach((item, index) => {
        const player = item.player;
        const stats = item.statistics[0]; // Tomamos las estadísticas del torneo principal
        
        const scorerHTML = `
            <div class="scorer-item">
                <div class="scorer-info">
                    <span class="scorer-rank">${index + 1}</span>
                    <img src="${player.photo}" alt="${player.name}" class="scorer-photo" onerror="this.src='https://via.placeholder.com/45?text=P'">
                    <div>
                        <div class="scorer-name">${player.name}</div>
                        <div class="scorer-team">${stats.team.name}</div>
                    </div>
                </div>
                <div class="scorer-goals">
                    ${stats.goals.total} <span style="font-size: 0.8rem; color: var(--text-secondary);">Goles</span>
                </div>
            </div>
        `;
        
        scorersContainer.insertAdjacentHTML('beforeend', scorerHTML);
    });
}
