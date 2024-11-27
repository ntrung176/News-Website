const express = require('express')

const app = express()
const port = 5000

//Listen on port 5000
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`)
})