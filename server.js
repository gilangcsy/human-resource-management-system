const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const https = require("https")
const path = require("path")
const fs = require("fs")
const morgan = require('morgan')

//Inisiasi port yang akan dipakai
const PORT = process.env.PORT || 3068

//Memanggil model
const db = require("./app/models/index.model")
const { fstat } = require("fs")

//Deklarasi express.js
const app = express()
// let whitelist = ["http://127.0.0.1", "http://example2.com"]
// let corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true)
//         } else {
//             callback(("You are not allowed to access this API."))
//         }
//     },
// }

app.use(cors())

app.use(morgan(':method :url :status - :response-time ms'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/storage", express.static("storage"))

// app.use(forms.array())

// Migrasi tabel yang ada dalam setiap model
db.sequelize.sync({ force: false })

// require('./app/routes/auth.routes')(app)
require("./app/routes/user.routes")(app)
require("./app/routes/auth.routes")(app)
require("./app/routes/attendance.routes")(app)
require("./app/routes/leaveType.routes")(app)
require("./app/routes/claimType.routes")(app)
require("./app/routes/approvalTemplate.routes")(app)
require("./app/routes/leave.routes")(app)
require("./app/routes/role.routes")(app)
require("./app/routes/approvalAuthorization.routes")(app)
require("./app/routes/roleMenu.routes")(app)
require("./app/routes/menu.routes")(app)
require("./app/routes/claim.routes")(app)
require("./app/routes/visualization.routes")(app)
require("./app/routes/taskManagement.routes")(app)
require("./app/routes/news.routes")(app)
require("./app/routes/department.routes")(app)

//Inisasi routing pada halaman awal
app.use("/", (req, res, next) => {
    res.json("Welcome to IDS Intranet! API is Ready.")
})

https
    .createServer(
        {
            key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
            cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
        },
        app
    )
    .listen(PORT, () => {
        console.log(`Server is running on PORT ${PORT}`)
    })
