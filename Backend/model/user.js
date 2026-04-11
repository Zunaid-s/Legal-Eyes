const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatarUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
