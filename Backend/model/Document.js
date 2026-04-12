const { Schema, model } = require('mongoose');
const documentSchema = new Schema({
    filename: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    textContent: { type: String },
    status: { type: String, enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'], default: 'PENDING' }
}, { timestamps: true });

module.exports = model('Document', documentSchema);
