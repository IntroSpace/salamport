const MongoClient = require("mongodb").MongoClient;
const uuid = require('uuidv4');

//const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
const mongoClient = new MongoClient("mongodb://heroku_w84gj2xp:c4rtm76bmtpcdnmm6utlh85li@ds215229.mlab.com:15229/heroku_w84gj2xp/", { useNewUrlParser: true });

//const base = "salamport"
const base = "heroku_w84gj2xp"

module.exports.addUser = function (user) {
	return new Promise(function (resolve, reject) {
		mongoClient
			.connect(function (err, client) {
				if (err) {reject(err)}
				client
					.db(base)
					.collection("users")
					.insertOne(user, function (err, results) {
						if (err) {reject(err)}
						client.close()
						resolve(results.ops[0])
					})
			})
	})
}

module.exports.getUser = function (email) {
	return new Promise(function (resolve, reject) {
		mongoClient
			.connect(function (err, client) {
				if (err) {reject(err)}
				client
					.db(base)
					.collection("users")
					.find({"email": email})
					.toArray(function (err, results) {
						if (err) {reject(err)}
						client.close()
						resolve(results)
					})
			})
	})
}

module.exports.getUserByToken = function (token) {
	return new Promise(function (resolve, reject) {
		mongoClient
			.connect(function (err, client) {
				if (err) {reject(err)}
				client
					.db(base)
					.collection("users")
					.find({"token": token})
					.toArray(function (err, results) {
						if (err) {reject(err)}
						client.close()
						resolve(results)
					})
			})
	})
}

module.exports.haveToken = function (email) {
	mongoClient
		.connect(function (err, client) {
			client
				.db(base)
				.collection("users")
				.find({"email": email})
				.toArray(function (err, results) {
					client.close()
					if (results.length == 0) {return 0}
					else {return 1}
				})
		})
}

module.exports.getToken = function (email) {
	return new Promise(function (resolve, reject) {
		mongoClient
			.connect(function (err, client) {
				if (err) {reject(err)}
				client
					.db(base)
					.collection("users")
					.find({"email": email})
					.toArray(function (err, results) {
						if (err) {reject(err)}
						client.close()
						resolve(results[0].token)
					})
			})
	})
}

module.exports.newToken = function (email) {
	return new Promise(function (resolve, reject) {
		mongoClient
			.connect(function (err, client) {
				if (err) {reject(err)}
				token = uuid.uuid()
				client
					.db(base)
					.collection("users")
					.findOneAndUpdate(
        				{email: email},              // критерий выборки
        				{ $set: {token: token}},     // параметр обновления
        				{                           // доп. опции обновления    
            				returnOriginal: false
        				},
        				function(err, result){
            				resolve(result.value.token);
            				client.close();
        				}
    				);
			})
	})
}

module.exports.deleteCode = function (email) {
	mongoClient
		.connect(function (err, client) {
			if (err) {reject(err)}
			client
				.db(base)
				.collection("codes")
				.deleteOne({email: email}, function (err, result) {
					client.close()
				})
		})
}

module.exports.getCode = function (email) {
	return new Promise(function (resolve, reject) {
		mongoClient
			.connect(function (err, client) {
				console.log(err)
				console.log(client)
				if (err) {reject(err)}
				client
					.db(base)
					.collection("codes")
					.find({"email": email})
					.toArray(function (err, results) {
						if (err) {reject(err)}
						client.close()
						resolve(results[0].code)
					})
			})
	})
}

module.exports.addCode = function (email, code) {
	mongoClient
		.connect(function (err, client) {
			if (err) {reject(err)}
			client
				.db(base)
				.collection("codes")
				.insertOne({
					email: email,
					code: code
				}, function (err, result) {
					client.close()
				})
		})
}

/*mongoClient.connect(function(err, client){
	const db = client.db("salamport")
	const collection = db.collection("users")
	collection.insertOne({
		id: 1,
		firstname: "Фархад",
		lastname: "Гайнуллов",
		email: "devzodiac33@gmail.com",
		token: 
	})
    if(err){
        return console.log(err);
    }
    // взаимодействие с базой данных
    client.close();
});*/