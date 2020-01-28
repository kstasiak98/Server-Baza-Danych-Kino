const express = require('express');
const sql = require('mssql');
var mysql     =    require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
let FilmID = 0;
let SeansID = 2;
let LastPlace=1;

//Aby odczytywać request body z axios
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

//aby pobierać dane z serwera
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT,    PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

const connnect = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'baza_kino1',
    port: 3306,
});

app.get('/', (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header('Access-Control-Allow-Credentials', true);
    connnect.query('SELECT * FROM klienci', function (error, rows, fields) {
        if(!!error){
            console.log('ERROR');
        } else {
            res.send(rows);
        }
    });
    // request.query('select * from books')
    //     .then(result => {
    //         res.send(result.recordset);
    //     });
});
app.get('/all', (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header('Access-Control-Allow-Credentials', true);
    connnect.query('SELECT * FROM klienci', function (error, rows, fields) {
        if(!!error){
            console.log('ERROR');
        } else {
            res.send(rows);
        }
    });
    // request.query('select * from books')
    //     .then(result => {
    //         res.send(result.recordset);
    //     });
});
app.get('/zamowienia', (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header('Access-Control-Allow-Credentials', true);
    connnect.query('SELECT * FROM zamowienia', function (error, rows, fields) {
        if(!!error){
            console.log('ERROR');
        } else {
            res.send(rows);
        }
    });
});
app.get('/data', (req, res) => {
    const text = "INSERT INTO klienci(imie,nazwisko,punkty,login,email,haslo) values ('ADAM','Nowy',5,'Kocio1423', 'kamias@wp.pl', 'utala99@!');"
    connnect.query(text,function (err, result) {
        if(err) throw err;
        console.log("add record");
    })
});
app.post('/insert1', (req, res) => {
    console.log('dostalem requestc 1');
    console.log(req.body);
    const klient_id = req.body.klient_id;
    const produkt_id = 1;
    const seans_id = req.body.seans;
    connnect.query(`INSERT INTO zamowienia(seans_id,produkt_id,klient_id) values ('${seans_id}','${produkt_id}','${klient_id}');`,function (err, result) {
        if(err) throw err;
        console.log('ADD RECORD insert 1');
    });
});
app.get('/insert2', (req, res) => {
    console.log('WYKONUJE INSERT 2');
    connnect.query('SELECT id from zamowienia order by id desc LIMIT 1;', function (errr, rows, fields) {
        res.send(rows);
        console.log(rows);
        LastPlace = rows[0].id;
        console.log('Lastplace:', LastPlace);
    });
});
app.post('/insert3', (req, res) => {
    setTimeout(() => res.status(201).send(), 200);
    console.log('Dostałem request 2');
    console.log(req.body);
    const m = req.body.miejsce_id;
    console.log('m:',m);
    console.log("Lastplace", LastPlace);
    connnect.query(`INSERT INTO bilet(zamowienie_id,miejsce_id) values ('${LastPlace}', '${m}')`,function (err, result1) {
        if(err) throw err;
        console.log('ADD RECORD insert 3');
    });
});
app.get('/logins', (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header('Access-Control-Allow-Credentials', true);

    // connnect.query('SELECT login,haslo,id FROM klienci', function (error, rows, fields) {
    //     if(!!error){
    //         console.log('ERROR');
    //     } else {
    //         res.send(rows);

    //     }
    // });
    // request.query('select * from books')
    //     .then(result => {
    //         res.send(result.recordset);
    //     });
});

app.get('/log', (req, res) => {
    connnect.query('SELECT * FROM bilety', function (error, rows, fields) {
        if(!!error){
            console.log('ERROR');
        } else {
            res.send(rows);
        }
    });
});

app.post('/cart', (req, res) =>{
    console.log('dostalem request');
    var x = req.body;

    const text = `INSERT INTO klienci(imie,nazwisko,punkty,login,email,haslo) values ('NowyKlient','NowyKlient',0,'${x.login}', '${x.email}', '${x.password}');`
    connnect.query(text,function (err, result) {
        if(err) throw err;
        console.log("add record", x);
    });
        setTimeout(() => res.status(201).send(), 800)
});


app.post('/films', (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header('Access-Control-Allow-Credentials', true);
    console.log(req.body);
    var x = req.body;
    FilmID = x.id;
});

app.get('/filmID', (req, res) => {
    connnect.query(`SELECT * FROM seanse WHERE film_id = ${FilmID} order by data1;`, function (error, rows, fields) {
        if(!!error){
            console.log('ERROR');
        } else {
            res.send(rows);
        }
    });
});

app.post('/receiveSID', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header('Access-Control-Allow-Credentials', true);
    console.log('Z SID', req.body);
    var x = req.body;
    SeansID = x.id;
    next();
});

app.get('/seansID', (req, res) => {
    connnect.query(`SELECT miejsce_id FROM zaj_miejsca WHERE seans_id = ${SeansID} order by miejsce_id;`, function (error, rows, fields) {
        if(!!error){
            console.log('ERROR');
        } else {
            res.send(rows);
        }
    });
});
app.get('/sqlGet', (req, res) =>{
    var userId = 'some user provided value';
    var sql    = 'SELECT * FROM users WHERE id = ' + connection.escape(userId);
    connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        // ...
    })
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
