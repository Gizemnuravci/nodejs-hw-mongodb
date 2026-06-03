import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pinoHttp({ transport: { target: 'pino-pretty' } }));
  app.use(express.json());

  app.use(contactsRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
