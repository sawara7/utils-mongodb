export type mongoDocumentType = any;
export type callbackMongoDocument = (doc: mongoDocumentType) => void;
export type mongoResult<T> = {
    result: boolean;
    data?: T;
};
export declare class MongodbManagerClass {
    private dbName;
    private url;
    private client;
    /**
     * constructor
     */
    constructor(dbName: string, url?: string);
    outputErrorLog(msg: string): string;
    /**
     * connect
     */
    connect(): Promise<boolean>;
    /**
     * close
     */
    close(): Promise<boolean>;
    /**
     * insert
     */
    insert(collection: string, docs: mongoDocumentType): Promise<mongoResult<string>>;
    /**
     * insertAny
     */
    insertAny(collection: string, data: mongoDocumentType): Promise<mongoResult<boolean>>;
    /**
     * insertBulk
     */
    insertBulk(collection: string, data: mongoDocumentType[]): Promise<mongoResult<boolean>>;
    /**
     * update
     */
    update(collection: string, filter: mongoDocumentType, data: mongoDocumentType): Promise<mongoResult<boolean>>;
    /**
     * upsert
     */
    upsert(collection: string, filter: mongoDocumentType, data: mongoDocumentType): Promise<mongoResult<boolean>>;
    /**
     * find
     */
    find(collection: string, filter?: mongoDocumentType): Promise<mongoResult<mongoDocumentType[]>>;
    /**
     * watch
     */
    watch(collection: string, array: mongoDocumentType[], callback: callbackMongoDocument): Promise<void>;
    /**
     * isExistDocument
     */
    isExistDocument(collection: string, doc: mongoDocumentType): Promise<mongoResult<boolean>>;
}
/**
* getMongoDBClient
*/
export declare function getMongoDBClient(db: string): Promise<MongodbManagerClass>;
