const {Router} = require('express');
const {addCardValidator, updateCardValidator, addCashValidator, updateCashValidator} = require("../middleware/validations");
const handleValidationErrors = require('../middleware/handleValidationErrors');
const CommonController = require("../controllers/CommonController");
const CardController = require('../controllers/CardController');
const WalletController = require('../controllers/WalletController');

const router = Router();
router.get('/data', CommonController.getAllData);
router.patch('/skin', CommonController.setCardSkin);
router.patch('/lang', CommonController.setUserLang);
router.post('/cash', addCashValidator, handleValidationErrors, WalletController.addCash);
router.patch('/cash', updateCashValidator, handleValidationErrors, WalletController.updateCash);
router.post('/card', addCardValidator, handleValidationErrors, CardController.addCard);
router.patch('/card', updateCardValidator, CardController.updateCard);
router.delete('/card/:id', CardController.removeCard);

module.exports = router;