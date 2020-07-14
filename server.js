const express = require('express');
const otplib = require('otplib');
const cors = require('cors');
const bodyParser = require('body-parser');
const qrcode = require('qrcode');

// const secret = otplib.authenticator.generateSecret();
const secret = 'NQ4RORLIG5ETMCIE';
const service = 'MS3 2FA Demo';
const sessionID = 'ab029dk29';
const corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200,
}
let port = process.env.PORT;
if (port === null || port === undefined || port === '') {
  port = 8000;
}
const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json({type: 'application/json'}));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	res.render('index');
});

app.post('/api/signup/1fa', (req, res) => {
	const {username, password} = req.body;
	const otpauth = otplib.authenticator.keyuri(username, service, secret);
	qrcode.toDataURL(otpauth, (err, imageUrl) => {
	  if (err) {
	    res.json({err});
	  } else {
			res.json({imageUrl});
	  }
	});
});

app.post('/api/signup/2fa', (req, res) => {
	const {token} = req.body;
	let tokenIsValid = false;
	try {
	  tokenIsValid = otplib.authenticator.check(token, secret);
	} catch (err) {
	  // Possible errors
	  // - options validation
	  // - "Invalid input - it is not base32 encoded string" (if thiry-two is used)
	  console.error(err);
	}

	if (tokenIsValid) {
		res.sendStatus(201);
	} else {
		res.sendStatus(401);
	}
});

app.post('/api/auth/1fa', (req, res) => {
	const {username, password} = req.body;
	let credentialsAreValid = true;
	if (credentialsAreValid)  {
		res.sendStatus(201);
	} else {
		res.sendStatus(401);
	}
});

app.post('/api/auth/2fa', (req, res) => {
	const {token} = req.body;
	let tokenIsValid = false;
	try {
	  tokenIsValid = otplib.authenticator.check(token, secret);
	} catch (err) {
	  // Possible errors
	  // - options validation
	  // - "Invalid input - it is not base32 encoded string" (if thiry-two is used)
	  console.error(err);
	}

	if (tokenIsValid) {
		res.status(200).json({sessionID});
	} else {
		res.sendStatus(401);
	}
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))