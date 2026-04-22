import { Schema, model } from 'mongoose';

const clauseSchema = new Schema({
    documentId: { type: Schema.Types.ObjectId, ref: 'Document', required: true, index: true },
    originalClause: { type: String, required: true },
    issueDescription: { type: String, required: true },
    suggestion: { type: String, required: true },
    severity: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], required: true },
    futureBenefits: { type: String, required: false },
    futureLosses: { type: String, required: false }
}, { timestamps: true });

export default model('ProblematicClause', clauseSchema);