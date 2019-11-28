"use strict";
var allprojects = [];
var selectedproject = 0;
if (window.location.hash.length > 0) {
    var n = Number.parseInt(window.location.hash.replace("#", ""));
    if (!isNaN(n))
        selectedproject = n;
}


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
}

loadData();