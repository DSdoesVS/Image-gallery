"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config();
const router = express_1.default.Router();
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, username, email, password } = req.body;
        const existing = yield User_1.default.findOne({ username });
        if (existing)
            return res.status(409).json({ error: 'Username already taken' });
        const passwordHash = yield bcryptjs_1.default.hash(password, 10);
        const user = yield User_1.default.create({ name, username, email, passwordHash });
        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user._id, name, username, email }
        });
    }
    catch (_a) {
        res.status(500).json({ error: 'Registration failed' });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield User_1.default.findOne({ username });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const isMatch = yield bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch)
            return res.status(401).json({ error: 'Invalid password' });
        const token = jsonwebtoken_1.default.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, username: user.username, email: user.email }
        });
    }
    catch (_b) {
        res.status(500).json({ error: 'Login failed' });
    }
}));
exports.default = router;
