import express from "express"
import "dotenv/config.js"

const app = express();
const port = process.env.PORT || 8005;

app.listen(port, () => {
    console.log(`The server is running at port: ${port}.`);
});
