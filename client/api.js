let taskList = document.getElementById("tasks-list");
let titleList;
function fetchAllTasks() {
    fetch('http://localhost:5056/tasks')
        .then(response => response.json())
        .then(data => data.forEach(task => {
            titleList = document.createElement("li")
            titleList.textContent = task.title
            taskList.appendChild(titleList)
        }));
}