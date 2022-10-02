const {Router} = require('express');
const {addCardValidator, updateCardValidator, addCashValidator, updateCashValidator} = require("../middleware/validations");
const handleValidationErrors = require('../middleware/handleValidationErrors');
const UserController = require("../controllers/UserController");
const CardController = require('../controllers/CardController')

const router = Router();
router.get('/data', UserController.getUserData);
router.patch('/user', UserController.setCardSkin);
router.post('/cash', addCashValidator, handleValidationErrors, UserController.addCash);
router.patch('/cash', updateCashValidator, handleValidationErrors, UserController.updateCash);
router.post('/card', addCardValidator, handleValidationErrors, CardController.addCard);
router.delete('/card/:id', CardController.removeCard);
router.patch('/card/:id', updateCardValidator, CardController.updateCard);
module.exports = router;