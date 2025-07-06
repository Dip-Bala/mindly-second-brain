import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import appRouter from './routes/router';
import authRouter from './routes/authRoutes';

const port = process.env.PORT || 3000;
const dbUrl = process.env.MONGODB_URL as string;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/mindly/auth', authRouter);
app.use('/api/v1/mindly', appRouter);

async function main() {
  await mongoose.connect(dbUrl);
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}
main();
