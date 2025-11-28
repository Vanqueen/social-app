
const notFound = (req, res, next) => {
    // http://localhost:8080/api/users/register
    // req.originalUrl -> api/users/register
    const error = new Error(`Not found - ${req.originalUrl}`);

    res.status(404);
    next(error);
}

const errorHandler = (err, req, res, next) => {
    if(res.headersSent) return next(err)

    // const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // res.status(statusCode).json({
    //     message: err.message || "Une erreur inconnue s'est produite.",
    //     stack: process.env.NODE_ENV === 'production' ? null : err.stack
    // });

    res.status(err.code || 500).json({
        message: err.message || "Une erreur inconnue s'est produite.",
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

module.exports = {
    notFound,
    errorHandler
};
