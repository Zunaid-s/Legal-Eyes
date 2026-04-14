import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
  problematicClauses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProblematicClause' }]
}, { timestamps: true });

export default mongoose.model('Document', DocumentSchema);