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
    /**
     * constructor
     */
    constructor(dbName, url = "mongodb://localhost:27017/") {
        this.dbName = dbName;
        this.url = url;
        this.client = new mongodb_1.MongoClient(this.url);
        this.client.addListener;
    }
    /**
     * connect
     */
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = false;
            try {
                yield this.client.connect();
                res = true;
            }
            catch (e) {
                if (e instanceof Error) {
                    console.log(e.message);
                }
                res = false;
            }
            return res;
        });
    }
    /**
     * close
     */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = false;
            try {
                yield this.client.close();
            }
            catch (e) {
                if (e instanceof Error) {
                    console.log(e.message);
                }
                res = false;
            }
            return res;
        });
    }
    /**
     * insert
     */
    insert(collection, docs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.client.db(this.dbName).collection(collection).insertOne(docs);
                return {
                    result: true,
                    data: res.insertedId.toString()
                };
            }
            catch (e) {
                if (e instanceof mongodb_1.MongoAPIError) {
                    console.log(e.message);
                }
                return {
                    result: false
                };
            }
        });
    }
    /**
     * insertAny
     */
    insertAny(collection, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.client.db(this.dbName).collection(collection).insertOne(data);
                return {
                    result: true,
                    data: res.acknowledged
                };
            }
            catch (e) {
                if (e instanceof mongodb_1.MongoAPIError) {
                    console.log(e.message);
                }
                return {
                    result: false
                };
            }
        });
    }
    /**
     * insertBulk
     */
    insertBulk(collection, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.client.db(this.dbName).collection(collection).insertMany(data);
                return {
                    result: true,
                    data: res.acknowledged
                };
            }
            catch (e) {
                if (e instanceof mongodb_1.MongoAPIError) {
                    console.log(e.message);
                }
                return {
                    result: false
                };
            }
        });
    }
    /**
     * update
     */
    update(collection, filter, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.client.db(this.dbName).collection(collection).updateOne(filter, { $set: data });
                return {
                    result: true,
                    data: res.acknowledged
                };
            }
            catch (e) {
                if (e instanceof mongodb_1.MongoAPIError) {
                    console.log(e.message);
                }
                return {
                    result: false
                };
            }
        });
    }
    /**
     * upsert
     */
    upsert(collection, filter, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.client.db(this.dbName).collection(collection).updateOne(filter, data, { upsert: true });
                return {
                    result: true,
                    data: res.acknowledged
                };
            }
            catch (e) {
                if (e instanceof mongodb_1.MongoAPIError) {
                    console.log(e.message);
                }
                return {
                    result: false
                };
            }
        });
    }
    /**
     * find
     */
    find(collection, filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            try {
                const res = yield this.client.db(this.dbName).collection(collection).find(filter).toArray();
                for (const val of res) {
                    result.push(val);
                }
                return {
                    result: true,
                    data: result
                };
            }
            catch (e) {
                if (e instanceof mongodb_1.MongoAPIError) {
                    console.log(e.message);
                }
                return {
                    result: false
                };
            }
        });
    }
    /**
     * watch
     */
    watch(collection, array, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.db(this.dbName).collection(collection).watch(array);
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
    /**
     * isExistDocument
     */
    isExistDocument(collection, doc) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.client.db(this.dbName).collection(collection).findOne(doc);
                const result = res ? true : false;
                return {
                    result: true,
                    data: result
                };
            }
            catch (e) {
                if (e instanceof mongodb_1.MongoAPIError) {
                    console.log(e.message);
                }
                return {
                    result: false
                };
            }
        });
    }
}
exports.MongodbManagerClass = MongodbManagerClass;
/**
* getMongoDBClient
*/
function getMongoDBClient(db) {
    return __awaiter(this, void 0, void 0, function* () {
        const mongo = new MongodbManagerClass(db);
        yield mongo.connect();
        return mongo;
    });
}
exports.getMongoDBClient = getMongoDBClient;
