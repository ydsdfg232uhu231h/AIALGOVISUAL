import {connect, disconnect} from "mongoose";

export async function handleconnecttosdb(){
    try {
        await connect(process.env.MONGODB_URL);
    } catch (error) {
        console.log("DB error",error);
        throw new Error("Can't connect to DB");
    }
}

export async function handledisconnecttodb(){
    try {
        await disconnect();
    } catch (error) {
        console.log("can't disconnect DB ", error);
        throw new Error("Can't disconnect to DB");
    }
}