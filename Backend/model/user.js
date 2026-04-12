const { Schema, model } = require("mongoose");
const userSchema = new Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatarUrl: { type: String }
}, { timestamps: true });

module.exports = model('User', userSchema);
