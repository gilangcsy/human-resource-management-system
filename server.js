const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
// const fileUpload = require('express-fileupload');

//Inisiasi port yang akan dipakai
const PORT = process.env.PORT || 3068;

//Memanggil model
const db = require('./app/models/index.model');
const { fstat } = require('fs');

//Deklarasi express.js
const app = express();

app.use(cors());


// parse application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/storage', express.static('storage'));

// app.use(forms.array());

// Migrasi tabel yang ada dalam setiap model
db.sequelize.sync({ force: false });

//Inisasi routing pada halaman awal
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to HR Management App!'
    })
})

// require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app)
require('./app/routes/auth.routes')(app)
require('./app/routes/attendance.routes')(app)
require('./app/routes/leaveType.routes')(app)
require('./app/routes/claimType.routes')(app)
require('./app/routes/approvalTemplate.routes')(app)
require('./app/routes/leave.routes')(app)
require('./app/routes/role.routes')(app)
require('./app/routes/approvalAuthorization.routes')(app)
require('./app/routes/roleMenu.routes')(app)
require('./app/routes/menu.routes')(app)
require('./app/routes/claim.routes')(app)
require('./app/routes/visualization.routes')(app)

// app.listen(PORT, () => {
//     console.log(`Server is running on PORT ${PORT}`);
// })


// ------ Update ---------- //
//Inisasi routing pada halaman awal
app.use('/', (req, res, next) => {
    res.send('Welcome to IDS Intranet! API is Ready.')
})

https.createServer({
    key:    fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert:   fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}, app).listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})
