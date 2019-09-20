"use strict";
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
var allprojects = [];
var selectedproject = 0;
if (window.location.hash.length > 0) {
    var n = Number.parseInt(window.location.hash.replace("#", ""));
    if (!isNaN(n))
        selectedproject = n;
}

loadData();




function updateHTML() {
    for (var i = 0; i < allprojects[selectedproject].tasks.length; i++)
        allprojects[selectedproject].tasks[i].i = i;
    for (var i = 0; i < allprojects.length; i++)
        allprojects[i].i = i;


    if (window.todolist)
        todolist.update();

}
setTimeout(function () {
    //updateHTML();
}, 0);

function saveData() {
    localStorage.allprojects = JSON.stringify(allprojects);
}
function loadData() {
    if (localStorage.allprojects) {
        allprojects = JSON.parse(localStorage.allprojects);
    }
    console.log(allprojects);
    for (var i = 0; i < allprojects.length; i++) {
        $.ajax({url: "/api/projects/" + allprojects[i].client_id, method: "get"}).done(function (data2) {
            console.log(data2);
        });
        ;
    }

}

