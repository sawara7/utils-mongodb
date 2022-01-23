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
exports.getMongoDBClient = exports.MongodbManagerClass = void 0;
const mongodb_1 = require("mongodb");
class MongodbManagerClass {
    constructor(db, url = "mongodb://localhost:27017/") {
        this.db = db;
        this.url = url;
        const connectOption = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        this.client = new mongodb_1.MongoClient(this.url, connectOption);
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.connect();
            return this.client.isConnected();
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.close();
            return !this.client.isConnected();
        });
    }
    insert(collection, docs) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.db(this.db).collection(collection).insertOne(docs);
            return res.insertedId;
        });
    }
    insertAny(collection, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.db(this.db).collection(collection).insertOne(data);
            return res.result.ok === 1;
        });
    }
    insertBulk(collection, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.db(this.db).collection(collection).insertMany(data);
            return res.result.ok === 1;
        });
    }
    update(collection, filter, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.db(this.db).collection(collection).updateOne(filter, { $set: data });
            return res.result.ok === 1;
        });
    }
    upsert(collection, filter, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.db(this.db).collection(collection).update(filter, data, { upsert: true });
            return res.result.ok === 1;
        });
    }
    find(collection, filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            const res = yield this.client.db(this.db).collection(collection).find(filter).toArray();
            for (const val of res) {
                result.push(val);
            }
            return result;
        });
    }
    watch(collection, array, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.db(this.db).collection(collection).watch(array);
            const baseCallback = (value) => {
                const response = value;
                if (!response) {
                    return;
                }
                ;
                if (response['fullDocument']) {
                    callback(response['fullDocument']);
                }
                else if (response['updateDescription'] && response['updateDescription']['updatedFields']) {
                    const res = response['updateDescription']['updatedFields'];
                    res['_id'] = response['documentKey']['_id'];
                    callback(response['updateDescription']['updatedFields']);
                }
            };
            res.on("change", baseCallback);
        });
    }
    isExistDocument(collection, doc) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.db(this.db).collection(collection).findOne(doc);
            const result = res ? true : false;
            return result;
        });
    }
}
exports.MongodbManagerClass = MongodbManagerClass;
function getMongoDBClient(db) {
    return __awaiter(this, void 0, void 0, function* () {
        const mongo = new MongodbManagerClass(db);
        yield mongo.connect();
        return mongo;
    });
}
exports.getMongoDBClient = getMongoDBClient;
