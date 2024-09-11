import { MongodbManagerClass } from "./client"

const mongo = new MongodbManagerClass('ticker_collection')

const sampleset = async ()=> {
    const d = new Date()
    const latest = d.getTime()
    d.setMinutes(d.getMinutes() - 30)
    const last5min = d.getTime()
    console.log(last5min)
    const result = await mongo.find("ticker/BTCUSDT", {
        "timeStamp": {
            $gt: last5min
            ,$lt: latest
        }
    })
    console.log(result.data)
}

(async()=>{
    console.log(await mongo.connect())
    await sampleset()
    // console.log(await mongo.find('testtest'))
})()
