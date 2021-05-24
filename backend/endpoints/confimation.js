const { Router } = require("express");
const { db } = require("../database/models/reader");
const Reader = require("../database/models/reader");

const router = Router();

router.post("/", async (req, res) => {
    const data = req.body;

    const book = data.BookId;

    const bookFromDB = await Reader.find({ bookId : book});

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

    //funkcja na insert id ksionżki i daty

    var ObjectID = require('mongodb').ObjectID;

    var bookToBorrow = {
        boorow_date : today,
        book : bookFromDB.id,
        _id : new ObjectID(),
    };

    var borrowID = bookToBorrow._id;

    db.collection('reader').insert(bookToBorrow);

    //funkcja na dodanie id wypozyczenia do tablicy usera

    const borrows = user.borrows; 

    db.collection(borrows).insert(borrowID);
})          