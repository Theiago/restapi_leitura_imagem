import { getMeasuresFromCustomerCode } from "../models/db";

export async function listMeasures(req: any, res: any) {
    const { customerCode } = req.params;

    const measureTypeKey = Object.keys(req.query).find(key => key.toLowerCase() === 'measure_type');
    let measureType;
    if (measureTypeKey) {
        measureType = req.query[measureTypeKey].toString().toLowerCase();
    }


    if (measureType && measureType !== "water" && measureType !== "gas") {
        return res.status(400).json({
            error_code: "INVALID_TYPE",
            error_description: "Tipo de medição não permitida"
        });
    }

    const measureList = await getMeasuresFromCustomerCode(customerCode, measureType)

    if (!measureList.length) {
        return res.status(404).json({
            error_code: "MEASURES_NOT_FOUND",
            error_description: "Nenhuma leitura encontrada"
        });
    }

    const processedList = measureList.map((measure) => {
        return {
            measure_uuid: measure.measure_uuid,
            measure_datetime: measure.measure_datetime,
            measure_type: measure.measure_type,
            has_confirmed: measure.confirmed,
            image_url: `http://${req.hostname}/images/${measure.measure_uuid}`
        }
    })

    return res.status(200).json({
        customer_code: customerCode,
        measures: processedList
    });
}
