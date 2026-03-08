import mongoose from "mongoose";

const connectToMongo = () => {
    try {
        mongoose.connect(process.env.mongoURI)
        console.log('Connected to mongo successfully')
    } catch (error) {
        console.error(`can't connect to mongo ${error}`)
    }
}

export default connectToMongo