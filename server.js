

const express = require('express'),
        bodyParser = require('body-parser'),
        morgan = require('morgan'),
        app = express();
app.use(express.static(__dirname + '/public'));


var server = app.listen(process.env.PORT || 8001, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('app listening at http://' + host + ':' + port);
});


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));



function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const fs = require('fs');
function save() {
    fs.writeFile("./db.json", JSON.stringify(allprojects), function (err) {
        if (err) {
            return console.log(err);
        }
    });
}
function load() {
    fs.readFile("./db.json", function (err, data) {
        if (err) {
            return;
        }
        try {
            var res = JSON.parse(data);
            allprojects = res;
        } catch (e) {

        }

    });
}


var allprojects = [];
load();


function find(id) {
    for (var i = 0; i < allprojects.length; i++) {
        if (allprojects[i].client_id === id)
            return allprojects[i];
    }
}

function findIssue(id,issueid) {
    var t = find(id).tasks;
    for (var i = 0; i < t.length; i++) {
        if (t[i].client_id === issueid)
            return t[i];
    }
}

app.delete('/api/projects/*', function (req, res) {
    projects(req, res, "delete");
});
app.put('/api/projects/*', function (req, res) {
    projects(req, res, "put");
});
app.get('/api/projects/*', function (req, res) {
    projects(req, res, "get");
});
app.post('/api/projects/', function (req, res) {
    projects(req, res, "post");
});


function projects(req, res, type) {
    var data = req.body.data;
    var url = req.url.replace("/api/projects/", "");
    switch (type) {
        case "delete":
            var id = find(data.id);
            allprojects.splice(id, 1);
            res.status(200).json({msg: "ok"});
            save();
            break;
        case "put":
            allprojects[id] = data;
            res.status(200).json({allprojects});
            break;
        case "get":
            res.status(200).json({allprojects, proj: find(url)});
            break;
        case "post"://project user story 1
            var client_id = uuid();
            allprojects.push({id: 0, client_id, title: data, active: true, tasks: []})
            res.status(200).json({client_id, allprojects});
            save();
            break;
        default:

            break;
    }
    save();
}

app.delete('/api/project/*', function (req, res) {
    project(req, res, "delete");
});
app.put('/api/project/*', function (req, res) {
    project(req, res, "put");
});
app.get('/api/project/*', function (req, res) { 
    project(req, res, "get");
});
app.post('/api/project/*', function (req, res) {
    project(req, res, "post");
});


function project(req, res, type) {
    var data = req.body;
    var url = req.url.replace("/api/project/", "");
    var params = url.split("/issues/");
    var projectid = params[0];
    var issueid = params[1];
    switch (type) {
        case "delete":
            find(projectid).tasks.splice(req.body.index, 1);
            res.status(200).json({msg: "ok"});
            break;
        case "put"://this is only ever used to update whether or not the issue is done
            var i = findIssue(projectid,issueid);
            i.done = !i.done;
            res.status(200).json({done:i.done});
            break;
        case "get":
            res.status(200).json({allprojects, tasks: find(projectid).tasks});
            break;
        case "post":
            var client_id = uuid();
            var newtask = data;
            newtask.id=0;
            newtask.client_id = client_id;
            newtask.done = false;
            find(projectid).tasks.push(newtask);
            res.status(200).json({client_id, allprojects});
            break;
        default:

            break;
    }
    save();
}


