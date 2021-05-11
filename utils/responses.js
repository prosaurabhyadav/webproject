function sendErrorResponse(res, statusCode, message) {
    res.status(statusCode).send({ message: message, statusCode: statusCode }).end();
}
exports.sendErrorResponse = function(res, statusCode, message) {
    sendErrorResponse(res, statusCode, message);
};

exports.sendSuccessResponse = function(res, message) {
    res.status(200).send(message).end();
};