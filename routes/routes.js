const express = require("express")

const router = express.Router();
const UserController = require("../controllers/UserController");
const AdminAuth = require("../middleware/AdminAuth");

router.post('/user', UserController.create);
router.get('/user',AdminAuth, UserController.index);
router.get('/user/:id', UserController.findById);
router.put("/user", UserController.update);
router.delete("/user/:id", UserController.remove);
router.post("/recoverpassword", UserController.recoverPassword); 
router.post("/changepassword", UserController.changePassword); 
router.post("/login", UserController.login);

module.exports = router;