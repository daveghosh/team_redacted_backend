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

router.get('/games', db.getGames)
router.post('/resetGame', db.resetGame)
router.post('/turn/:turn', db.updateTurn)
router.post('/gameMode/:mode', db.updateGameMode);

router.get('/cards', db.getCards)
router.get('/solution', db.getSolution)
router.get('/cards/:player', db.getPlayerCards)
router.post('/card/:id/:player', db.setCardPlayer)
router.post('/resetCards', db.resetCards)

router.get('/players', db.getPlayers)
router.post('/player/:id/:loc/:color', db.addPlayer)
router.delete('/removePlayers', db.removePlayers)
router.post('/removePlayer/:id', db.removePlayer)
router.post('/updateLocation/player/:id/:loc', db.updatePlayerLocation)
router.post('/canSuggest/:id/:suggest', db.updateCanSuggest)
router.post('/canMove/:id/:move', db.updateCanMove)

router.get('/weapons', db.getWeapons)
router.post('/updateLocation/weapon/:id/:loc', db.updateWeaponLocation)

router.get('/suggestion', db.getSuggestion)
router.post('/suggest/:player', db.setSuggestionPlayer);
router.post('/suggestion/:weapon:/:room/:person', db.makeSuggestion)
router.post('/suggestionMode/:mode', db.updateSuggestionMode)
router.post('/counter/:counter', db.submitCounter);
router.post('/finishSuggestion', db.finishSuggestion);


module.exports = app;
module.exports.handler = serverless(app);