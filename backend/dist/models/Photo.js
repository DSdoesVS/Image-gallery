"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const photoSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    albumId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Album', required: true },
    url: { type: String, required: true },
    thumbnailUrl: { type: String, required: true }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Photo', photoSchema);
