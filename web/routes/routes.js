let database = null;    //Platzhalter für die Datenbank.
exports.setDB = function (db) { //Möglichkeit die Datenbank von Ausserhalb des Moduls zu erreichen (nur schreiben).
    database = db;
};

exports.getDB = function () { //Möglichkeit die Datenbank von Ausserhalb des Moduls zu erreichen (nur lesen).
    return database;
};

let dt = new Date();
let mm = dt.getMonth() + 1;
let dd = dt.getDate();
let yyyy = dt.getFullYear();
let datum = dd + '.' + mm + '.' + yyyy;


//home page loadup
exports.index = function (req, res) {
    if (req.session.tag) {    //if cookie for tag is existing, it should be deleted
        delete req.session.tag;
    }
    if (!req.session.group){
        res.redirect('/');
    }else{
        if(req.session.group != "groupless"){
            let sql_get_f = 'SELECT tags.id, tags.tag FROM tags, groups WHERE tags.groupid = groups.id AND groups.name =?';
            let sql_get_groups = 'SELECT * FROM groups'
            database.all(sql_get_f, req.session.group, (err, tags) => {  //get all information about tags from database for home page
                if (err) throw err;
                database.all(sql_get_groups, (err, groups)=>{
                    if(err) throw err;
                    res.render('index', { tags: tags, groups: groups})   //render index.ejs with variables
                })
                
            });
        }else{
            
            let sql_get_f = 'SELECT tags.id, tags.tag FROM tags WHERE tags.groupid IS NULL';
            let sql_get_groups = 'SELECT * FROM groups'
            database.all(sql_get_f, (err, tags) => {  //get all information about tags from database for home page
                if (err) throw err;
                database.all(sql_get_groups, (err, groups)=>{
                    if(err) throw err;
                    res.render('index', { tags: tags, groups: groups})   //render index.ejs with variables
                });
            });
        }
    }
};

//post method for clicking on specific tag
exports.showTagDetail = function (req, res) {
    let tag = req.body.tagName;
    req.session.tag = tag;         //creating cookie with the tag as content
    res.redirect('/tag-details');
}

//tags details loadup
exports.tag_details = function (req, res) {
    if (!req.session.tag) {           //if no cookie about a tag is existing, the page should not be accessable 
        res.redirect('/tags');
    }
    else {
        let tag = req.session.tag;
        let pat = [], resp = [], id = [];
        let sql_get_infos = 'SELECT intents.id, intents.patterns, intents.responses FROM intents, tags WHERE intents.tagid=tags.id AND tags.tag=?';
        database.all(sql_get_infos, tag, (err, rows) => {
            if (err) throw err;
            for (let i = 0; i < rows.length; i++) {
                pat.push(rows[i].patterns);
                id.push(rows[i].id);
                if (rows[i].responses != null) {
                    resp.push(rows[i].responses)
                }
            }
            res.render('tag-details', { id: id, patterns: pat, responses: resp });
        });
    }
}

//Create new pattern or response
exports.createNewPR = function (req, res) {
    let text = req.body.newData;
    let pr = req.body.pr;
    let tag = req.session.tag;
    let sql_check = 'SELECT Id FROM intents WHERE ' + pr + '=?';
    let sql_get_tagid = 'SELECT id FROM tags WHERE tag =?';
    let sql_insert_patterns = 'INSERT INTO intents(tagid, patterns) VALUES(?,?)';
    let sql_check_for_null_patterns = 'SELECT MIN(Id) AS min FROM intents WHERE patterns IS NULL AND tagid=?';
    let sql_check_for_null_responses = 'SELECT MIN(Id) AS min FROM intents WHERE responses IS NULL AND tagid=?';
    let sql_update_responses = 'UPDATE intents SET responses=? WHERE id=?';
    let sql_update_patterns = 'UPDATE intents SET patterns=? WHERE id=?'
    let sql_insert_responses = 'INSERT INTO intents(tagid, responses) VALUES(?,?)';

    if (text == "") {
        res.redirect('/tag-details');
        return;
    } else {
        database.get(sql_check, text, (err, row) => {
            if (err) throw err;
            if (row) {
                res.redirect('/tag-details');
            }
            else {
                database.get(sql_get_tagid, tag, (err, tagid) => {
                    if (err) throw err;
                    if (pr == "patterns") {
                        text = text.toLowerCase();
                        database.get(sql_check_for_null_patterns, tagid.id, (err, row_null) => {
                            if (err) throw err;
                            if (row_null.min != null) {
                                database.run(sql_update_patterns, text, row_null.min, (err) => {
                                    if (err) throw err;
                                    res.redirect('/tag-details');
                                });
                            } else {
                                database.run(sql_insert_patterns, tagid.id, text, (err) => {
                                    if (err) throw err;
                                    res.redirect('/tag-details');
                                });
                            }
                        });
                    }
                    if (pr == "responses") {
                        database.get(sql_check_for_null_responses, tagid.id, (err, row_null) => {
                            if (err) throw err;
                            if (row_null.min != null) {
                                database.run(sql_update_responses, text, row_null.min, (err) => {
                                    if (err) throw err;
                                    res.redirect('/tag-details');
                                });
                            } else {
                                database.run(sql_insert_responses, tagid.id, text, (err) => {
                                    if (err) throw err;
                                    res.redirect('/tag-details');
                                });
                            }
                        });
                    }
                })
            }
        });
    }
};

//save changings
exports.saveChangings = function (req, res) {
    let sql_change_patterns = 'UPDATE intents SET patterns=? WHERE id=?';
    let sql_change_responses = 'UPDATE intents SET responses=? WHERE id=?';

    if (req.body.changes_patterns != "") {
        let changes_patterns = JSON.parse(req.body.changes_patterns.toLowerCase());
        for (let i = 0; i < changes_patterns.length; i++) {
            database.serialize(function () {
                database.run(sql_change_patterns, changes_patterns[i].new_line, changes_patterns[i].id, (err) => {
                    if (err) throw err;
                });
            });
        }
    }
    if (req.body.changes_responses != "") {
        let changes_responses = JSON.parse(req.body.changes_responses);
        for (let j = 0; j < changes_responses.length; j++) {
            database.serialize(function () {
                database.run(sql_change_responses, changes_responses[j].new_line, changes_responses[j].id, (err) => {
                    if (err) throw err;
                });
            });
        }
    }
    res.redirect('/tag-details');
};

exports.deletePattern = function(req, res){
    let pattern = req.body.pattern;
    let sql_check = 'SELECT id FROM intents WHERE patterns=?';
    let sql_check_2 = 'SELECT responses FROM intents WHERE id=?';
    let sql_update = 'UPDATE intents SET patterns=NULL WHERE patterns=?';
    let sql_delete = 'DELETE FROM intents WHERE patterns=?';

    database.get(sql_check, pattern, (err, id)=>{
        if(err) throw err;
        database.get(sql_check_2, id.id, (err, response)=>{
            if(response.responses == null){
                database.run(sql_delete, pattern, (err)=>{
                    if(err) throw err;
                    res.redirect('/tag-details');
                });
            }else{
                database.run(sql_update, pattern, (err)=>{
                    if(err) throw err;
                    res.redirect('/tag-details');
                });
            }
        })
    });
}

exports.deleteResponse = function(req, res){
    let response = req.body.response;
    let sql_check = 'SELECT id FROM intents WHERE responses=?';
    let sql_check_2 = 'SELECT patterns FROM intents WHERE id=?';
    let sql_update = 'UPDATE intents SET responses=NULL WHERE responses=?';
    let sql_delete = 'DELETE FROM intents WHERE responses=?';

    database.get(sql_check, response, (err, id)=>{
        if(err) throw err;
        database.get(sql_check_2, id.id, (err, pattern)=>{
            if(pattern.patterns == null){
                database.run(sql_delete, response, (err)=>{
                    if(err) throw err;
                    res.redirect('/tag-details');
                });
            }else{
                database.run(sql_update, response, (err)=>{
                    if(err) throw err;
                    res.redirect('/tag-details');
                });
            }
        });

    });  
}

exports.saveChangingsTags = function(req, res){
    let changes;
    if(req.body.changes != ""){
        changes = JSON.parse(req.body.changes.toLowerCase());
    }else{
        return res.redirect('/tags');
    }
    
    let sql_update = "UPDATE tags SET tag=? WHERE id=?";
    for(let i = 0; i<changes.length; i++){
        database.serialize(function(){
            database.run(sql_update, changes[i].new_line, changes[i].id, (err)=>{
                if(err) throw err;
            });
        });
    }
    res.redirect('/tags');
}

exports.createNewTag = function(req, res){
    let new_tag = req.body.newTag.toLowerCase();
    let sql_check = 'SELECT id FROM tags WHERE tag =?';
    let sql_run = 'INSERT INTO tags (tag) VALUES(?)';

    database.get(sql_check, new_tag, (err, row)=>{
        if(err) throw err;
        if(row){
            res.redirect('/tags');
        }else{
            database.run(sql_run, new_tag, (err)=>{
                if(err) throw err;
                res.redirect('/tags');
            });
        } 
    });
}

exports.deleteTag = function(req, res){
    let tag = req.body.tag;
    let sql_tagid = 'SELECT id FROM tags WHERE tag = ?';
    let sql_delete_intents = 'DELETE FROM intents WHERE tagid=?';
    let sql_delete_tag = 'DELETE FROM tags WHERE id=?';

    database.get(sql_tagid, tag, (err, tagid)=>{
        if(err) throw err;
        database.run(sql_delete_intents, tagid.id, (err)=>{
            if(err) throw err;
            database.run(sql_delete_tag, tagid.id, (err)=>{
                if(err) throw err;
                res.redirect('/tags');
            });
        });
    });
}

exports.overview = function(req, res){
    if (req.session.group) {    //if cookie for group is existing, it should be deleted
        delete req.session.group;
    }
    let sql_get_groups = 'SELECT * FROM groups'
    database.all(sql_get_groups, (err, groups)=>{
        if(err) throw err;
        res.render('overview', { groups: groups })   //render overview.ejs with groups variable
    });
}

exports.createNewGroup = function(req, res){
    let name = req.body.newGroup;
    let sql_check = 'SELECT COUNT(*) AS "check" FROM groups WHERE name=?';
    let sql_run = "INSERT INTO groups (name) VALUES (?)";

    database.get(sql_check, name, (err, row)=>{
        if(err) throw err;
        if(row.check != 0){
            res.redirect("/");
        }
        if(row.check == 0){
            database.run(sql_run, name, (err)=>{
                if(err) throw err;
                res.redirect("/");
            });
        }
    });
}

exports.saveChangingsGroups = function(req, res){
    let changes;
    if(req.body.changes != ""){
        changes = JSON.parse(req.body.changes.toLowerCase());
    }else{
        return res.redirect('/');
    }
    let sql_update = "UPDATE groups SET name=? WHERE id=?";
    for(let i = 0; i<changes.length; i++){
        database.serialize(function(){
            database.run(sql_update, changes[i].new_line, changes[i].id, (err)=>{
                if(err) throw err;
            });
        });
    }
    res.redirect('/');
}

exports.deleteGroup = function(req, res){
    let tag = req.body.group;
    let groupid = 'SELECT id FROM groups WHERE name = ?';
    let sql_update_tags = 'UPDATE tags SET groupid = NULL WHERE groupid =?';
    let sql_delete_group = 'DELETE FROM groups WHERE id=?';

    database.get(groupid, tag, (err, groupid)=>{
        if(err) throw err;
        database.run(sql_update_tags, groupid.id, (err)=>{
            if(err) throw err;
            database.run(sql_delete_group, groupid.id, (err)=>{
                if(err) throw err;
                res.redirect('/');
            });
        });
    });
}

exports.showGroupDetail = function(req, res){
    let group = req.body.groupName;
    req.session.group = group;         //creating cookie with the tag as content
    res.redirect('/tags');
}

exports.assignGroup = function(req, res){
    let tag = req.body.name;
    let group = req.body.group;
    let sql_groupid = 'SELECT id FROM groups WHERE name=?'
    let sql_run = 'UPDATE tags SET groupid =? WHERE tag=?'
    let sql_run_null = 'UPDATE tags SET groupid= NULL WHERE tag=?'
    if(group == "none"){
        database.run(sql_run_null, tag, (err)=>{
            if(err)throw err;
            res.redirect('/tags')
        });
    }else{
        database.get(sql_groupid, group, (err, id)=>{
            if(err)throw err;
            database.run(sql_run, id.id, tag, (err)=>{
                if(err)throw err;
                res.redirect('/tags')
            });
        });
    }
    
}