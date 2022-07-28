const express = require("express");
const ejs = require("ejs");
const app = express();
const routes = require("./routes/routes.js");
const bodyParser = require("body-parser");
const session = require("express-session");

let db;

function openDB() {
    var sqlite = require('sqlite3').verbose();
    db = new sqlite.Database('../database.db', function (err) {
        if (err) {
            throw (err);
        } else {
            routes.setDB(db); 
        }
    });
}

openDB();


app.use(session({
    name: 'sid',
    resave: false,
    saveUninitialized: false,
    secret: 'mr-comp',
    cookie: {
        maxAge: 3600000,
        sameSite: true,
    }
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
 
app.get('/', routes.overview);
app.get('/tags', routes.index);
app.get('/tag-details', routes.tag_details);

app.post('/showTagDetail', routes.showTagDetail);
app.post('/create-new-PR', routes.createNewPR);
app.post('/save-changings', routes.saveChangings);
app.post('/delete-pattern', routes.deletePattern);
app.post('/delete-response', routes.deleteResponse);
app.post('/save-changings-tags', routes.saveChangingsTags);
app.post('/create-new-tag', routes.createNewTag);
app.post('/delete-tag', routes.deleteTag);
app.post('/create-new-group', routes.createNewGroup);
app.post('/save-changings-group', routes.saveChangingsGroups);
app.post('/delete-group', routes.deleteGroup);
app.post('/showGroupDetail', routes.showGroupDetail);
app.post('/assign-group', routes.assignGroup);

app.post('/assign-group', routes.assignGroup);
app.listen(4000); 