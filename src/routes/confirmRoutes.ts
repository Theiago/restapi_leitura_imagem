import { getMeasureFromUuid, updateMeasure } from "../models/db";

function validateData(body: any) {
    if (typeof body.measure_uuid !== 'string') {
        throw new Error('O uuid deve ser uma string')
    }

    if (typeof body.confirmed_value !== 'number') {
        throw new Error('O confirmed_value deve ser um número')
    }

}

export async function confirm(req: any, res: any) {
    const { measure_uuid, confirmed_value } = req.body;

    // Validação dos dados
    try {
        validateData(req.body);
    } catch (error) {
        return res.status(400).json(
            {
                error_code: "INVALID_DATA",
                error_description: "Os dados fornecidos no corpo da requisição são inválidos"
            })
    }

    const measure = await getMeasureFromUuid(measure_uuid);

    // Valida se a leitura existe
    if (!measure) {
        return res.status(404).json(
            {
                error_code: "MEASURE_NOT_FOUND",
                error_description: "Leitura não encontrada"
            }
        )
    }

    // Valida se a medição já está confirmada
    if (measure.confirmed) {
        return res.status(409).json(
            {
                error_code: "CONFIRMATION_DUPLICATE",
                error_description: "Leitura do mês já realizada"
            })
    }

    // Atualiza a medição
    const result = await updateMeasure(measure_uuid, confirmed_value)

    if (result) {
        res.status(200).json(
            {
                sucess: true
            })
    }
}
