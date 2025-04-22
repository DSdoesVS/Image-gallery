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
const Photo_1 = __importDefault(require("../models/Photo"));
const requireAuth_1 = require("../middleware/requireAuth");
const router = express_1.default.Router();
// List photos in an album
router.get('/albums/:albumId/photos', requireAuth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { albumId } = req.params;
    const album = yield Album_1.default.findById(albumId);
    if (!album)
        return res.status(404).json({ error: 'Album not found' });
    if (album.userId.toString() !== req.user.id)
        return res.status(403).json({ error: 'Forbidden' });
    const photos = yield Photo_1.default.find({ albumId });
    res.json(photos);
}));
// Create a photo
router.post('/albums/:albumId/photos', requireAuth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { albumId } = req.params;
    const album = yield Album_1.default.findById(albumId);
    if (!album)
        return res.status(404).json({ error: 'Album not found' });
    if (album.userId.toString() !== req.user.id)
        return res.status(403).json({ error: 'Forbidden' });
    const { title, url, thumbnailUrl } = req.body;
    const photo = yield Photo_1.default.create({ title, url, thumbnailUrl, albumId });
    res.status(201).json(photo);
}));
// Get a single photo
router.get('/photos/:photoId', requireAuth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const photo = yield Photo_1.default.findById(req.params.photoId);
    if (!photo)
        return res.status(404).json({ error: 'Photo not found' });
    const album = yield Album_1.default.findById(photo.albumId);
    if (!album || album.userId.toString() !== req.user.id)
        return res.status(403).json({ error: 'Forbidden' });
    res.json(photo);
}));
// Update a photo
router.put('/photos/:photoId', requireAuth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const photo = yield Photo_1.default.findById(req.params.photoId);
    if (!photo)
        return res.status(404).json({ error: 'Photo not found' });
    const album = yield Album_1.default.findById(photo.albumId);
    if (!album || album.userId.toString() !== req.user.id)
        return res.status(403).json({ error: 'Forbidden' });
    const { title, url, thumbnailUrl } = req.body;
    photo.title = title;
    photo.url = url;
    photo.thumbnailUrl = thumbnailUrl;
    yield photo.save();
    res.json(photo);
}));
// Delete a photo
router.delete('/photos/:photoId', requireAuth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const photo = yield Photo_1.default.findById(req.params.photoId);
    if (!photo)
        return res.status(404).json({ error: 'Photo not found' });
    const album = yield Album_1.default.findById(photo.albumId);
    if (!album || album.userId.toString() !== req.user.id)
        return res.status(403).json({ error: 'Forbidden' });
    yield photo.deleteOne();
    res.status(204).end();
}));
exports.default = router;
