const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
// const fileUpload = require('express-fileupload');

//Inisiasi port yang akan dipakai
const PORT = 3000;

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
    });
});

// require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/attendance.routes')(app);
require('./app/routes/leaveType.routes')(app);
require('./app/routes/claimType.routes')(app);

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})