const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const serverless = require('serverless-http');

const db = require('./utils/queries')
const app = express();
const router = express.Router();

app.use(cors())
app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);
app.use("/", router)

router.get('/messages', db.getMessages);
router.get('/messages/:id', db.getMessageById);
router.get('./messages/:username', db.getMessagesByUser);
router.post('/messages', db.createMessage);
router.delete('/messages/:id', db.deleteMessage);

module.exports = app;
module.exports.handler = serverless(app);