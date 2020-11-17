const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a6ded.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const ObjectId = require('mongodb').ObjectID;
const fileUpload = require('express-fileupload');
const fs = require('fs-extra');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('icons'));
app.use(fileUpload());

const port = 5000;

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
client.connect((err) => {
	const appartmentColection = client
		.db('appartmentHunt')
		.collection('appartmentColection');
	const bookingColection = client.db('appartmentHunt').collection('bookings');
	const adminCollection = client.db('appartmentHunt').collection('admin');

	app.post('/insertappartment', (req, res) => {
		const appartments = req.body;
		appartmentColection.insertMany(appartments).then((result) => {
			res.status(200).send('Okay!');
			// console.log(result);
		});
	});

	app.get('/appartments', (req, res) => {
		appartmentColection.find({}).toArray((err, documents) => {
			res.send(documents);
		});
	});

	app.get('/appartment', (req, res) => {
		const id = req.query.id;
		// console.log(id);
		appartmentColection
			.find({ _id: ObjectId(req.query.id) })
			.toArray((err, documents) => {
				if (documents.length > 0) {
					res.status(200).send(documents);
				}
			});
	});

	app.post('/addAppartment', (req, res) => {
		const file = req.files.file;
		const appName = req.body.appName;
		const serviceCharge = req.body.serviceCharge;
		const flatSize = req.body.flatSize;
		const bath = req.body.bath;
		const shortSummary = req.body.shortSummary;
		const price = req.body.price;
		const address = req.body.address;
		const sequrityDeposit = req.body.sequrityDeposit;
		const bed = req.body.bed;

		const newImg = file.data;
		const encImg = newImg.toString('base64');

		const imgMain = {
			contentType: file.mimetype,
			size: file.size,
			img: Buffer.from(encImg, 'base64'),
		};

		appartmentColection
			.insertOne({
				imgMain,
				appName,
				serviceCharge,
				flatSize,
				bath,
				shortSummary,
				price,
				address,
				sequrityDeposit,
				bed,
			})
			.then((result) => {
				res.status(200).send(result);
			});
	});

	app.post('/placeBooking', (req, res) => {
		const order = req.body;
		// console.log(order);
		bookingColection.insertOne(order).then((result) => {
			// console.log(result);
			res.status(200).send(result);
		});
	});

	app.get('/bookingList', (req, res) => {
		bookingColection.find({}).toArray((err, documents) => {
			res.send(documents);
		});
	});

	app.get('/myRent', (req, res) => {
		const email = req.query.email;
		bookingColection.find({ email: email }).toArray((err, documents) => {
			if (documents.length > 0) {
				res.status(200).send(documents);
			}
		});
	});

	app.post('/adminAccess', (req, res) => {
		const email = req.body.email;
		adminCollection.find({ email: email }).toArray((err, result) => {
			res.send(result.length > 0);
		});
	});
});

app.get('/', (req, res) => {
	res.send("Appartment Hunt's backend");
});

app.listen(process.env.PORT || port);
