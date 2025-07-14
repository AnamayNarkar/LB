"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.claimPoints = exports.getUsers = exports.createUser = void 0;
const models_1 = require("../models");
const helpers_1 = require("../utils/helpers");
const index_1 = require("../index");
const database_1 = __importDefault(require("../utils/database"));
const createUser = async (req, res) => {
    try {
        (0, database_1.default)();
        const { name } = req.body;
        if (!name) {
            res.status(400).json({ error: 'Name is required' });
            return;
        }
        const user = new models_1.User({ name });
        await user.save();
        await (0, helpers_1.calculateRankings)();
        // Get updated leaderboard
        const users = await models_1.User.find().sort({ totalPoints: -1 });
        await (0, index_1.emitLeaderboardUpdate)();
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createUser = createUser;
const getUsers = async (_req, res) => {
    try {
        (0, database_1.default)();
        const users = await models_1.User.find().sort({ totalPoints: -1 });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getUsers = getUsers;
const claimPoints = async (req, res) => {
    try {
        (0, database_1.default)();
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json({ error: 'User ID is required' });
            return;
        }
        const user = await models_1.User.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const pointsAwarded = (0, helpers_1.generateRandomPoints)();
        user.totalPoints += pointsAwarded;
        await user.save();
        await (0, helpers_1.calculateRankings)();
        // Get updated leaderboard
        const users = await models_1.User.find().sort({ totalPoints: -1 });
        await (0, index_1.emitLeaderboardUpdate)();
        res.json({
            pointsAwarded,
            user,
            leaderboard: users
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.claimPoints = claimPoints;
