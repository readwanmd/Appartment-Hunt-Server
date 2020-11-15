const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a6ded.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 5000;

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
client.connect((err) => {
	const appartmentColection = client
		.db('appartmentHunt')
		.collection('appartmentColection');

	app.post('/insertappartment', (req, res) => {
		const appartments = req.body;
		appartmentColection.insertMany(appartments).then((result) => {
			// res.send(result.insertedCount);
			res.sendStatus(status);
			console.log(result);
		});
	});

	app.get('/appartments', (req, res) => {
		appartmentColection.find({}).toArray((err, documents) => {
			res.send(documents);
		});
	});
});

app.get('/', (req, res) => {
	res.send("Appartment Hunt's backend");
});

app.listen(process.env.PORT || port);
