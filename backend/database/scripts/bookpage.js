const mongoose = require("mongoose");
const Reader = require("../models/reader");

function setPage(title){

    const titleDiv = document.getElementById("title");
    const authorDiv = document.getElementById("author");
    const descriptionDiv = document.getElementById("description");
    const dateDiv = document.getElementById("release-date");
    const publisherDiv = document.getElementById("publisher");
    const coverDiv = document.getElementById("cover");
    const tagsDiv = document.getElementById("tags");
    const contentDiv = document.getElementById("content");

    var MongoClient = require('mongodb').MongoClient;
    var url = "serwer";

    var query = { title: + title};

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        var dbo = db.db("liber");

        dbo.collection("book").find(query).toArray(function(err, bookInfo) {
            if (err) throw err;

            titleDiv.innerHTML = bookInfo.title;
            authorDiv.innerHTML = bookInfo.author;
            descriptionDiv.innerHTML = bookInfo.title;
            dateDiv.innerHTML = bookInfo.release_date;
            publisherDiv.innerHTML = bookInfo.publisher;
            coverDiv.innerHTML = bookInfo.cover;
            tagsDiv.innerHTML = bookInfo.tags;
            contentDiv.innerHTML = bookInfo.content;

        })
    })
}
