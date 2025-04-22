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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const requireAuth_1 = require("./middleware/requireAuth");
const User_1 = __importDefault(require("./models/User"));
const albums_1 = __importDefault(require("./routes/albums"));
const photos_1 = __importDefault(require("./routes/photos"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Check for required environment variables
if (!process.env.JWT_SECRET) {
    console.error('ERROR: JWT_SECRET is not defined in environment variables');
    process.exit(1);
}
if (!process.env.MONGO_URI) {
    console.error('ERROR: MONGO_URI is not defined in environment variables');
    process.exit(1);
}
// Connect to MongoDB
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/auth', auth_1.default);
app.use(albums_1.default);
app.use(photos_1.default);
// Simple protected test route
app.get('/protected', requireAuth_1.requireAuth, (req, res) => {
    res.json({ message: 'You accessed a protected route', user: req.user });
});
// Protected "list users" route
app.get('/users', requireAuth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find({}, 'name username email');
        res.json(users);
    }
    catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}));
// Health check route
app.get('/', (_, res) => {
    res.send('Backend is running');
});
// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Server error' });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
