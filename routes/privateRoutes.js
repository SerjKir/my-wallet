const {Router} = require('express');
const {addCardValidator, updateCardValidator, addCashValidator, updateCashValidator} = require("../middleware/validations");
const handleValidationErrors = require('../middleware/handleValidationErrors');
const UserController = require("../controllers/UserController");
const CardController = require('../controllers/CardController');
const WalletController = require('../controllers/WalletController');

const router = Router();
router.get('/user', UserController.getUserData);
router.patch('/user', UserController.setCardSkin);
router.get('/wallet', WalletController.getWalletData);
router.post('/cash', addCashValidator, handleValidationErrors, WalletController.addCash);
router.patch('/cash', updateCashValidator, handleValidationErrors, WalletController.updateCash);
router.post('/card', addCardValidator, handleValidationErrors, CardController.addCard);
router.delete('/card/:id', CardController.removeCard);
router.patch('/card/:id', updateCardValidator, CardController.updateCard);
module.exports = router;