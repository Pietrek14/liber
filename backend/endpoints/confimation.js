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

    var bookToBorrow = {
        boorow_date : today,
        book : bookFromDB.id,
    };

    db.collection(borrowSchema).insert(bookToBorrow);

    borrowSchema.find(bookToBorrow).lean().exec(function(error, records) {
        records.forEach(function(record) {
            var borrowID = record._id;
        });
      });

    //funkcja na dodanie id wypozyczenia do tablicy usera

    user.borrows.push(borrowID);
    user.save(done);
})          