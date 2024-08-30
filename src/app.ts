import express from 'express';
import { initDatabase } from './models/db';

import dotenv from 'dotenv';
import { imageUrl } from './routes/imageRoutes';
import { listMeasures } from './routes/getRoutes';
import { upload } from './routes/uploadRoutes';
import { confirm } from './routes/confirmRoutes';

dotenv.config();
const app = express();
const port = process.env.PORT || 80;


// Para analisar o corpo JSON
app.use(express.json({limit: '10mb'}));
initDatabase();

// Permitir upload de arquivos
app.post('/upload', upload);

app.patch('/confirm', confirm);

app.get('/images/:id', imageUrl)

app.get('/:customerCode/list', listMeasures);

app.get('/', (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
