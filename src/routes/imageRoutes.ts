import { getImageById, getMeasureFromUuid } from "../models/db"


export function determineFileFormat(base64: string) {

    const firstChar = base64.charAt(0)

    switch (firstChar) {
        case '/':
            return 'jpg'
        case 'i':
            return 'png'
        case 'R':
            return 'gif'
        case 'U':
            return 'webp'
        default:
            return 'jpg'
    }
}


async function decodeToBinary(userId: string) {
    const base64 = await getImageById(userId);
    const fileFormat = determineFileFormat(base64);
    const file = Buffer.from(base64, 'base64')
    return { file: file, fileFormat: fileFormat }
}

export async function imageUrl(req: any, res: any) {
    const { id } = req.params;

    try {
        const idExists = await getMeasureFromUuid(id)

        const image = await decodeToBinary(id);

        res.setHeader('Content-Type', `image/${image.fileFormat}`);
        res.send(image.file)
    } catch (error) {
        res.status(404).json({ "error_description": "FILE_NOT_FOUND" });
    }
}
