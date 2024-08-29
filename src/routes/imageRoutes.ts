import { getImageById } from "../models/db"


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


export async function decodeToBinary(userId: string) {
    const base64 = await getImageById(userId);
    const fileFormat = determineFileFormat(base64);
    const file = Buffer.from(base64, 'base64')
    return {file: file, fileFormat: fileFormat}
}