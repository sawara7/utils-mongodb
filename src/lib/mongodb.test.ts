import { MongodbManagerClass } from "./client"

const mongo = new MongodbManagerClass('test')

const sampleset = async ()=> {
    await mongo.insert('sample', {abcde: 1234})
    await mongo.update('sample', {abcde: 1234}, {abcde: 1})
}

(async()=>{
    await mongo.connect()
    await sampleset()
    console.log(await mongo.find('sample'))
})()
