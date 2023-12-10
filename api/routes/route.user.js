const express = require("express");
const {
  createUser,
  updateUser,
  exportToExcel,
  login,
} = require("../controllers/controller.user");
const router = express.Router();

router.post("/api/signup", createUser);
router.patch("/api/user/:id", updateUser);
router.get("/api/user-excel", exportToExcel);
router.post("/api/signin", login);

module.exports = router;
