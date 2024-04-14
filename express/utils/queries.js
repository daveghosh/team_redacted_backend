const Pool = require('pg').Pool;

const connectionString = process.env.CONNECTION_STRING;
const pool = new Pool({
connectionString
});

// game queries
const getGame = (request, response) => {
  pool.query('SELECT * FROM game ORDER BY gameno ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const resetGame = (request, response) => {
  pool.query('UPDATE game SET turn = $1, mode = $2 RETURNING *;', [0, 'lobby'], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Reset game with id: ${results.rows[0].id}`)
  })
}

const updateGameMode = (request, response) => {
  const mode = request.params.mode;
  pool.query('UPDATE game SET mode = $1 RETURNING *;', [mode], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Reset game with id: ${results.rows[0].id}`)
  })
}

const updateTurn = (request, response) => {
  const turnString = request.params.turn;
  const turn = parseInt(turnString);
  pool.query('UPDATE game SET turn = $1 RETURNING *;', [turn], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Updated game turn to: ${results.rows[0].turn}`)
  })
}

// card queries
const getCards = (request, response) => {
  pool.query('SELECT * FROM cards ORDER BY cardno ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getPlayerCards = (request, response) => {
  const player = request.params.player;
  pool.query('SELECT * FROM cards WHERE playerid = $1 ORDER BY cardno ASC', [player], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getSolution = (request, response) => {
  pool.query('SELECT * FROM cards WHERE playerid IS NULL ORDER BY cardno ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const resetCards = (request, response) => {
  pool.query('UPDATE cards SET playerid = $1, RETURNING *;', [null], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Reset all cards`);
  })
}

const setCardPlayer = (request, response) => {
  const id = request.params.id;
  const player = request.params.player;

  pool.query('UPDATE cards SET playerid = $1 WHERE cardno = $2, RETURNING *;', [player, id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Updated card with ID: ${results.rows[0].cardno}`)
  })
}

// player queries

const getPlayers = (request, response) => {
  pool.query('SELECT * FROM players ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const removePlayers = (request, response) => {
  pool.query('DELETE from players, RETURNING *;', [], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Removed all players`)
  })
}

const removePlayer = (request, response) => {
  const playerId = request.params.player;

  pool.query('UPDATE players SET canmove = $1 WHERE id = $1, RETURNING *;', [false, playerId], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Removed player with id: ${results.rows[0].id}`)
  })
}

const addPlayer = (request, response) => {

  const id = request.params.id;
  const loc = request.params.loc;
  const color = request.params.color;

  pool.query('INSERT INTO players (id, loc, color, cansuggest, canmove) VALUES ($1, $2, $3, $4, $5), RETURNING *', [id, loc, color, false, true], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Player added with ID: ${results.rows[0].id}`)
  })
}

const updatePlayerLocation = (request, response) => {

  const playerId = request.params.id;
  const loc = request.params.loc;

  pool.query('UPDATE players SET loc = $1 WHERE id = $2, RETURNING *;', [loc, playerId], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Moved player with id: ${results.rows[0].id}`)
  })
}

// weapon queries
const getWeapons = (request, response) => {
  pool.query('SELECT * FROM weapons ORDER BY weapon_id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const updateWeaponLocation = (request, response) => {

  const weaponId = request.params.id;
  const loc = request.params.loc;

  pool.query('UPDATE weapons SET loc = $1 WHERE weapon_id = $2, RETURNING *;', [loc, weaponId], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Moved weapon with id: ${results.rows[0].id}`)
  })
}

// suggestion queries
const getSuggestion = (request, response) => {
  pool.query('SELECT * FROM suggestion ORDER BY suggestion_id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const updateSuggestionMode = (request, response) => {
  const mode = request.params.mode;
  pool.query('UPDATE suggestion SET mode = $1, RETURNING *;', [mode], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Updated suggestion mode to: ${results.rows[0].mode}`)
  })
}

const makeSuggestion = (request, response) => {
  const player = request.params.player;
  const weapon = request.params.weapon;
  const room = request.params.room;
  const person = request.params.person;

  pool.query('UPDATE suggestion SET player = $1 weapon = $2, room = $3, person = $4, mode = $5, RETURNING *;', [player, weapon, room, person, 'S'], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Updated suggestion`)
  })
}

const submitCounter = (request, response) => {
  const counter = request.params.counter;
  pool.query('UPDATE suggestion SET counter = $1, RETURNING *;', [counter], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Updated counter to: ${results.rows[0].counter}`)
  })
}

const finishSuggestion = (request, response) => {
  pool.query('UPDATE suggestion SET player = $1 weapon = $2, room = $3, person = $4, mode = $5, RETURNING *;', [null, null, null, null, 'S'], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Updated suggestion`)
  })
}


module.exports = {
  getGame,
  resetGame, 
  updateGameMode,
  updateTurn,

  getCards,
  getPlayerCards,
  getSolution,
  resetCards,
  setCardPlayer,

  getPlayers,
  removePlayers,
  removePlayer,
  addPlayer,
  updatePlayerLocation,

  getWeapons,
  updateWeaponLocation,

  getSuggestion,
  updateSuggestionMode,
  makeSuggestion,
  submitCounter,
  finishSuggestion
}