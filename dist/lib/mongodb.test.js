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
const mongo = new client_1.MongodbManagerClass('ticker_collection');
const sampleset = () => __awaiter(void 0, void 0, void 0, function* () {
    const d = new Date();
    const latest = d.getTime();
    d.setMinutes(d.getMinutes() - 30);
    const last5min = d.getTime();
    console.log(last5min);
    const result = yield mongo.find("ticker/BTCUSDT", {
        "timeStamp": {
            $gt: last5min,
            $lt: latest
        }
    });
    console.log(result.data);
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongo.connect();
    yield sampleset();
    // console.log(await mongo.find('testtest'))
}))();
