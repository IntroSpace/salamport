const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });

const base = "salamport"

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