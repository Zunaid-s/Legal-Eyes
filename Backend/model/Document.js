const mongoose = require('mongoose');
const documentSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    textContent: { type: String },
    status: { type: String, enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'], default: 'PENDING' }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
