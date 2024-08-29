import express from 'express';
import { initDatabase } from './models/db';

import uploadRoutes from './routes/uploadRoutes';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 80;


// Para analisar o corpo JSON
app.use(express.json({limit: '10mb'}));
initDatabase();

// Permitir upload de arquivos
app.use('/upload', uploadRoutes);


// Rota para a pasta de uploads
app.use('/uploads', express.static('uploads'));


app.get('/', (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
