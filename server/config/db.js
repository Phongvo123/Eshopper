const mongoose = require('mongoose')
const colors = require('colors')
const connectDB = async () => {
    try{
        const connect = await mongoose.connect(process.env.MONGO_URL)
        console.log(
            `Conneted To Mongodb Databse ${connect.connection.host}`.bgMagenta.white
        )
    }catch(error){
        console.log(`Errro in Mongodb ${error}`.bgRed.white);
    }
}
module.exports = connectDB