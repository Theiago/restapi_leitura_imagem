import { Router } from 'express';
import { findText } from '../services/geminiService';
import { checkMonthReadings, insertMeasure } from '../models/db';
import { saveImage } from '../services/processImage';

const router = Router();

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

router.post('/', async (req, res) => {
    const { image, customer_code, measure_datetime, measure_type } = req.body;

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
        const readValue = await findText(image)

        const checkReadings = await checkMonthReadings(customer_code, measure_datetime, measure_type)
        
        if (!checkReadings) {
            res.status(409).json({
                error_code: "DOUBLE_REPORT",
                error_description: "Leitura do mês já realizada"
            })
            return
        }

        const result = await insertMeasure(image, customer_code, measure_datetime, measure_type, parseInt(readValue))

        const image_url = saveImage(result.image, result.measure_uuid)

        res.status(200).json({
            "image_url": `http://${req.hostname}${image_url}`,
            "measure_value": parseInt(readValue),
            "measure_uuid": result.measure_uuid
        })
    } catch (error) {
        res.status(500).json(error);
    }


});

export default router;