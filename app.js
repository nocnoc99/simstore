//require express
var express = require('express');
//khởi tạo express
var app = express();
var path = require('path');
// Khai báo static file
app.use(express.static('assets'))
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.set('view engine', 'ejs');
var user = false;
// index page 

// ########################## Các trang hiển thị ##############################

app.get('/', function (req, res) {
    if (user == false) res.redirect('/login');

    if (req.query.hasOwnProperty('search')) {
        var search = req.query.search;
    }

    // truy vấn database để lấy dữ liệu đổ ra trang web
    var sql1 = "SELECT sim_id, number, seri, price, telecoms.name from sims INNER JOIN telecoms ON sims.telecom_id=telecoms.telecom_id ORDER BY sim_id ASC;";
    // thực hiện truy vấn
    conn.query(sql1, function (err, results) {
        if (err) throw err;
        // console.log(results);
        // data trả về đưa vào trang web
        if (!!search) {
            listsearch = [];
            results.forEach(element => {
                console.log(element.number)
                if (element.number.toString().includes(search)) listsearch.push(element);
            });

            res.render('pages/index', { listsim: listsearch, search:search });
        }
        else {
           res.render('pages/index', { listsim: results });
        }
    });
});

app.get('/login', function (req, res) {
    if (user == true) res.redirect('/');
    else res.render('pages/login');
});

app.get('/logout', function (req, res) {
    user = false;
    res.redirect('/login');
});

app.get('/about', function (req, res) {
    if (user == false) res.redirect('/login')
    res.render('pages/about');
});

// #############################################################################

// ########################## Các trang tương tác với database ##############################

app.get('/api/login', function (req, res) {
    // console.log(req.query.username)
    var sql1 = `SELECT * FROM users WHERE username='${req.query.username}' AND password='${req.query.password}'`
    console.log(sql1)
    // thực hiện truy vấn
    conn.query(sql1, function (err, results) {
        console.log(err)
        if (err) throw err;
        // console.log(results);
        // data trả về đưa vào trang web
        console.log('asdasd')
        if (results.length > 0) {
            user = true;
            res.redirect('/')
        }
        else res.redirect('/login')
    });
});

// truy vấn csdl để addsim
app.get('/api/add_sim', function (req, res) {
    console.log('bod', req.query)
    // truy vấn csdl để tạo một sim
    var sql1 = `INSERT INTO sims(telecom_id, number, seri, price) VALUES (${req.query.telecom_id}, ${req.query.number}, ${req.query.seri}, ${req.query.price})`;
    conn.query(sql1, function (err, results) {
        // if (err) throw err;
        // console.log("res",results);
        // tao sim xong thì trở về trang chủ
        res.redirect('/')
    });
    // res.redirect('/')
});

app.get('/api/delete_sim', function (req, res) {
    console.log(req.query)
    var sql1 = `DELETE FROM sims WHERE sim_id=${req.query.sim_id}`;
    conn.query(sql1, function (err, results) {
        res.redirect('/')
    });
});

// ##########################################################################


// about page 
app.get('/about', function (req, res) {
    res.render('pages/about');
}); 

//xét cổng port 8000 cho server
app.listen(8000);

// ket noi co so du lieu
var mysql = require('mysql');
console.log('Get connection ...');
var conn = mysql.createConnection({
    database: 'simstore',
    host: "localhost",
    user: "root",
    password: ""
});
conn.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

function getAllSims() {
    // test query sql
    var sql1 = "SELECT * FROM sims";
    let res;
    conn.query(sql1, function (err, results) {
        // if (err) throw err;
        console.log(results);
        res = results;
    });
    return res;
}

app.get('/public/home.html', function (req, res) {
    var sql = "SELECT * FROM sims";
    conn.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results);
    });
});

