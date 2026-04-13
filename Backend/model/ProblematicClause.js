const mongoose = require('mongoose');

const ProblematicClauseSchema = new mongoose.Schema({
    clauseText: String,
    issue: String,

    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    }
});

module.exports = mongoose.model('ProblematicClause', ProblematicClauseSchema);