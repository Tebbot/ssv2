const childProcess = require("child_process")
const mongoose = require("mongoose")


require("dotenv").config()


mongoose.connect(process.env.CONNECTIONSTRING).then(() => {
    console.log("Connected to db! Starting backend.")
    childProcess.fork('./backend/index')
})










