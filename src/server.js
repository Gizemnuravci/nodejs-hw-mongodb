import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pinoHttp({ transport: { target: 'pino-pretty' } }));
  app.use(express.json());
  app.use(cookieParser());

  const swaggerDocumentPath = path.resolve('docs/swagger.json');

  if (fs.existsSync(swaggerDocumentPath)) {
    const swaggerDocument = JSON.parse(
      fs.readFileSync(swaggerDocumentPath, 'utf8'),
    );
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log('Swagger docs available at http://localhost:3000/api-docs');
  } else {
    console.warn(
      'docs/swagger.json bulunamadı. Lütfen "npm run build" komutunu çalıştırın.',
    );
  }

  app.use('/auth', authRouter);
  app.use(contactsRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
