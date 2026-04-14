import mongoose from 'mongoose';

const ProblematicClauseSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  originalClause: { type: String, required: true },
  issueDescription: { type: String, required: true },
  suggestion: { type: String, required: true },
  severity: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], required: true }
}, { timestamps: true });

export default mongoose.model('ProblematicClause', ProblematicClauseSchema);