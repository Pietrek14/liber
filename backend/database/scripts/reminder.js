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

for (x in user){
    var userBorrows = user[x].borrows;

    for (y in userBorrows){
        var date = await.Reader.find({borrow_date : y}).exec();
            if (date == today){
                //wysłanie maila
            }
    }
}