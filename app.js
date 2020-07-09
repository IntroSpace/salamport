const bodyParser	= require("body-parser")
const express		= require("express")
const db			= require("./db/db.js")
const mail			= require("./db/email.js")
const multer = require('multer')

const app			= express()
const jsonParser	= express.json()
//const port			= 8000

//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname+"/public"))

// app.post('/register', jsonParser,function(req,res) {
//     db
//     	.getUser(req.body.email)
//     	.then(function (results) {
//     		if (results.length == 0) {
//     			user = {
//     				email: req.body.email,
//     				firstname: req.body.firstname,
//     				lastname: req.body.lastname,
//     				token: 12345678
//     			}
//     			db
//     				.addUser(user)
//     				.then(function (results) {
//     					res.json({
//     						err: 0,
//     						message: "Пользователь добавлен: " + results[0]
//     					})
//     				})
//     				.catch(function (err) {
//     					res.json({
//     						err: 1,
//     						message: "Ошибка"
//     					})
//     				})
//     		} else {
//     			res.json({
//     				err: 1,
//     				message: "Пользователь уже есть!"
//     			})
//     		}
//     	})
// });

// app.post('/user/login',function (req,res) {
// 	if (db.haveToken(req.body.email)) {
// 		db
//     		.getUser(req.body.email)
//     		.then(function (results) {
//     			if (results[0].token == req.body.token) {
//     				res.json({
//     					email: req.body.email,
//     					firstname: results[0].firstname,
//     					lastname: results[0].lastname,
//     					token: results[0].token
//     				})
//     			}
//     		})
// 	}
//     db
//     	.getUser(req.body.email)
//     	.then(function (results) {
//     		if (results[0].token == req.body.token) {
//     			res.json({
//     				email: req.body.email,
//     				firstname: results[0].firstname,
//     				lastname: results[0].lastname,
//     				token: results[0].token
//     			})
//     		}
//     	})
// });

function randomCode() {  
  return Math.floor(
    Math.random() * (899999) + 100001
  )
}

app.post('/user/login',function (req,res) {
	if (req.body.code == "") {
		if (req.body.token == "") {
			code = randomCode()
			if (mail.sendCode(req.body.email, code)) {
				db.addCode(req.body.email, code)
				res.json({
					err: 0,
					message: "Письмо отправлено"
				})
			} else {
				res.json({
					err: 1,
					message: "Ошибка отправления"
				})
			}
		} else {
			db.getUserByToken(req.body.token)
			.then(function (results){
				res.json({
					email: results[0].email,
    				firstname: results[0].firstname,
    				lastname: results[0].lastname,
    				token: req.body.token
				})
			})
		}
	} else {
		if (db.getCode(req.body.email) == req.body.code) {
			db.deleteCode(req.body.email)
			db.newToken(req.body.email)
			.then(function (result) {
				res.json({
					token: result
				})
			})
		} else {
			res.json({
				token: ""
			})
		}
	}
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // '/files' это директория в которую будут сохранятся файлы 
    cb(null, __dirname+'/public/imgs/')
  },
  filename: (req, file, cb) => {
    const { originalname } = file
    cb(null, originalname)
  }
})
const upload = multer({ storage: storage })
app.post(
  '/user/img', 
  // Указываем multer в каком поле брать файл
  upload.single('file'), 
  (req, res) => {
    res.json({status: 'Saved'})
  })

app.listen(process.env.PORT)