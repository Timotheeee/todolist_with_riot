#!/usr/bin/env node

const express = require('express'),
        bodyParser = require('body-parser'),
        morgan = require('morgan'),
        app = express();

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

//could use a db instead
const fs = require('fs');
function save() {
    fs.writeFile("./db.json", JSON.stringify(allprojects), function (err) {
        if (err) {
            return console.log(err);
        }
        //console.log("The file was saved!");
    });
}
function load() {
    fs.readFile("./db.json", function (err, data) {
        //console.log(data);
        if (err) {
            return;// console.log(err);
        }
        try {
            var res = JSON.parse(data);
            allprojects = res;
        } catch (e) {

        }

        //console.log("The file was read!");
    });
}


var allprojects = [];
load();
//        [
////    {id: 0, client_id: uuid(), title: "learn riot", active: true, tasks: [
////            {id: 0, client_id: uuid(), done: false, title: "ms1", due_date: "13.11.2019", priority: 3}
////        ]},
////    {id: 0, client_id: uuid(), title: "finish this", active: true, tasks: [
////            {id: 0, client_id: uuid(), done: false, title: "ms2", due_date: "14.11.2019", priority: 2},
////            {id: 0, client_id: uuid(), done: false, title: "ms3", due_date: "15.11.2019", priority: 1}
////        ]}
//];

function find(id) {
    //console.log("running find with " + id);
    for (var i = 0; i < allprojects.length; i++) {
        if (allprojects[i].client_id === id)
            return allprojects[i];
    }
}

function findIssue(id,issueid) {
    //console.log("running find with " + id);
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
app.get('/api/projects/*', function (req, res) { //
    projects(req, res, "get");
});
app.post('/api/projects/', function (req, res) {
    projects(req, res, "post");
});

//todo
function projects(req, res, type) {
    var data = req.body.data;
    var url = req.url.replace("/api/projects/", "");
    switch (type) {
        case "delete":
            allprojects.splice(id, 1);
            res.status(200).json({msg: "ok"});
            save();
            break;
        case "put"://todo
            //allprojects[id] = req.body.data;
            res.status(200).json({allprojects});
            break;
        case "get":
            res.status(200).json({allprojects, proj: find(url)});
            break;
        case "post":
            var client_id = uuid();
            allprojects.push({id: 0, client_id, title: data, active: true, tasks: []})
            res.status(200).json({client_id, allprojects});
            save();
            break;
        default:

            break;
    }
    save();
    //console.log(JSON.stringify(req.body) + " " + type);
    //res.status(200).json({stuff: req.body, type});
}

app.delete('/api/project/*', function (req, res) {
    project(req, res, "delete");
});
app.put('/api/project/*', function (req, res) {
    project(req, res, "put");
});
app.get('/api/project/*', function (req, res) { //
    project(req, res, "get");
});
app.post('/api/project/*', function (req, res) {
    project(req, res, "post");
});

//todo
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
        case "put":
            //allprojects[id] = req.body.data;
            //find(projectid).tasks
            var i = findIssue(projectid,issueid);
            i.done = !i.done;
            res.status(200).json({done:i.done});
            break;
        case "get":
            res.status(200).json({allprojects, tasks: find(projectid).tasks});//
            break;
        case "post":
            var client_id = uuid();
            //id: 0, client_id: uuid(), done: false
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
    //console.log(JSON.stringify(req.body) + " " + type);
    //res.status(200).json({stuff: req.body, type});
}


app.listen(8000, function () {
    console.log("ready captain.");
});
