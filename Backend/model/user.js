import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatarUrl: { type: String }
}, { timestamps: true });

export default model('User', userSchema);