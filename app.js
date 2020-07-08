const bodyParser	= require("body-parser")
const express		= require("express")
const db			= require("./db/db.js")

const app			= express()
const jsonParser	= express.json()
//const port			= 8000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname+"/public/"))

app.post('/register', jsonParser,function(req,res) {
    db
    	.getUser(req.body.email)
    	.then(function (results) {
    		if (results.length == 0) {
    			user = {
    				email: req.body.email,
    				firstname: req.body.firstname,
    				lastname: req.body.lastname,
    				token: 12345678
    			}
    			db
    				.addUser(user)
    				.then(function (results) {
    					res.json({
    						err: 0,
    						message: "Пользователь добавлен: " + results[0]
    					})
    				})
    				.catch(function (err) {
    					res.json({
    						err: 1,
    						message: "Ошибка"
    					})
    				})
    		} else {
    			res.json({
    				err: 1,
    				message: "Пользователь уже есть!"
    			})
    		}
    	})
});

app.post('/login',function (req,res) {
    db
    	.getUser(req.body.email)
    	.then(function (results) {
    		if (results[0].token == req.body.token) {
    			res.json({
    				email: req.body.email,
    				firstname: results[0].firstname,
    				lastname: results[0].lastname,
    				token: results[0].token
    			})
    		}
    	})
});

app.listen(process.env.PORT)