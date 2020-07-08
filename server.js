const express = require('express');
const otplib = require('otplib');
const cors = require('cors');
const bodyParser = require('body-parser');
const qrcode = require('qrcode');

/*
	Alternative:
	const secret = otplib.authenticator.generateSecret();
	* Note: .generateSecret() is only available for authenticator and not totp/hotp
*/
const secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';
const user = 'A user name, possibly an email';
const service = 'A service name';
const corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200,
}
const port = 3000;
const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.text({type: 'text/html'}));

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

app.post('/auth', (req, res) => {
	const token = req.body;
	const tokenIsValid = validateToken(token);
	if (tokenIsValid) {
		const otpauth = otplib.authenticator.keyuri(user, service, secret);
		qrcode.toDataURL(otpauth, (err, imageUrl) => {
		  if (err) {
		    res.json({err});
		  } else {
				res.json({imageUrl});
		  }
		});
	} else {
		res.json({err: 'invalid token'});
	}
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))