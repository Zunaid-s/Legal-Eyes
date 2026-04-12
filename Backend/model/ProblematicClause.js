const { Schema, model } = require('mongoose');
const clauseSchema = new Schema({
    documentId: { type: Schema.Types.ObjectId, ref: 'Document', required: true },
    originalClause: { type: String, required: true },
    issueDescription: { type: String, required: true },
    suggestion: { type: String, required: true },
    severity: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], required: true }
});

module.exports = model('ProblematicClause', clauseSchema);