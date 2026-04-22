import Document from '../model/Document.js';
import ProblematicClause from '../model/ProblematicClause.js';

// export const historyList = async (req, res) => {
//     try {
//         const userId = req.user?.id || req.user?._id || '000000000000000000000000';
//         const documents = await Document.find({ userId }).sort({ createdAt: -1 });
//         return res.status(200).json({
//             success: true,
//             count: documents.length,
//             data: documents,
//         });
//     } catch (error) {
//         console.error('Fetch History Error:', error);
//         return res.status(500).json({
//             details: error.message,
//             error: 'Failed to fetch history',
//         });
//     }
// };

export const getUserDocuments = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const documents = await Document.find({ userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: documents.length,
            data: documents,
        });
    } catch (error) {
        console.error("Fetch History Error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch history",
            details: error.message,
        });
    }
};

export const getDocumentAnalysis = async (req, res) => {
    try {
        const documentId = req.params.id;
        const document = await Document.findById(documentId);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        const userId = req.user?.id || req.user?._id || '000000000000000000000000';
        if (document.userId.toString() !== userId.toString() && userId !== '000000000000000000000000') {
            return res.status(403).json({ error: 'Access denied' });
        }
        const clauses = await ProblematicClause.find({ documentId });
        return res.status(200).json({
            documentId: document._id,
            filename: document.filename,
            status: document.status,
            problematicClauses: clauses
        });
    } catch (error) {
        console.error('Fetch Analysis Error:', error);
        return res.status(500).json({ error: 'Failed to fetch analysis', details: error.message });
    }
};

export const deleteDocument = async (req, res) => {
    try {
        const documentId = req.params.id;
        const document = await Document.findById(documentId);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        const userId = req.user?.id || req.user?._id || '000000000000000000000000';
        if (document.userId.toString() !== userId.toString() && userId !== '000000000000000000000000') {
            return res.status(403).json({ error: 'Access denied' });
        }
        await Document.findByIdAndDelete(documentId);
        return res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Delete Document Error:', error);
        return res.status(500).json({ error: 'Failed to delete document', details: error.message });
    }
};

export const getDocumentHistory = getUserDocuments;
