import { Pool } from 'pg';

const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'postgres',
    password: 'foo',
    port: 5432,
});

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


export async function checkMonthReadings(customer_code: string, datetime: string, measure_type: string) {

    const date = new Date(datetime)
    const month = date.getMonth() + 1
    const query = `SELECT customer_code
                FROM leituras
                WHERE customer_code = $1
                 AND measure_type = $2
                 AND EXTRACT(MONTH FROM measure_datetime) = $3;`

    const values = [customer_code, measure_type, month]

    const result = await pool.query(query, values)

    if (result.rows.length > 0) {
        return false
    }
    return true
}

export async function insertMeasure(image: string, customer_code: string, measure_datetime: string, measure_type: string, measure_value: number) {
    const result = await pool.query(`INSERT INTO leituras (image, customer_code, measure_datetime, measure_type, measure_value)
                VALUES ('${image}', '${customer_code}', '${measure_datetime}', '${measure_type}', ${measure_value})
                RETURNING *
    `)

    return result.rows[0];

}


export const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
};
