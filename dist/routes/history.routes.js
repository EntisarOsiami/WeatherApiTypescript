"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const history_controllers_1 = require("../controllers/history.controllers");
const authorize_1 = require("../utils/authorize");
const router = (0, express_1.Router)();
router.get('/', authorize_1.authorized, history_controllers_1.getHistory);
exports.default = router;
