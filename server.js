// node modules 
const fs = require("fs"); 

// NPM modules 
const express = require("express"); 
const logger = require("morgan"); 
const { v4: uuidv4 } = require("uuid"); 
const path = require("path");  

const app = express(); 
const PORT = process.env.PORT || 8080;   

// let notes = [{

//     id:uuidv4(), 
//     title: "Hello", 
//     text: "World!"
// }]   
let notes = [];



// Middleware 
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.use(logger('dev'));  
app.use(express.static('public'));

// HTML ROUTES 
// GET - /notes - return the notes.html file 
// GET - * - return the index.html file (put right before app.listen)

// GET - /api/notes
app.get("/api/notes", function (req, res){ 
    //read from my db.json file 
    fs.readFile(__dirname + "/db/db.json", "utf8", function (err, data) {  
        //const notes = JSON.parse(data);
        // respond with notes
        res.json(JSON.parse(data));
    });
});

// POST -/api/notes - receive new note and add to db.json file, then return to client 
app.post("/api/notes", function(req, res){
    let note = { 
        id: uuidv4(), 
        ...req.body,
    };
    // read the data from db.json
    fs.readFile(__dirname + "/db/db.json", "utf8", function (err, data){  
        const notes = JSON.parse(data); 
        notes.push(note); 
        const stringifiedData = JSON.stringify(notes, null, 2);
        
        fs.writeFile(__dirname + "/db/db.json", stringifiedData, function (){ 
            res.json(note);

        })
    })
    //notes.push();
    //res.json(notes);
});


// DELETE - /api/notes/:id 
app.delete("/api/notes/:id", function(req, res) { 
    const {id} = req.params; 
    fs.promises 
    .readFile(__dirname + "/db/db.json", "utf8") 
    .then (function (data) { 
        let notes = JSON.parse(data); 
        notes = notes.filter((note) => note.id !== id);  
        const stringData = JSON.stringify(notes, null, 2);  
        return fs.promises.writeFile(__dirname + "/db/db.json", stringData);
    
    }) 
    .then(function () { 
        res.json(true);
    });

});


// route to load notes
app.get("/notes", function (req, res){ 
    res.sendFile(path.join(__dirname + "/public/notes.html"));
});  
// route to load home page
app.get("*", function (req, res){ 
    res.sendFile(__dirname + "/public/index.html");
}); 

app.listen(PORT, () => 
console.log (`App listening at http://localhost:${PORT}`));