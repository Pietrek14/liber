const Reader = require("../database/models/reader");
const nodemailer = require("nodemailer");

const error = require("./scripts/error");

const user = await Reader.find({}).exec();

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();
if(dd<10){
    dd='0'+dd
} 
if(mm<10){
    mm='0'+mm
} 

today = yyyy+'-'+mm+'-'+dd;


const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL,
		pass: process.env.EMAIL_PASSWORD,
	},
	tls: {
		rejectUnauthorized: false,
	},
});


for (x in user){
    var userBorrows = user[x].borrows;

    for (y in userBorrows){
        var book = await Reader.find({ _id : userBorrows[y]}).exec();
            if (book.borrow_date == today){
                
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: user[x].email,
                    subject: 'Przypomnienie o oddaniu książki',
                    text: 'Wypożyczenie tej książki dobiega końca: ' + book.title
                };

                transporter.sendMail(mailOptions, function(error){
                    if (error){
                        console.log(error);
                    }
                })
            }
    }
}