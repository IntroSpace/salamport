const nodemailer = require("nodemailer")

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rsalamport@gmail.com',
        pass: 'salam123salamport'
    }
});

module.exports.sendCode = function (email, code) {
	transporter.sendMail({
		from: 'rsalamport@gmail.com',
		to: email,
		subject: 'Ваш код',
		text: code
	}, function(error, info){
		console.log(error)
		if (error) {
			return 0
		} else {
			return 1
		}
	})
};