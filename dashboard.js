const request = require('request');
const express = require('express');
const app = express();
var mysql = require('mysql');
var parser = require('body-parser');
var Promise = require('promise');

var con = mysql.createConnection({
  host: "localhost",
  user: "adel",
  password: "adel",
  database: "dashboard"
});

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(parser.urlencoded({extended:true}));

app.get('/', function (req, res) {
        res.render('home', {dislike: null, comment: null, likes: null, views: null, pressure: null, wind: null, temp: null, humidity: null, error: null});
});

app.get('/inscription', function (req, res) {
res.render('inscription');
});

app.post('/inscription', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    var values = [
        [email, password]
    ];
    var sql = "INSERT INTO user_information(email, password) VALUES ?";
    con.query(sql, [values], function (err, result) {
        if (err)
            res.render('inscription');
        else
            res.render('home', {dislike: null, comment: null, likes: null, views: null, pressure: null, wind: null, temp: null, humidity: null, error: null});
    });
});

app.get('/connexion', function (req, res) {
    res.render('connexion');
});

app.post('/connexion', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    con.query('SELECT * FROM user_information WHERE email = ?', [email], function (error, results, fields) {
        if (error) {
            console.log("Error, try again",error);
            res.render('connexion');
        } else {
            if (results.length > 0) {
                if (results[0].password == password) {
                    console.log("Connection successfull");
                    res.render('home', {dislike: null, comment: null, likes: null, views: null, pressure: null, wind: null, temp: null, humidity: null, error: null});
                }
                else {
                    console.log("Email or password is wrong");
                    res.render('connexion');
                }
            }
            else {
                console.log("Email is wrong");
                res.render('connexion');
                }
            }
    });
});


app.post('/youtubeLikes', function (req, res) {

    let apiKey = 'AIzaSyDZVEUIqbjrDE3QZdHTQY05-zFM7NPJKoQ';
    let research = req.body.likes;
    let urlsearch = `https://www.googleapis.com/youtube/v3/search?q=${research}&part=snippet&key=${apiKey}&maxResults=1&type=video`;

    var get = new Promise(function(resolve, reject) {
        request(urlsearch, function (err, response, body) {
            if(err){
                console.log('Error at the first request');
                reject(err);
            } else {
                var json = JSON.parse(body);
                resolve(json);
            }
        });
    }).then(function(resolve, reject) {
        new Promise(function (res, rej) {
            var urlvideo = `https://www.googleapis.com/youtube/v3/videos?part=statistics&order=relevance&maxResults=1&id=${resolve.items[0].id.videoId}&key=AIzaSyDZVEUIqbjrDE3QZdHTQY05-zFM7NPJKoQ`;
            request(urlvideo, function (err, response, body) {
                if(err){
                    console.log('Error at the second request');
                    rej(err);
                } else {
                    var json = JSON.parse(body);
                    res(json);
                }
            });
        }).then(function (resol, reje) {
            console.log('Video likes = ', resol.items[0].statistics.likeCount);
            var like = `${resol.items[0].statistics.likeCount} likes !`;
            res.render('home', {dislike: null, comment: null, likes: like, views: null, pressure: null, wind: null, temp: null, humidity: null, error: null});
        });
    });
});

app.post('/youtubeComments', function (req, res) {

    let apiKey = 'AIzaSyDZVEUIqbjrDE3QZdHTQY05-zFM7NPJKoQ';
    let research = req.body.comment;
    let urlsearch = `https://www.googleapis.com/youtube/v3/search?q=${research}&part=snippet&key=${apiKey}&maxResults=1&type=video`;

            var get = new Promise(function(resolve, reject) {
                    request(urlsearch, function (err, response, body) {
                    if(err){
                        console.log('Error at the first request');
                        reject(err);
                    } else {
                        var json = JSON.parse(body);
                        resolve(json);
                    }
                });
            }).then(function(resolve, reject) {
                new Promise(function (res, rej) {
                    var urlvideo = `https://www.googleapis.com/youtube/v3/videos?part=statistics&order=relevance&maxResults=1&id=${resolve.items[0].id.videoId}&key=AIzaSyDZVEUIqbjrDE3QZdHTQY05-zFM7NPJKoQ`;
                    request(urlvideo, function (err, response, body) {
                        if(err){
                            console.log('Error at the second request');
                            rej(err);
                        } else {
                            var json = JSON.parse(body);
                            res(json);
                        }
                    });
                }).then(function (resol, reje) {
                    console.log('Video comment = ', resol.items[0].statistics.commentCount);
                    var comments = `${resol.items[0].statistics.commentCount} comments !`;
                    res.render('home', {dislike: null, comment: comments, likes: null, views: null, pressure: null, wind: null, temp: null, humidity: null, error: null});
                });
            });
});

app.post('/youtubeDislikes', function (req, res) {

    let apiKey = 'AIzaSyDZVEUIqbjrDE3QZdHTQY05-zFM7NPJKoQ';
    let research = req.body.dislike;
    let urlsearch = `https://www.googleapis.com/youtube/v3/search?q=${research}&part=snippet&key=${apiKey}&maxResults=1&type=video`;

    var get = new Promise(function(resolve, reject) {
        request(urlsearch, function (err, response, body) {
            if(err){
                console.log('Error at the first request');
                reject(err);
            } else {
                var json = JSON.parse(body);
                resolve(json);
            }
        });
    }).then(function(resolve, reject) {
        new Promise(function (res, rej) {
            var urlvideo = `https://www.googleapis.com/youtube/v3/videos?part=statistics&order=relevance&maxResults=1&id=${resolve.items[0].id.videoId}&key=AIzaSyDZVEUIqbjrDE3QZdHTQY05-zFM7NPJKoQ`;
            request(urlvideo, function (err, response, body) {
                if(err){
                    console.log('Error at the second request');
                    rej(err);
                } else {
                    var json = JSON.parse(body);
                    res(json);
                }
            });
        }).then(function (resol, reje) {
            console.log('Video dislikes = ', resol.items[0].statistics.dislikeCount);
            var dislikes = `${resol.items[0].statistics.dislikeCount} dislikes !`;
            res.render('home', {dislike: dislikes,  comment: null, likes: null, views: null, pressure: null, wind: null, temp: null, humidity: null, error: null});
        });
    });
});

app.post('/youtubeViews', function (req, res) {

    let apiKey = 'AIzaSyDZVEUIqbjrDE3QZdHTQY05-zFM7NPJKoQ';
    let research = req.body.views;
    let urlsearch = `https://www.googleapis.com/youtube/v3/search?q=${research}&part=snippet&key=${apiKey}&maxResults=1&type=video`;

    var get = new Promise(function(resolve, reject) {
        request(urlsearch, function (err, response, body) {
            if(err){
                console.log('Error at the first request');
                reject(err);
            } else {
                var json = JSON.parse(body);
                resolve(json);
            }
        });
    }).then(function(resolve, reject) {
        new Promise(function (res, rej) {
            var urlvideo = `https://www.googleapis.com/youtube/v3/videos?part=statistics&order=relevance&maxResults=1&id=${resolve.items[0].id.videoId}&key=AIzaSyDZVEUIqbjrDE3QZdHTQY05-zFM7NPJKoQ`;
            request(urlvideo, function (err, response, body) {
                if(err){
                    console.log('Error at the second request');
                    rej(err);
                } else {
                    var json = JSON.parse(body);
                    res(json);
                }
            });
        }).then(function (resol, reje) {
            console.log('Video views = ', resol.items[0].statistics.viewCount);
            var view = `${resol.items[0].statistics.viewCount} views !`;
            res.render('home', {dislike: null, comment: null, likes: null, views: view, pressure: null, wind: null, temp: null, humidity: null, error: null});
        });
    });
});

app.post('/weatherTemp', function (req, res) {
    let city = req.body.city;
    let apiKey = '6d03c145630212c1fdbc8bfa7d202af1';
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

    request(url, function (err, response, body) {
        if(err){
            res.render('home', {dislike: null, comment: null, likes: null, views: null, pressure: null, wind: null, temp: null, humidity: null, error: 'Error, please try again'});
        } else {
            let weather = JSON.parse(body);
            if(weather.main == undefined){
                res.render('home', {dislike: null, comment: null, likes: null, views: null, pressure: null, wind: null, temp: null, humidity: null, error: 'Error, please try again'});
            } else {
                let tempText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
                console.log(tempText);
                res.render('home', {dislike: null, comment: null, likes: null, views: null, pressure: null, wind: null, temp: tempText, humidity: null, error: null});
            }
        }
    });
});

app.post('/weatherHumidity', function (req, res) {
    let city = req.body.city;
    let apiKey = '6d03c145630212c1fdbc8bfa7d202af1';
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

    request(url, function (err, response, body) {
        if(err){
            res.render('home', {dislike: null, comment: null, likes: null, views: null, pressure: null, wind: null, temp: null, humidity: null, error: 'Error, please try again'});
        } else {
            let weather = JSON.parse(body);
            if(weather.main == undefined){
                res.render('home', {dislike: null, comment: null, likes: null, views: null, pressure: null, wind: null, temp: null, humidity: null, error: 'Error, please try again'});
            } else {
                let humidityText = `${weather.main.humidity} % humidity in ${weather.name}!`;
                console.log(humidityText);
                res.render('home', {dislike: null, comment: null, likes: null, views: null, pressure: null, wind: null, temp: null, humidity: humidityText, error: null});
            }
        }
    });
});

app.post('/weatherWind', function (req, res) {
    let city = req.body.city;
    let apiKey = '6d03c145630212c1fdbc8bfa7d202af1';
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

    request(url, function (err, response, body) {
        if(err){
            res.render('home', {dislike: null, comment: null, likes: null, views: null, pressure: null, wind: null, temp: null, humidity: null, error: 'Error, please try again'});
        } else {
            let weather = JSON.parse(body);
            if(weather.wind == undefined){
                res.render('home', {dislike: null, comment: null, likes: null, views: null, pressure: null, wind: null, temp: null, humidity: null, error: 'Error, please try again'});
            } else {
                let windText = `The wind speed in ${weather.name} is ${weather.wind.speed} meter per second !`;
                console.log(windText);
                res.render('home', {dislike: null, comment: null, likes: null, views: null, pressure: null, wind: windText, temp: null, humidity: null, error: null});
            }
        }
    });
});

app.post('/weatherPressure', function (req, res) {
    let city = req.body.city;
    let apiKey = '6d03c145630212c1fdbc8bfa7d202af1';
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

    request(url, function (err, response, body) {
        if(err){
            res.render('home', {dislike: null, comment: null, likes: null, views: null, pressure: null, wind: null, temp: null, humidity: null, error: 'Error, please try again'});
        } else {
            let weather = JSON.parse(body);
            if(weather.main == undefined){
                res.render('home', {dislike: null, comment: null, likes: null, views: null, pressure: null, wind: null, temp: null, humidity: null, error: 'Error, please try again'});
            } else {
                let pressureText = `The Atmospheric pressure in ${weather.name} is ${weather.main.pressure} Hpa !`;
                console.log(pressureText);
                res.render('home', {dislike: null, comment: null, likes: null, views: null, pressure: pressureText, wind: null, temp: null, humidity: null, error: null});
            }
        }
    });
});

app.get('/about.json', function(req, res) {
    session_var = req.session;
    var ip = req.ip.split(':').pop();
    var dateTime = new Date();
    var epochDate = dateTime.getTime()/1000.0;
    epochDate = epochDate.toString().split('.').shift();

    console.log(ip);
    console.log(epochDate);
    res.json({
        client: {"host": ip},
        server: {
            current_time: epochDate,
            services: [{
                name: "Weather",
                widgets: [{
                    name: "City pressure",
                    description: "Affichage de la  pression athmospherique pour une ville donnée",
                    params: [{"name": "city", "type": "string"}]
                }, {
                    name: "City wind",
                    description: "Affichage de la vitesse du vent en mètre par seconde pour une ville donnée",
                    params: [{"name": "city", "type": "string"}]
                }, {
                    name: "City humidity",
                    description: "Affichage de l'humidité  pour une ville donnée",
                    params: [{"name": "city", "type": "string"}]
                }, {
                    name: "City Temp",
                    description: "Affichage de la température pour une ville donnée",
                    params: [{"name": "city", "type": "string"}]
                }]
            }, {
                name: "Youtube",
                widgets: [{
                    name: "Youtube Views",
                    description: "Affiche le nombre de vue pour une vidéo donnée",
                    params: [{name: "views", type: "string"}]
                }, {
                    name: "Youtube Likes",
                    description: "Affiche le nombre de like pour une vidéo donnée",
                    params: [{name: "likes", type: "string"}]
                }, {
                    name: "Youtube Dislikes",
                    description: "Affiche le nombre de dislike pour une vidéo donnée",
                    params: [{name: "dislikes", type: "string"}]
                }, {
                    name: "Youtube Comments",
                    description: "Affiche le nombre de commentaire pour une vidéo donnée",
                    params: [{name: "comment", type: "string"}]
                }]
            }]
        }
    });
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
});
