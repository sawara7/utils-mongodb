import {
    MongoAPIError,
    MongoClient
} from "mongodb"

export type mongoDocumentType = any
export type callbackMongoDocument = (doc: mongoDocumentType) => void
export type mongoResult<T> = {
    result: boolean
    data?: T
}

export class MongodbManagerClass {
    private client: MongoClient;

    /**
     * constructor
     */
    constructor(private dbName: string, private url: string = "mongodb://localhost:27017/"){
        this.client = new MongoClient(this.url)
        this.client.addListener
    }

    outputErrorLog(msg: string): string {
        return "[utils-mongodb]" + msg
    }

    /**
     * connect
     */
    async connect(): Promise<boolean> {
        let res = false
        try {
            await this.client.connect()
            res = true
        } catch(e) {
            if (e instanceof Error) {
                this.outputErrorLog(e.message)
            }
            res = false
        }
        return res
    }

    /**
     * close
     */
    async close(): Promise<boolean>{
        let res = false
        try {
            await this.client.close()
        } catch(e) {
            if (e instanceof Error) {
                this.outputErrorLog(e.message)
            }
            res = false
        }
        return res
    }

    /**
     * insert
     */
    async insert(collection: string, docs: mongoDocumentType): Promise<mongoResult<string>> {
        try {
            const res = await this.client.db(this.dbName).collection(collection).insertOne(docs)
            return {
                result: true,
                data: res.insertedId.toString()
            }
        } catch(e) {
            if (e instanceof MongoAPIError) {
                this.outputErrorLog(e.message)
            }
            return {
                result: false
            }
        }
    }

    /**
     * insertAny
     */
    async insertAny(collection: string, data: mongoDocumentType): Promise<mongoResult<boolean>> {
        try {
            const res = await this.client.db(this.dbName).collection(collection).insertOne(data)
            return {
                result: true,
                data: res.acknowledged
            }
        } catch(e) {
            if (e instanceof MongoAPIError) {
                this.outputErrorLog(e.message)
            }
            return {
                result: false
            }
        }
    }

    /**
     * insertBulk
     */
    async insertBulk(collection: string, data: mongoDocumentType[]): Promise<mongoResult<boolean>> {
        try {
            const res = await this.client.db(this.dbName).collection(collection).insertMany(data)
            return {
                result: true,
                data: res.acknowledged
            }
        } catch(e) {
            if (e instanceof MongoAPIError) {
                this.outputErrorLog(e.message)
            }
            return {
                result: false
            }
        }
    }

    /**
     * update
     */
    async update(collection: string, filter: mongoDocumentType, data: mongoDocumentType): Promise<mongoResult<boolean>> {
        try {
            const res = await this.client.db(this.dbName).collection(collection).updateOne(filter, {$set:data})
            return {
                result: true,
                data: res.acknowledged
            }
        } catch(e) {
            if (e instanceof MongoAPIError) {
                this.outputErrorLog(e.message)
            }
            return {
                result: false
            }
        }
    }

    /**
     * upsert
     */
    async upsert(collection: string, filter: mongoDocumentType, data: mongoDocumentType): Promise<mongoResult<boolean>> {
        try {
            const res = await this.client.db(this.dbName).collection(collection).updateOne(filter, data, {upsert: true})
            return {
                result: true,
                data: res.acknowledged
            }
        } catch(e) {
            if (e instanceof MongoAPIError) {
                this.outputErrorLog(e.message)
            }
            return {
                result: false
            }
        }
    }

    /**
     * find
     */
    async find(collection: string, filter: mongoDocumentType = {}): Promise<mongoResult<mongoDocumentType[]>> {
        const result: mongoDocumentType[] = []
        try {
            const res = await this.client.db(this.dbName).collection(collection).find(filter).toArray()
            for (const val of res){
                result.push(val as mongoDocumentType);
            }
            return {
                result: true,
                data: result
            }
        } catch(e) {
            if (e instanceof MongoAPIError) {
                this.outputErrorLog(e.message)
            }
            return {
                result: false
            }
        }
    }

    /**
     * watch
     */
    async watch(collection: string, array: mongoDocumentType[], callback: callbackMongoDocument): Promise<void> {
        const res = await this.client.db(this.dbName).collection(collection).watch(array);
        const baseCallback = (value: any) => {
            const response = value as mongoDocumentType;
            if(!response){return};
            if (response['fullDocument']){
                callback(response['fullDocument'] as mongoDocumentType);
            }else if (response['updateDescription'] && response['updateDescription']['updatedFields']){
                const res = response['updateDescription']['updatedFields'];
                res['_id'] = response['documentKey']['_id'];
                callback(response['updateDescription']['updatedFields'] as mongoDocumentType);
            }
        };
        res.on("change", baseCallback);
    }

    /**
     * isExistDocument
     */
    async isExistDocument(collection: string, doc:mongoDocumentType): Promise<mongoResult<boolean>> {
        try {
            const res = await this.client.db(this.dbName).collection(collection).findOne(doc)
            const result = res? true: false
            return {
                result: true,
                data: result
            }
        } catch(e) {
            if (e instanceof MongoAPIError) {
                this.outputErrorLog(e.message)
            }
            return {
                result: false
            }
        }
    }
}

/**
* getMongoDBClient
*/
export async function getMongoDBClient(db: string): Promise<MongodbManagerClass> {
    const mongo = new MongodbManagerClass(db)
    await mongo.connect()
    return mongo
}