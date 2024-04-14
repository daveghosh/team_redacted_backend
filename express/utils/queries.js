const Pool = require('pg').Pool;

const connectionString = process.env.CONNECTION_STRING;
const pool = new Pool({
  connectionString,
  max: 3
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
})

// game queries
const getGames = async (request, response) => {
  const client = await pool.connect()
  client.query('SELECT * FROM games ORDER BY id ASC', (error, results) => {
    if (error) {
      client.release();
      throw error
    }
    response.status(200).json(results.rows)
  })
  client.release();
}

const resetGame = async (request, response) => {
  const client = await pool.connect()
  client.query('UPDATE games SET turn = $1, mode = $2 RETURNING *', [0, 'lobby'], (error, results) => {
    if (error) {
      client.release();
      throw error
    }
    response.status(201).send(`Reset game with id: ${results.rows[0].id}`)
  })
  client.release();
}

const updateGameMode = async (request, response) => {
  const client = await pool.connect()
  const mode = request.params.mode;
  client.query('UPDATE games SET mode = $1 RETURNING *;', [mode], (error, results) => {
    if (error) {
      client.release();
      throw error
    }
    response.status(201).send(`Updated game mode to: ${results.rows[0].mode}`)
  })
  client.release();
}

const updateTurn = async (request, response) => {
  const client = await pool.connect()
  const turnString = request.params.turn;
  const turn = parseInt(turnString);
  client.query('UPDATE games SET turn = $1 RETURNING *;', [turn], (error, results) => {
    if (error) {
      client.release();
      throw error
    }
    response.status(201).send(`Updated game turn to: ${results.rows[0].turn}`)
  })
  client.release();
}

// card queries
const getCards = async (request, response) => {
  const client = await pool.connect()
  client.query('SELECT * FROM cards ORDER BY id ASC', (error, results) => {
    if (error) {
      client.release();
      throw error
    }
    response.status(200).json(results.rows)
  })
  client.release();
}

const getPlayerCards = async (request, response) => {
  const client = await pool.connect()
  const player = request.params.player;
  client.query('SELECT * FROM cards WHERE player_id = $1 ORDER BY id ASC', [player], (error, results) => {
    if (error) {
      client.release();
      throw error
    }
    response.status(200).json(results.rows)
  })
  client.release();
}

const getSolution = async (request, response) => {
  const client = await pool.connect()
  client.query('SELECT * FROM cards WHERE player_id IS NULL AND type != $1 ORDER BY id ASC', ['none'], (error, results) => {
    if (error) {
      client.release();
      throw error
    }
    response.status(200).json(results.rows)
  })
  client.release();
}

const resetCards = async (request, response) => {
  const client = await pool.connect()
  client.query('UPDATE cards SET player_id = $1 RETURNING *;', [null], (error, results) => {
    if (error) {
      client.release();
      throw error
    }
    response.status(201).send(`Reset all cards`);
  })
  client.release();
}

const setCardPlayer = async (request, response) => {
  const client = await pool.connect()
  const id = request.params.id;
  const player = request.params.player;
  client.query('UPDATE cards SET player_id = $1 WHERE id = $2 RETURNING *;', [player, id], (error, results) => {
    if (error) {
      client.release();
      throw error
    }
    response.status(201).send(`Updated card with ID: ${results.rows[0].id}`)
  })
  client.release();
}

// player queries

const getPlayers = async (request, response) => {
  const client = await pool.connect()
  client.query('SELECT * FROM players ORDER BY id ASC', (error, results) => {
    if (error) {
      client.release();
      throw error
    }
    response.status(200).json(results.rows)
  })
  client.release();
}

const removePlayers = async (request, response) => {
  const client = await pool.connect();
  client.query('DELETE from players RETURNING *;', [], (error, results) => {
    if (error) {
      client.release();
      throw error
    }
    response.status(200).send(`Removed all players`)
  })
  client.release();
}

const removePlayer = async (request, response) => {
  const playerId = request.params.player;
  const client = await pool.connect()
  client.query('UPDATE players SET canmove = $1 WHERE id = $2 RETURNING *;', [false, playerId], (error, results) => {
    if (error) {
      client.release();
      throw error
    }
    response.status(201).send(`Removed player with id: ${results.rows[0].id}`)
  })
  client.release();
}

const addPlayer = async (request, response) => {
  const client = await pool.connect()
  const id = request.params.id;
  const loc = request.params.loc;
  const color = request.params.color;
  client.query('INSERT INTO players (id, loc, color, cansuggest, canmove) VALUES ($1, $2, $3, $4, $5) RETURNING *', [id, loc, color, false, true], (error, results) => {
    if (error) {
      client.release();
      throw error
    }
    response.status(201).send(`Player added with ID: ${results.rows[0].id}`)
  })
  client.release();
}

const updatePlayerLocation = async (request, response) => {
  const client = await pool.connect()
  const playerId = request.params.id;
  const loc = request.params.loc;

  client.query('UPDATE players SET loc = $1 WHERE id = $2 RETURNING *;', [loc, playerId], (error, results) => {
    if (error) {
      client.release();
      throw error
    }
    response.status(201).send(`Moved player with id: ${results.rows[0].id}`)
  })
  client.release();
}

const updateCanSuggest = async (request, response) => {
  const client = await pool.connect()
  const playerId = request.params.id;
  const canSuggest = request.params.suggest;

  client.query('UPDATE players SET cansuggest = $1 WHERE id = $2 RETURNING *;', [canSuggest, playerId], (error, results) => {
    if (error) {
      client.release();
      throw error
    }
    response.status(201).send(`Update player with id: ${results.rows[0].id}`)
  })
  client.release();
}

const updateCanMove = async (request, response) => {
  const client = await pool.connect()
  const playerId = request.params.id;
  const canMove = request.params.move;

  client.query('UPDATE players SET canmove = $1 WHERE id = $2 RETURNING *;', [canMove, playerId], (error, results) => {
    if (error) {
      client.release();
      throw error
    }
    response.status(201).send(`Update player with id: ${results.rows[0].id}`)
  })
  client.release();
}

// weapon queries
const getWeapons = async (request, response) => {
  const client = await pool.connect()
  client.query('SELECT * FROM weapons ORDER BY id ASC', (error, results) => {
    if (error) {
      client.release();
      throw error
    }
    response.status(200).json(results.rows)
  })
  client.release();
}

const updateWeaponLocation = async (request, response) => {
  const client = await pool.connect()
  const weaponId = request.params.id;
  const loc = request.params.loc;

  client.query('UPDATE weapons SET loc = $1 WHERE id = $2 RETURNING *;', [loc, weaponId], (error, results) => {
    if (error) {
      client.release();
      throw error
    }
    response.status(201).send(`Moved weapon with id: ${results.rows[0].id}`)
  })
  client.release();
}

// suggestion queries
const getSuggestion = async (request, response) => {
  const client = await pool.connect()
  client.query('SELECT * FROM suggestions ORDER BY id ASC', (error, results) => {
    if (error) {
      client.release();
      throw error
    }
    response.status(200).json(results.rows)
  })
  client.release();
}

const updateSuggestionMode = async (request, response) => {
  const client = await pool.connect()
  const mode = request.params.mode;
  client.query('UPDATE suggestions SET mode = $1 RETURNING *;', [mode], (error, results) => {
    if (error) {
      client.release();
      throw error
    }
    response.status(201).send(`Updated suggestions mode to: ${results.rows[0].mode}`)
  })
  client.release();
}

const setSuggestionPlayer = async (request, response) => {
  const client = await pool.connect()
  const player = request.params.player;

  client.query('UPDATE suggestions SET player = $1 RETURNING *;', [player], (error, results) => {
    if (error) {
      client.release();
      throw error
    }
    response.status(201).send(`Updated suggestion`)
  })
  client.release();
}

const makeSuggestion = async (request, response) => {
  const client = await pool.connect()
  const weapon = request.params.weapon;
  const room = request.params.room;
  const person = request.params.person;

  client.query('UPDATE suggestions SET weapon = $2, room = $3, person = $4, mode = $5 RETURNING *;', [weapon, room, person, 'S'], (error, results) => {
    if (error) {
      client.release();
      throw error
    }
    response.status(201).send(`Updated suggestion`)
  })
  client.release();
}

const submitCounter = (request, response) => {
  const counter = request.params.counter;
  client.query('UPDATE suggestions SET counter = $1 RETURNING *;', [counter], (error, results) => {
    if (error) {
      client.release();
      throw error
    }
    response.status(201).send(`Updated counter to: ${results.rows[0].counter}`)
  })
}

const finishSuggestion = async (request, response) => {
  const client = await pool.connect()
  client.query('UPDATE suggestions SET player = $1 weapon = $2, room = $3, person = $4, mode = $5 RETURNING *;', [null, null, null, null, 'S'], (error, results) => {
    if (error) {
      client.release();
      throw error
    }
    response.status(201).send(`Updated suggestion`)
  })
  client.release();
}


module.exports = {
  getGames,
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
  updateCanSuggest,
  updateCanMove,

  getWeapons,
  updateWeaponLocation,

  getSuggestion,
  updateSuggestionMode,
  setSuggestionPlayer,
  makeSuggestion,
  submitCounter,
  finishSuggestion
}