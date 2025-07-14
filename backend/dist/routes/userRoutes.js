"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
// GET /api/users - Get all users
router.get('/', userController_1.getUsers);
// POST /api/users - Create a new user
router.post('/', userController_1.createUser);
// POST /api/users/claim - Claim points for a user
router.post('/claim', userController_1.claimPoints);
exports.default = router;
