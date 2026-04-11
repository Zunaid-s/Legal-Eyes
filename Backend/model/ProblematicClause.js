const mongoose = require('mongoose');
const clauseSchema = new mongoose.Schema({
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
    originalClause: { type: String, required: true },
    issueDescription: { type: String, required: true },
    suggestion: { type: String, required: true },
    severity: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], required: true }
});

module.exports = mongoose.model('ProblematicClause', clauseSchema);