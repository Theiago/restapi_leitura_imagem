import express from 'express';
import { getImageById, initDatabase } from './models/db';

import uploadRoutes from './routes/uploadRoutes';
import dotenv from 'dotenv';
import { decodeToBinary } from './routes/imageRoutes';
import confirmRoutes from './routes/confirmRoutes';

dotenv.config();
const app = express();
const port = process.env.PORT || 80;


// Para analisar o corpo JSON
app.use(express.json({limit: '10mb'}));
initDatabase();

// Permitir upload de arquivos
app.use('/upload', uploadRoutes);

app.use('/confirm', confirmRoutes);

// Rota para a pasta de uploads
app.use('/uploads', express.static('uploads'));

app.use('/images/:id', async (req, res) => {
  const { id } = req.params;

  const image = await decodeToBinary(id);

  res.setHeader('Content-Type', `image/${image.fileFormat}`);
  res.send(image.file)
});

app.get('/', (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
