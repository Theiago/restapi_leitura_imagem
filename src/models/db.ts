import { Pool } from 'pg';

const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'postgres',
    password: 'foo',
    port: 5432,
});

// Função para inicializar o banco de dados
export async function initDatabase() {
    try {

        await pool.query(`
            CREATE TABLE IF NOT EXISTS leituras (
              measure_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              customer_code TEXT,
              measure_datetime TIMESTAMP DEFAULT NOW(),
              measure_type TEXT,
              measure_value NUMERIC,
              image TEXT,
              confirmed boolean DEFAULT false
            );
          `);

    } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
    }
}

// Função para conferir se a leitura já foi feita no mês especifico
export async function checkMonthReadings(customer_code: string, datetime: string, measure_type: string) {

    const date = new Date(datetime)
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const query = `SELECT customer_code
                FROM leituras
                WHERE customer_code = $1
                 AND measure_type = $2
                 AND EXTRACT(MONTH FROM measure_datetime) = $3
                 AND EXTRACT(YEAR FROM measure_datetime) = $4;
                 `

    const values = [customer_code, measure_type, month, year]

    const result = await pool.query(query, values)

    if (result.rows.length > 0) {
        return false
    }
    return true
}

// Função para inserir as leituras no banco de dados
export async function insertMeasure(image: string, customer_code: string, measure_datetime: string, measure_type: string, measure_value: number) {
    const query = `INSERT INTO leituras (image, customer_code, measure_datetime, measure_type, measure_value)
                    VALUES ($1, $2, $3, $4, $5) RETURNING *`
    const values = [image, customer_code, measure_datetime, measure_type, measure_value]
    const result = await pool.query(query, values)

    return result.rows[0];

}

export async function getImageById(measure_uuid: string) {
    const query = `SELECT image FROM leituras WHERE measure_uuid = $1`
    const values = [measure_uuid]

    const result = await pool.query(query, values)
    return result.rows[0].image
}

export async function getMeasureFromUuid(measure_uuid: string) {
    const query = `SELECT customer_code, measure_datetime, measure_type, measure_value, confirmed
                    FROM leituras 
                    WHERE measure_uuid = $1;
                    `

    const values = [measure_uuid]

    const result = await pool.query(query, values)

    return result.rows[0]

}

export async function getMeasuresFromCustomerCode(customer_code: string, measure_type?: string) {

    let query = `SELECT measure_uuid, measure_datetime, measure_type, confirmed FROM leituras WHERE customer_code = $1`
    const values = [customer_code]

    if (measure_type) {
        query += ` AND LOWER(measure_type) = LOWER($2)`
        values.push(measure_type)
    }

    query += `;`

    const result = await pool.query(query, values);
    return result.rows

}

export async function updateMeasure(measure_uuid: string, measure_value: number) {

    const taken_measure = await getMeasureFromUuid(measure_uuid);

    let query = `UPDATE leituras SET confirmed = true`
    const values = [measure_uuid]

    if (measure_value != taken_measure.measure_value) {
        query += `, measure_value = $2`;
        values.push(String(measure_value));
    }

    query += ` WHERE measure_uuid = $1 RETURNING confirmed;`

    const result = await pool.query(query, values)

    return result.rows[0].confirmed
}


// Função de query genérica
export const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
};
