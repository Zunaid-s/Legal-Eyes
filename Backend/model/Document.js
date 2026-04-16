import { Schema, model } from 'mongoose';

const DocumentSchema = new Schema({
  filename: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
  problematicClauses: [{ type: Schema.Types.ObjectId, ref: 'ProblematicClause' }]
}, { timestamps: true });

export default model('Document', DocumentSchema);