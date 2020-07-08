const express = require('express');
const otplib = require('otplib');
const cors = require('cors');
const bodyParser = require('body-parser');
const qrcode = require('qrcode');

const corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200,
}
const port = 3000;
const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json({type: 'application/json'}));

function validateToken(token) {
	let tokenIsValid = false;
	try {
	  tokenIsValid = otplib.totp.check(token, secret);
	} catch (err) {
	  // Possible errors
	  // - options validation
	  // - "Invalid input - it is not base32 encoded string" (if thiry-two is used)
	  console.error(err);
	}
  return tokenIsValid;
}

app.post('/api/auth/1fa', (req, res) => {
	console.log(req.body);
	const user = 'A user name, possibly an email';
	const service = 'A service name';
	const secret = otplib.authenticator.generateSecret();
	const otpauth = otplib.authenticator.keyuri(user, service, secret);
	qrcode.toDataURL(otpauth, (err, imageUrl) => {
	  if (err) {
	    res.json({err});
	  } else {
			res.json({imageUrl});
	  }
	});
	// const token = req.body;
	// const tokenIsValid = validateToken(token);
	// if (tokenIsValid) {
	// 	const otpauth = otplib.authenticator.keyuri(user, service, secret);
	// 	qrcode.toDataURL(otpauth, (err, imageUrl) => {
	// 	  if (err) {
	// 	    res.json({err});
	// 	  } else {
	// 			res.json({imageUrl});
	// 	  }
	// 	});
	// } else {
	// 	res.json({err: 'invalid token'});
	// }
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))