import { config } from "dotenv";
config();
import { handleconnecttosdb } from "./db/db.js";
import app from "./app.js";


const port = process.env.PORT;

handleconnecttosdb().then(()=> {
    app.listen(port,()=> console.log("data is connected"));
});

    