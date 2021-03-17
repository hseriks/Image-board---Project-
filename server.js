const express = require("express");
const app = express(); // creates the express app
const db = require("./db");
const { uploader } = require('./upload');

app.use(express.static("public"));
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.method + " made on path: " + req.url);
    next();
});

const s3 = require("./s3");

///////////////////
//insert into db//
/////////////////

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("you've made it inside /upload!");
    console.log("req.body: ", req.body);
    console.log("req.file: ", req.file);
    //const file = req.file;
    db.uploadImage2(req.body.title, req.body.username, req.body.description, req.file.filename).then((results)=>{
        console.log("made it here");
        console.log(results);
        console.log("req.body", req.body);
        res.json(results.rows[0]); // what about req.file? // this goes back to axios

    }).catch((err) => {
        console.log("error in db uploadimage");
    })
});

/////////////////////////////
//listen for click on image//
////////////////////////////

app.get("/modal/:id", (req, res) => {
    console.log("this is inside the get modal listener");
    console.log("req.params.id", req.params.id);
    db.getModal(req.params.id).then(({ rows }) => { /// how can I get the params to show the id. So far only hardcoded works
        console.log({rows});
        res.json(rows)
    });
});


app.get("/images", (req, res) => {
    db.getImages()
        .then((results) => {
            console.log("result:", results);
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("err in getImages:", err);
        });
});

app.get("/morepictures/:id", (req, res) => {
    db.getMoreImages(req.params.id)
        .then((results) => {
            console.log("result:", results);
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("errot getting images:", err);
        });
});

/////////////////////////////
//comments listeners////////
////////////////////////////

app.get("/comments/:imageid", (req,res) => {
    console.log("inside get comments");
    console.log(req.params.imageid);
    db.getComments(req.params.imageid).then((results) => {
        console.log("comments for picture", results);
        res.json(results.rows); // figure out what to send back if this works
    })
    // get comments from the server

});

app.post("/comment", (req,res) => {
    console.log("you've made it inside /comment!");
    // here I need to pass in the object
    console.log(req.body);
    db.insertComment(req.body.comment, req.body.username, req.body.imageid).then((results) => {
        console.log(results);
        res.json(results.rows) // figure out what to send back if this works 
    })
    // push forward the comments from db
});



app.listen(8080, () => console.log("IB server is listening..."));