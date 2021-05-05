const nodemailer = require("nodemailer");

function sendMail(
	transporter,
	from,
	to,
	subject,
	content,
	onError = (err) => {
		console.error(err);
	},
	onNoError = (info) => {
		console.log("Sent email");
	}
) {
	const mailOptions = {
		from: from,
		to: to,
		subject: subject,
		html: content,
	};

	transporter.sendMail(mailOptions, async (error, info) => {
		if (error) {
			onError(error);
			return;
		}

		onNoError(info);
	});
}

module.exports = sendMail;
