"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
const mongo = new client_1.MongodbManagerClass('fxbot');
const sampleset = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongo.insert('sample', { abcde: 1234 });
    yield mongo.update('sample', { abcde: 1234 }, { abcde: 1 });
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongo.connect();
    yield sampleset();
    console.log(yield mongo.find('sample'));
}))();
