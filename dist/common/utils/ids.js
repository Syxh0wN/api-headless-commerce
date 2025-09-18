"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUuid = exports.generateShortId = exports.generateId = void 0;
const crypto_1 = require("crypto");
const generateId = () => {
    return (0, crypto_1.randomBytes)(16).toString('hex');
};
exports.generateId = generateId;
const generateShortId = () => {
    return (0, crypto_1.randomBytes)(8).toString('hex');
};
exports.generateShortId = generateShortId;
const generateUuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
exports.generateUuid = generateUuid;
//# sourceMappingURL=ids.js.map