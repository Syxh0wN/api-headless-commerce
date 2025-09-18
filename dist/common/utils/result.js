"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFailure = exports.isSuccess = exports.failure = exports.success = void 0;
const success = (data) => ({
    success: true,
    data,
});
exports.success = success;
const failure = (error) => ({
    success: false,
    error,
});
exports.failure = failure;
const isSuccess = (result) => {
    return result.success;
};
exports.isSuccess = isSuccess;
const isFailure = (result) => {
    return !result.success;
};
exports.isFailure = isFailure;
//# sourceMappingURL=result.js.map