const express = require('express')
const app = express()
const port = 3000

const otplib = require('otplib');
const secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';
// Alternative:
// const secret = otplib.totp.generateSecret();
// Note: .generateSecret() is only available for authenticator and not totp/hotp
function validate(token) {
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

const cors = require('cors');
const corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));

const bodyParser = require('body-parser');
app.use(bodyParser.text({type: 'text/html'}));

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/auth', (req, res) => {
	const token = req.body;
	const isValid = validate(token);
	const response = '' + token + ' ' + isValid;
	res.send(response);
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))