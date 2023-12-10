const express = require("express");
const { main } = require("../controllers/controller.user");

const router = express.Router();

router.get("/api/main", main);

module.exports = router;
