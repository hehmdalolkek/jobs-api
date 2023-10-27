const { StatusCodes } = require('http-status-codes');


const errorHandler = async (err, req, res, next) => {
	let customError = {
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || 'Something went wrong, try again'
	};
	

	if (err.name === 'ValidationError') {
		customError.msg = Object.values(err.errors)
			.map(item => item.message)
			.join(', ');
		customError.statusCode = StatusCodes.BAD_REQUEST;
	}

	if (err.code && err.code === 11000) {
		customError.statusCode = StatusCodes.BAD_REQUEST;
		customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field`;
	}

	if (err.name === 'CastError') {
		customError.msg = `No item found with id: ${err.value}`;
		customError.statusCode = StatusCodes.NOT_FOUND;
	}


	res
		.status(customError.statusCode)
		.json(customError.msg);
};


module.exports = errorHandler;