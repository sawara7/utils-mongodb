export declare type mongoDocumentType = any;
export declare type callbackMongoDocument = (doc: mongoDocumentType) => void;
export declare class MongodbManagerClass {
    private db;
    private url;
    private client;
    constructor(db: string, url?: string);
    connect(): Promise<boolean>;
    close(): Promise<boolean>;
    insert(collection: string, docs: mongoDocumentType): Promise<string>;
    insertAny(collection: string, data: mongoDocumentType): Promise<boolean>;
    insertBulk(collection: string, data: mongoDocumentType[]): Promise<boolean>;
    update(collection: string, filter: mongoDocumentType, data: mongoDocumentType): Promise<boolean>;
    upsert(collection: string, filter: mongoDocumentType, data: mongoDocumentType): Promise<boolean>;
    find(collection: string, filter?: mongoDocumentType): Promise<mongoDocumentType[]>;
    watch(collection: string, array: mongoDocumentType[], callback: callbackMongoDocument): Promise<void>;
    isExistDocument(collection: string, doc: mongoDocumentType): Promise<boolean>;
}
