const express = require("express")
const bodyParser = require("body-parser")

const app = express()

app.use(bodyParser.json())

app.use("/api/ranking", require("./Endpoints/api"));
app.use("/simpleservice", require("./Endpoints/private"))



app.listen(5000, () => {
    console.log("Backend started on port 5000!")
})

