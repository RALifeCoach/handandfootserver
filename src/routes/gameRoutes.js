import express from 'express';
import GameController from '../controllers/gameController';

const router = express.Router();

router.route('/games').get(GameController.games);
router.route('/createGame').get(GameController.createNewGame);
router.route('/addPlayers').post(GameController.addPlayers);

export default router;