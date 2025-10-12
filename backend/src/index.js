import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectMongo } from '../lib/db.js';
import { authRouter } from '../routes/auth.js';
import { purchasesRouter } from '../routes/purchases.js';
import { transfersRouter } from '../routes/transfers.js';
import { assignmentsRouter } from '../routes/assignments.js';
import { dashboardRouter } from '../routes/dashboard.js';
import { baseRouter } from '../routes/base.js';
import { balancesRouter } from '../routes/balances.js';

connectMongo().then(() => {
	console.log('MongoDB connected');
}).catch((e) => {
	console.error('MongoDB connection error', e);
});

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRouter);
app.use('/api/purchases', purchasesRouter);
app.use('/api/transfers', transfersRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/balances', balancesRouter);
app.use('/api', baseRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
	console.log('API listening on ' + port);
});

export { app };


