const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
// const fileUpload = require('express-fileupload');

//Inisiasi port yang akan dipakai
const PORT = process.env.PORT || 3068;

//Memanggil model
const db = require('./app/models/index.model');

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

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})