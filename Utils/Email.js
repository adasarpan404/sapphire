const mailgun = require("mailgun-js");

const DOMAIN = `${process.env.EMAIL_DOMAIN}`;

const mg = mailgun({apiKey: process.env.EMAIL_API_KEY, domain: DOMAIN});


exports.sendMail = (verficationEmailAddress, Subject, Text) => {
const data = {
	from: 'Excited User <me@samples.mailgun.org>',
	to: verficationEmailAddress,
	subject: Subject,
	text: Text
};
mg.messages().send(data, function (error, body) {
console.log(body);
});
}
