class OptimizerError extends Error {
    constructor({ status, msg }) {
        super(msg);
        this.error = true;
        this.name = 'OptimizerError';
        this.message = msg;
        this.status = status;
    }
}

module.exports = OptimizerError;