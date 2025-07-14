"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomPoints = exports.calculateRankings = void 0;
const models_1 = require("../models");
const calculateRankings = async () => {
    try {
        const users = await models_1.User.find().sort({ totalPoints: -1 });
        for (let i = 0; i < users.length; i++) {
            users[i].rank = i + 1;
            await users[i].save();
        }
    }
    catch (error) {
        console.error('Error calculating rankings:', error);
    }
};
exports.calculateRankings = calculateRankings;
const generateRandomPoints = () => {
    return Math.floor(Math.random() * 10) + 1;
};
exports.generateRandomPoints = generateRandomPoints;
