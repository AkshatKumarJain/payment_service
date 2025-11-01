import express from "express"
import "dotenv/config.js"
import router from "./routes/payments.routes.js";

const app = express();
const port = process.env.PORT || 8005;

app.use("/api/payments", router);

app.listen(port, () => {
    console.log(`The server is running at port: ${port}.`);
});
