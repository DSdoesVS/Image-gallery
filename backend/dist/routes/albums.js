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
const Album_1 = __importDefault(require("../models/Album"));
const requireAuth_1 = require("../middleware/requireAuth");
const router = express_1.default.Router();
// List a user's albums
router.get('/users/:userId/albums', requireAuth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (req.user.id !== userId)
        return res.status(403).json({ error: 'Forbidden' });
    const albums = yield Album_1.default.find({ userId });
    res.json(albums);
}));
// Create a new album
router.post('/users/:userId/albums', requireAuth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (req.user.id !== userId)
        return res.status(403).json({ error: 'Forbidden' });
    const { title } = req.body;
    const album = yield Album_1.default.create({ title, userId });
    res.status(201).json(album);
}));
// Get one album
router.get('/albums/:albumId', requireAuth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const album = yield Album_1.default.findById(req.params.albumId);
    if (!album)
        return res.status(404).json({ error: 'Not found' });
    if (album.userId.toString() !== req.user.id)
        return res.status(403).json({ error: 'Forbidden' });
    res.json(album);
}));
// Update an album
router.put('/albums/:albumId', requireAuth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const album = yield Album_1.default.findById(req.params.albumId);
    if (!album)
        return res.status(404).json({ error: 'Not found' });
    if (album.userId.toString() !== req.user.id)
        return res.status(403).json({ error: 'Forbidden' });
    album.title = req.body.title;
    yield album.save();
    res.json(album);
}));
// Delete an album
router.delete('/albums/:albumId', requireAuth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const album = yield Album_1.default.findById(req.params.albumId);
    if (!album)
        return res.status(404).json({ error: 'Not found' });
    if (album.userId.toString() !== req.user.id)
        return res.status(403).json({ error: 'Forbidden' });
    yield album.deleteOne();
    res.status(204).end();
}));
exports.default = router;
