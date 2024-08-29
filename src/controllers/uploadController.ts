import { Request, Response } from 'express';
import { textExtracted } from '../services/geminiService';

export async function uploadFile(req: Request, res: Response) {
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return
    }
    try {
        const text = await textExtracted(req.file.path, req.file.mimetype);
        res.json({ response: text });
    } catch (error) {
        res.status(500).json({ error: 'Error processing file' });
    }
}
