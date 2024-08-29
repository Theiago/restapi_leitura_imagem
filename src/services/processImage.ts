import { Buffer } from 'buffer';
import path from 'path';
import fs from 'fs';

function decodeToBinary(base64: string) {
    const file = Buffer.from(base64, 'base64')
    return file
}

function saveToFile(binaryData: Buffer, filename: string, fileFormat: string) {
    const finalFile = `${filename}${fileFormat}`
    fs.writeFile(path.join(__dirname, '..', '..', 'uploads', finalFile), binaryData, (erro) => {
        if (erro) throw erro
        console.log('Arquivo salvo')
    })
}


export function saveImage(base64: string, filename: string) {
    const firstChar = base64.charAt(0)
    let fileFormat: string;

    switch (firstChar) {
        case '/':
            fileFormat = '.jpg'
        case 'i':
            fileFormat = '.png'
        case 'R':
            fileFormat = '.gif'
        case 'U':
            fileFormat = '.webp'
        default:
            fileFormat = '.jpg'
    }

    const image_url = `/uploads/${filename}${fileFormat}`
    const binaryData = decodeToBinary(base64)
    saveToFile(binaryData, filename, fileFormat)
    return image_url
}
