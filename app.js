const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs/promises');
const Weather = require('./weather.js');
const weather = new Weather();
const port = 3000;

app.use(express.json() );       // to support JSON-encoded bodies
app.use(express.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// Set Pug for templating
app.set('view engine', 'pug');
app.set('views','./views');

// Load user.json file for login 
let users = getUsers();
async function getUsers() {
    let list = await fs.readFile('./users.json');
    return JSON.parse(list);
}

// Check if user login is correct
async function checkLogin(username, password) {
    return users.then((list) => {
        login = false;
        if(list[username] != undefined) {
            if(list[username] == password) {
                login = true;
            }
        }

        return login;
    });
}

// Root directory redirect
app.get('/', (req, res) => {
    res.redirect('/login');
  });

// GET login page
app.get('/login', (req, res) => {
    res.render('login');
});

// POST login info
app.post('/weather', (req, res) => {
    username = req.body.username;
    password = req.body.password;

    checkLogin(username, password).then((exists) => {
        if(exists) {
            res.render('map');
        } else {
            res.redirect('/login');
        }
    });

});

// GET signup page
app.get('/signup', (req, res) => {
    res.render('signup');
});

// POST signup info
app.post('/signup', (req, res) => {
    username = req.body.username;
    password = req.body.password;

    checkLogin(username, password).then((exists) => {
        if(!exists) {
            users.then(list => {
                list[username] = password;
            });
        } 
        res.redirect('/login');
    });

});

// GET map.js script for map page
app.get('/public/map.js', (req, res) => {
    res.sendFile('/public/map.js', {root: __dirname})
});

// GET styles.css
app.get('/public/styles.css', (req, res) => {
    res.sendFile('/public/styles.css', {root: __dirname})
});

// GET list of cities
app.get('/weather/cities', (req, res) => {

    let cities = {"cities": weather.getCityList()};
    res.send(cities);
});

// Get weather for city
app.get('/weather/:city', (req, res) => {

    weather.getCityWeather(req.params.city).then(cityWeather => {
        res.send(cityWeather);
    });

}); 

// Add a city
app.post('/weather/addcity', (req, res) => {
    weather.getCityWeather(req.body.city).then(cityWeather => {
        res.render('map');
    });
});




app.listen(port, () => {
    console.log(`Serving weather service app at http://localhost:${port}`);
});
