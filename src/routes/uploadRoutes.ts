import { Router } from 'express';
import { findText } from '../services/geminiService';
import { checkMonthReadings, insertMeasure } from '../models/db';

// Validação de dados do request
function validateData(body: any) {

    if (typeof body.image !== 'string') {
        throw new Error('A imagem deve ser uma string base64 válida.');
    }

    if (typeof body.customer_code !== 'string') {
        throw new Error('O código do cliente deve ser uma string.');
    }

    if (!Date.parse(body.measure_datetime)) {
        throw new Error('Formato de data inválido.');
    }

    if (body.measure_type !== 'WATER' && body.measure_type !== 'GAS') {
        throw new Error('O tipo de leitura deve ser WATER ou GAS');
    }

}

export async function upload(req: any, res: any) {
    const { image, customer_code, measure_datetime, measure_type } = req.body;

    // Confere se todos dados são válidos
    try {
        validateData(req.body);
    } catch (error) {
        res.status(400).json({
            error_code: "INVALID_DATA",
            error_description: "Os dados fornecidos no corpo da requisição são inválidos"
        });
        return
    }

    try {
        // Confere se já foi realizada a leitura naquele mês
        const checkReadings = await checkMonthReadings(customer_code, measure_datetime, measure_type)
        
        if (!checkReadings) {
            res.status(409).json({
                error_code: "DOUBLE_REPORT",
                error_description: "Leitura do mês já realizada"
            })
            return
        }
        
        // Chamada  da função responsável por extrair o texto da imagem
        const readValue = await findText(image)

        // Insere as informações no banco de dados e retorna as informações para serem usadas no response
        const result = await insertMeasure(image, customer_code, measure_datetime, measure_type, parseInt(readValue))

        // Salva a imagem no disco localmente

        res.status(200).json({
            "image_url": `http://${req.hostname}/images/${result.measure_uuid}`,
            "measure_value": parseInt(readValue),
            "measure_uuid": result.measure_uuid
        })
    } catch (error) {
        res.status(500).json(error);
    }
}
