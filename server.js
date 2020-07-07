const express = require('express');
const otplib = require('otplib');
const cors = require('cors');
const bodyParser = require('body-parser');

/*
	Alternative:
	const secret = otplib.authenticator.generateSecret();
	* Note: .generateSecret() is only available for authenticator and not totp/hotp
*/
const secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';
const port = 3000;
const corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200,
}
const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.text({type: 'text/html'}));

function validateToken(token) {
	let isValid = false;
	try {
	  isValid = otplib.totp.check(token, secret);
	} catch (err) {
	  // Possible errors
	  // - options validation
	  // - "Invalid input - it is not base32 encoded string" (if thiry-two is used)
	  console.error(err);
	}
  return isValid;
}

app.post('/auth', (req, res) => {
	const token = req.body;
	const isValid = validateToken(token);
	res.send(token);
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))