export function getMongoEqual(field: string, value: number): Object {
    const result: Object = {field: {$eq: value}}
    return result
}

export function getMongoGreaterThan(field: string, value: number): Object {
    const result: Object = {field: {$gt: value}}
    return result
}

export function getMongoLessThan(field: string, value: number): Object {
    const result: Object = {field: {$lt: value}}
    return result
}