require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const connectDB = require('./db/connect');

const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');

const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');



// middleware
app.use(express.json());

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', jobsRouter);

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