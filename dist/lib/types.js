"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMongoEqual = getMongoEqual;
exports.getMongoGreaterThan = getMongoGreaterThan;
exports.getMongoLessThan = getMongoLessThan;
function getMongoEqual(field, value) {
    const result = { field: { $eq: value } };
    return result;
}
function getMongoGreaterThan(field, value) {
    const result = { field: { $gt: value } };
    return result;
}
function getMongoLessThan(field, value) {
    const result = { field: { $lt: value } };
    return result;
}
