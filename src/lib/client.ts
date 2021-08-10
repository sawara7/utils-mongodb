import {
    MongoClient
} from "mongodb";
export type mongoDocumentType = any;
export type callbackMongoDocument = (doc: mongoDocumentType) => void;
export class MongodbManagerClass {
    private client: MongoClient;
    constructor(private db: string, private url: string = "mongodb://localhost:27017/"){
        const connectOption = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
        this.client = new MongoClient(this.url, connectOption);
    }

    async connect(): Promise<boolean>{
        await this.client.connect();
        return this.client.isConnected();
    }

    async close(): Promise<boolean>{
        await this.client.close();
        return !this.client.isConnected();
    }

    async insert(collection: string, docs: mongoDocumentType): Promise<string>{
        const res = await this.client.db(this.db).collection(collection).insertOne(docs);
        return res.insertedId;
    }

    async insertAny(collection: string, data: mongoDocumentType): Promise<boolean>{
        const res = await this.client.db(this.db).collection(collection).insertOne(data);
        return res.result.ok === 1;
    }

    async insertBulk(collection: string, data: mongoDocumentType[]): Promise<boolean>{
        const res = await this.client.db(this.db).collection(collection).insertMany(data);
        return res.result.ok === 1;
    }

    async update(collection: string, filter: mongoDocumentType, data: mongoDocumentType): Promise<boolean>{
        const res = await this.client.db(this.db).collection(collection).updateOne(filter, {$set:data});
        return res.result.ok === 1;
    }

    async upsert(collection: string, filter: mongoDocumentType, data: mongoDocumentType): Promise<boolean>{
        const res = await this.client.db(this.db).collection(collection).update(filter, data, {upsert: true});
        return res.result.ok === 1;
    }

    async find(collection: string, filter: mongoDocumentType = {}): Promise<mongoDocumentType[]>{
        const result: mongoDocumentType[] = [];
        const res = await this.client.db(this.db).collection(collection).find(filter).toArray();

        for (const val of res){
            result.push(val as mongoDocumentType);
        }
        return result;
    }

    async watch(collection: string, array: mongoDocumentType[], callback: callbackMongoDocument): Promise<void>{
        const res = await this.client.db(this.db).collection(collection).watch(array);
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

    async isExistDocument(collection: string, doc:mongoDocumentType): Promise<boolean>{
        const res = await this.client.db(this.db).collection(collection).findOne(doc);
        const result = res? true: false;
        return result;
    }
}
