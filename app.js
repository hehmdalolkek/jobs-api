require('dotenv').config();
require('express-async-errors');

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const express = require('express');
const app = express();

const connectDB = require('./db/connect');

const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');
const authenticateUser = require('./middleware/authentication');

const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');



// middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(rateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}));

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

// error handler
app.use(notFound);
app.use(errorHandler);



const PORT = process.env.PORT || 3000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(PORT, () => {
			console.log(`Server is listening on port ${PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
};

start();