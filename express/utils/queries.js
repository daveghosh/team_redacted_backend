const Pool = require('pg').Pool;

const connectionString = process.env.CONNECTION_STRING;
const pool = new Pool({
connectionString
});

const getMessages = (request, response) => {
    pool.query('SELECT * FROM messages ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const getMessageById = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM messages WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const getMessagesByUser = (request, response) => {
    const username = request.params.username;
  
    pool.query('SELECT * FROM messages WHERE username = $1', [username], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const createMessage = (request, response) => {
    const { content, username } = request.body
  
    pool.query('INSERT INTO messages (content, username) VALUES ($1, $2) RETURNING *', [content, username], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Message added with ID: ${results.rows[0].id}`)
    })
}

const deleteMessage = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM messages WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User deleted with ID: ${id}`)
    })
}

module.exports = {
    getMessages,
    getMessageById,
    getMessagesByUser,
    createMessage,
    deleteMessage
  }