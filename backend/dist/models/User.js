"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: String,
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    passwordHash: String
});
exports.default = (0, mongoose_1.model)('User', UserSchema);
