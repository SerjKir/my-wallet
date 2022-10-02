const {Router} = require('express');
const {authValidator} = require("../middleware/validations");
const handleValidationErrors = require('../middleware/handleValidationErrors');
const AuthController = require("../controllers/AuthController");

const router = Router();
router.post('/register', authValidator, handleValidationErrors, AuthController.resister);
router.post('/login', authValidator, handleValidationErrors, AuthController.login);
module.exports = router;