const createTaskform = document.getElementById("createTask");
const updateTaskform = document.getElementById("updateTask");
const createProjectForm = document.getElementById("createProject");
const statusDropDown = document.getElementById("statusDropDownOptions");
const urgencyDropDown = document.getElementById("urgencyDropDownOptions");
const updateStatusDropDown = document.getElementById("updateStatusDropDownOptions");
const updateUrgencyDropDown = document.getElementById("updateUrgencyDropDownOptions");

const createPopUp = document.getElementById("popUp");
const updatePopUp = document.getElementById("updatePopUp");
const delPopUp = document.getElementById("deletePopUp");
const createNewProjectPopUp = document.getElementById("createNewProjectPopUp");

//FORM INPUTS TO CREATE
const title = document.getElementById("title");
const summary = document.getElementById("summary");
const description = document.getElementById("description");
const assignee = document.getElementById("assignee");
const parentTask = document.getElementById("parent");
const startDate = document.getElementById("start_date");
const dueDate = document.getElementById("due_date");
const owner = document.getElementById("owner");
const curStatus = document.getElementById("curStatus");
const curUrgency = document.getElementById("curUrgency");

//FORM INPUTS FOR UPDATING
const updateTitle = document.getElementById("updateTitle");
const updateSummary = document.getElementById("updateSummary");
const updateDescription = document.getElementById("updateDescription");
const updateAssignee = document.getElementById("updateAssignee");
const updateParentTask = document.getElementById("updateParent");
const updateStartDate = document.getElementById("updateStartDate");
const updateDueDate = document.getElementById("updateDueDate");
const updateOwner = document.getElementById("updateOwner");
const updateCurStatus = document.getElementById("updateCurStatus");
const updateCurUrgency = document.getElementById("updateCurUrgency");

//FORM INPUTS FOR PROJECT CREATION
const projectName = document.getElementById("projName");
const projectDescription = document.getElementById("projDescription");
const projOwner = document.getElementById("projOwner");
const projectCreateDate = document.getElementById("projectCreateDate");

//BUTTON TO DELETE TASK
const deleteBtn = document.getElementById("deleteBtn");
const confirmDel = document.getElementById("confirmDel");
const projectNameText = document.getElementById("deleteProjectName");

//SORTABLE
const todo_col = document.getElementById("todo_col");
const inprog_col = document.getElementById("inprog_col");
const inrew_col = document.getElementById("inrew_col");
const done_col = document.getElementById("done_col");

//SIDE MENU
const sideMenu = document.getElementById("sideMenu");
const toggleSideMenuText = document.getElementById("toggleSideMenuText");
const listOfCurProjects = document.getElementById("listOfProjects");
const curProjectName = document.getElementById("curProjectName");

let st = "TO DO";
let urg = "LOW";
let curTaskId = 0;
let curTaskIdToDelete = 0;
let curProjId = 4;
let curProjectDirectory;

// VVV THIS IS FOR MOVING TASK AROUND TO EACH COL VVV
new Sortable(todo_col, {
    group: "tasks",
    draggable: ".task-card",
    filter: ".no-drag",
    onAdd: function(event) {
        removeBg(event.item);
        addBg(event.item, "bg-blue-600");
        updateStatusOnColSwitch(event.item.id, "TO DO");
    },
});

new Sortable(inprog_col, {
    group: "tasks",
    draggable: ".task-card",
    filter: ".no-drag",
    onAdd: function(event) {
        removeBg(event.item);
        addBg(event.item, "bg-green-600");
        updateStatusOnColSwitch(event.item.id, "IN PROGRESS");
    },
});

new Sortable(inrew_col, {
    group: "tasks",
    draggable: ".task-card",
    filter: ".no-drag",
    onAdd: function(event) {
        removeBg(event.item);
        addBg(event.item, "bg-yellow-600");
        updateStatusOnColSwitch(event.item.id, "IN REVIEW");
    },
});
new Sortable(done_col, {
    group: "tasks",
    draggable: ".task-card",
    filter: ".no-drag",
    onAdd: function(event) {
        removeBg(event.item);
        addBg(event.item, "bg-red-600");
        updateStatusOnColSwitch(event.item.id, "DONE");
    },
});

async function fetchAllProjects() {
    let proj;
    const projs = await fetch(`http://localhost:5056/Projects`);
    for(proj of await projs.json()) {
        const projNameSpan = document.createElement("span");
        projNameSpan.className = "font-playfair text-xl cursor-pointer";
        projNameSpan.textContent = proj.title;
        projNameSpan.setAttribute("onclick", `switchProj(${proj.id.toString()})`);
        listOfCurProjects.appendChild(projNameSpan);
    }
}

async function switchProj(newProjId) {
    curProjId = newProjId;
    todo_col.innerHTML = "";
    inprog_col.innerHTML = "";
    inrew_col.innerHTML = "";
    done_col.innerHTML = "";
    const response = await fetch(`http://localhost:5056/Projects/${curProjId}`);
    const project = await response.json();
    curProjectName.textContent = project.title;
    curProjectDirectory = project.title;
    console.log(curProjectDirectory);

    fetchAllTasks(newProjId); 
}

//FETCHING ALL TASKS WHEN SITE IS LOADED
async function fetchAllTasks(projId) {
    let task;
    const tasks = await fetch(`http://localhost:5056/Tasks/project/${projId}`);
    for(task of await tasks.json()){
        createTaskCard(task);
    }
}

//HELPER FUNCTION TO CHANGE URGENCY TEXT
function fetchUrgency(taskUrgency) {
    let res = "";
    switch(taskUrgency) {
        case "LOW":
            res = "!";
            break;
        case "URGENT":
            res = "!!";
            break;
        case "CRITICAL":
            res = "!!!";
            break;
        case "PRIORITY":
            res = "!!!!";
            break;
    }
    return res;

}

fetchAllTasks(curProjId);
fetchAllProjects();

//EVENT LISTENER FOR CREATE FORM
createTaskform.addEventListener("submit", async function(event) {
    //STOPS THE PAGE FROM REFRESHING AFTER SUBMITTING
    event.preventDefault();

    //CONVERTING THE TIME FORMAT TO FULL ISO
    const fullISOStart = startDate.value ? new Date(startDate.value).toISOString() : null;
    const fullISODue = dueDate.value ? new Date(dueDate.value).toISOString() : null;

    const task = {
        title: title.value,
        summary: summary.value,
        description: description.value,
        assignee: assignee.value,
        parentTask: parentTask.value,
        startDate: fullISOStart,
        dueDate: fullISODue,
        owner: owner.value,
        status: st,
        urgency: urg,
        projectId: curProjId,
        projectName: curProjectDirectory
    }

    const response = await fetch("http://localhost:5056/Tasks", {
        method: "Post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    const responseJSON = await response.json();

    console.log(responseJSON);

    createTaskCard(responseJSON);

    //GETS RID OF POPUP AFTER UPDATING
    if(createPopUp.classList.contains("opacity-100")) {
        createPopUp.classList.remove("opacity-100");
        createPopUp.classList.add("opacity-0");

        createPopUp.classList.remove("pointer-events-auto");
        createPopUp.classList.add("pointer-events-none");
    }

    createTaskform.reset();

    console.log(responseJSON);
})

//HELPER FUNCTION TO CREATE TASK CARDS
function createTaskCard(task) {
    const newTask = document.createElement("div");
    const titleDiv = document.createElement("div");
    const projNameDiv = document.createElement("div");
    const deleteButton = document.createElement("button");
    const projName = document.createElement("span");
    const title = document.createElement("span");
    const urgency = document.createElement("span");
    const taskId = task.id;
    newTask.setAttribute("onclick", `showUpdateTask(${task.id.toString()}, event)`);
    newTask.setAttribute("id", task.id.toString());

    //ADDING ATTRIBUTES TO THE DELETE BUTTON
    deleteButton.setAttribute("id", "deleteBtn");
    deleteButton.setAttribute("name", `PROJ_${task.id.toString()}`);
    deleteButton.addEventListener("click", function(event) {
        showDeletePopUp(deleteButton, taskId);
        event.stopPropagation();
    })

    newTask.className = "relative rounded-md p-2 font-playfair text-2xl text-bold task-card cursor-pointer button-anim mb-2 group";

    //ADDING CLASS STYLING
    titleDiv.className = "flex h-fit";
    projNameDiv.className = "flex";

    deleteButton.className = "flex leading-none text-2xl ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-700 font-sans";

    urgency.className = "text-2xl text-red-800 ml-auto pr-1";
    title.className = "flex w-1/2";
    projName.className = "text-lg";

    //CHANGING TEXT
    title.textContent = task.title;
    deleteButton.textContent = "X";
    urgency.textContent = fetchUrgency(task.urgency);
    //~~~ PROJ_ IS JUST FILLER FOR NOW, I'LL CHANGE LATER TO REFLECT ACTUAL PROJECTS ~~~
    const projectName = task.projectName;
    projName.textContent = `${projectName.substring(0,4).toUpperCase()}-${task.taskNumber}`;

    switchTaskStatus(task, titleDiv, title, deleteButton, projNameDiv, projName, urgency, newTask);
}

//HELPER FUNCTION TO APPLY BG COLOR AND APPENDING TASK TO CORRECT COLUMN
function switchTaskStatus(task, titleDiv, taskTitle, deleteButton, projNameDiv, projName, urgency, newTask) {
    let bgColor;
    let column;
    //APPENDING EVERYTHING TOGETHER
    titleDiv.appendChild(taskTitle);
    titleDiv.appendChild(deleteButton);

    projNameDiv.appendChild(projName);
    projNameDiv.appendChild(urgency);

    newTask.appendChild(titleDiv);
    newTask.appendChild(projNameDiv);
    console.log(task.status);
    switch(task.status) {
        case "TO DO":
            //ADDING CLASSES
            bgColor = "bg-blue-600";
            column = todo_col;
            break;
        case "IN PROGRESS":
            //ADDING CLASSES
            bgColor = "bg-green-600";
            column = inprog_col;
            break;
        case "IN REVIEW":
            bgColor = "bg-yellow-600";
            column = inrew_col;
            break;
        case "DONE":
            bgColor = "bg-red-600";
            column = done_col;
            break;
    }
    newTask.classList.add(bgColor);
    column.appendChild(newTask);
}

//FOR UPDATING FORM
updateTaskform.addEventListener("submit", async function(event) {
    //STOPS THE PAGE FROM REFRESHING AFTER SUBMITTING
    event.preventDefault();

    const taskBeforeUpdate = await fetch(`http://localhost:5056/Tasks/${curTaskId}`);
    const taskBeforeUpdateJson = await taskBeforeUpdate.json();

    //CONVERTING THE TIME FORMAT TO FULL ISO
    const fullISOStart = startDate.value ? new Date(updateStartDate.value).toISOString() : null;
    const fullISODue = dueDate.value ? new Date(updateDueDate.value).toISOString() : null;

    const task = {
        title: updateTitle.value,
        summary: updateSummary.value,
        description: updateDescription.value,
        assignee: updateAssignee.value,
        parentTask: updateParentTask.value,
        startDate: fullISOStart,
        dueDate: fullISODue,
        owner: updateOwner.value,
        status: st,
        urgency: urg
    }
    const response = await fetch(`http://localhost:5056/Tasks/${curTaskId}`, {
        method: "Put",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });
    const responseJSON = await response.json();

    if(taskBeforeUpdate.title !== responseJSON.title) {
        const curDOM = document.getElementById(curTaskId);
        curDOM.children[0].children[0].textContent = responseJSON.title;
    }

    if(taskBeforeUpdate.urgency !== responseJSON.urgency) {
        const curDOM = document.getElementById(curTaskId);
        curDOM.children[1].children[1].textContent = fetchUrgency(responseJSON.urgency);
    }

    // STORE CURRENT
    // DELETE PREVIOUS
    // PUT CURRENT IN THE CORRECT COL
    if(taskBeforeUpdateJson.status !== responseJSON.status) {
        let curBg;
        let curCol;
        const savedCurElement = document.getElementById(curTaskId);
        document.getElementById(curTaskId).remove();
        switch(responseJSON.status) {
            case "TO DO":
                curBg = "bg-blue-600";
                curCol = todo_col;
                break;
            case "IN PROGRESS":
                curBg = "bg-green-600";
                curCol = inprog_col;
                break;
            case "IN REVIEW":
                curBg = "bg-yellow-600";
                curCol = inrew_col;
                break;
            case "DONE":
                curBg = "bg-red-600";
                curCol = done_col;
                break;
        }
        removeBg(savedCurElement);
        addBg(savedCurElement, curBg);
        curCol.appendChild(savedCurElement);
    }

    if(taskBeforeUpdateJson.urgency !== responseJSON.urgency) {
        const curTask = document.getElementById(curTaskId);
        curTask.children[1].children[1].textContent = fetchUrgency(responseJSON.urgency);
    }

    //GETS RID OF POPUP AFTER UPDATING
    if(updatePopUp.classList.contains("opacity-100")) {
        updatePopUp.classList.remove("opacity-100");
        updatePopUp.classList.add("opacity-0");

        updatePopUp.classList.remove("pointer-events-auto");
        updatePopUp.classList.add("pointer-events-none");
    }

    console.log(responseJSON);

})

confirmDel.addEventListener("click", async function (event) {
    event.stopPropagation();
    const response = await fetch(`http://localhost:5056/Tasks/${curTaskIdToDelete}`, {
        method: "Delete"
    })

    document.getElementById(curTaskIdToDelete).remove();

    if(delPopUp.classList.contains("opacity-100")) {
        delPopUp.classList.remove("opacity-100");
        delPopUp.classList.add("opacity-0");

        delPopUp.classList.remove("pointer-events-auto");
        delPopUp.classList.add("pointer-events-none");
    }
    console.log(response.status);
})

createProjectForm.addEventListener("submit", async function (event) {
    event.stopPropagation();
    event.preventDefault();

    const project= {
        title: projectName.value,
        description: projectDescription.value,
        owner: projOwner.value
    }

    const response = await fetch("http://localhost:5056/Projects", {
        method: "Post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(project)
    });

    const responseJSON = await response.json();

    //ADDING NEW PROJECT NAME TO SIDE MENU
    const newProjectTitle = document.createElement("span");
    newProjectTitle.textContent = responseJSON.title;
    newProjectTitle.className = "font-playfair text-2xl cursor-pointer";
    newProjectTitle.setAttribute("onclick", `switchProj(${responseJSON.id.toString()})`);
    listOfCurProjects.appendChild(newProjectTitle);

    //GETS RID OF POPUP AFTER CREATING PROJECT
    if(createNewProjectPopUp.classList.contains("opacity-100")) {
        createNewProjectPopUp.classList.remove("opacity-100");
        createNewProjectPopUp.classList.add("opacity-0");

        createNewProjectPopUp.classList.remove("pointer-events-auto");
        createNewProjectPopUp.classList.add("pointer-events-none");
    }
})

//STOPS THE FORM FROM DISAPPEARING IF CLICKED INSIDE
createTaskform.addEventListener("click", function(event) {
    event.stopPropagation();
})

updateTaskform.addEventListener("click", function(event) {
    event.stopPropagation();
})

deleteBtn.addEventListener("click", function(event) {
    event.stopPropagation();
})

createProjectForm.addEventListener("click", function(event) {
    event.stopPropagation();
})

createTaskform.addEventListener("click", function() {
    if(statusDropDown.classList.contains("opacity-100")) {
        statusDropDown.classList.remove("opacity-100");
        statusDropDown.classList.add("opacity-0");

        statusDropDown.classList.remove("pointer-events-auto");
        statusDropDown.classList.add("pointer-events-none");
    }

    if(urgencyDropDown.classList.contains("opacity-100")) {
        urgencyDropDown.classList.remove("opacity-100");
        urgencyDropDown.classList.add("opacity-0");

        urgencyDropDown.classList.remove("pointer-events-auto");
        urgencyDropDown.classList.add("pointer-events-none");
    }
})

updateTaskform.addEventListener("click", function() {
    if(updateStatusDropDown.classList.contains("opacity-100")) {
        updateStatusDropDown.classList.remove("opacity-100");
        updateStatusDropDown.classList.add("opacity-0");

        updateStatusDropDown.classList.remove("pointer-events-auto");
        updateStatusDropDown.classList.add("pointer-events-none");
    }

    if(updateUrgencyDropDown.classList.contains("opacity-100")) {
        updateUrgencyDropDown.classList.remove("opacity-100");
        updateUrgencyDropDown.classList.add("opacity-0");

        updateUrgencyDropDown.classList.remove("pointer-events-auto");
        updateUrgencyDropDown.classList.add("pointer-events-none");
    }
})


document.addEventListener("click", function(e) {
    if(createPopUp.classList.contains("opacity-100")) {
        createPopUp.classList.remove("opacity-100");
        createPopUp.classList.add("opacity-0");

        createPopUp.classList.remove("pointer-events-auto");
        createPopUp.classList.add("pointer-events-none");

        createTaskform.reset();

        //DEBUGGING MESSAGE
        console.log("hiding create task pop up");
    }

    if(updatePopUp.classList.contains("opacity-100")) {
        updatePopUp.classList.remove("opacity-100");
        updatePopUp.classList.add("opacity-0");

        updatePopUp.classList.remove("pointer-events-auto");
        updatePopUp.classList.add("pointer-events-none");

        //DEBUGGING MESSAGE
        console.log("hiding update task pop up");
    }

    if(delPopUp.classList.contains("opacity-100")) {
        delPopUp.classList.remove("opacity-100");
        delPopUp.classList.add("opacity-0");

        delPopUp.classList.remove("pointer-events-auto");
        delPopUp.classList.add("pointer-events-none");

        //DEBUGGING MESSAGE
        console.log("hiding delete task pop up");
    }

    if(createNewProjectPopUp.classList.contains("opacity-100")) {
        createNewProjectPopUp.classList.remove("opacity-100");
        createNewProjectPopUp.classList.add("opacity-0");

        createNewProjectPopUp.classList.remove("pointer-events-auto");
        createNewProjectPopUp.classList.add("pointer-events-none");

        createProjectForm.reset();

        //DEBUGGING MESSAGE
        console.log("hiding delete task pop up");
    }
})

async function updateStatusOnColSwitch(taskId, newStatus) {
    const taskToUpdate = await fetch(`http://localhost:5056/Tasks/${taskId}`);
    const taskJSON = await taskToUpdate.json();
    console.log(taskJSON);

    //CONVERTING THE TIME FORMAT TO FULL ISO
    const fullISOStart = taskJSON.startDate ? new Date(taskJSON.startDate).toISOString() : null;
    const fullISODue = taskJSON.dueDate ? new Date(taskJSON.dueDate).toISOString() : null;

    const task = {
        title: taskJSON.title,
        summary: taskJSON.summary,
        description: taskJSON.description,
        assignee: taskJSON.assignee,
        parentTask: taskJSON.parentTask,
        startDate: fullISOStart,
        dueDate: fullISODue,
        owner: taskJSON.owner,
        status: newStatus,
        urgency: urg,
    }
    const response = await fetch(`http://localhost:5056/Tasks/${taskId}`, {
        method: "Put",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    console.log(await response.json());
}

function activateStatusDropBox(event, statDropDown, urgentDropDown) {
    if(statDropDown.classList.contains("opacity-0")) {
        event.stopPropagation();
        
        statDropDown.classList.remove("opacity-0");
        statDropDown.classList.remove("pointer-events-none");

        if(urgentDropDown.classList.contains("opacity-100")) urgentDropDown.classList.remove("opacity-100"); urgentDropDown.classList.add("opacity-0")
        if(urgentDropDown.classList.contains("pointer-events-auto")) urgentDropDown.classList.remove("pointer-events-auto"); urgentDropDown.classList.add("pointer-events-none")

        statDropDown.classList.add("opacity-100");
        statDropDown.classList.add("pointer-events-auto");

        //DEBUGGING MESSAGE
        console.log("openning statusDropDown");

        //NOTES:
        //pointer-events-none: Makes it so that you can click through without activating
    }
}

function activateUrgencyDropBox(event, urgentDropDown, statDropDown) {
    if(urgentDropDown.classList.contains("opacity-0")) {
        event.stopPropagation();
        
        urgentDropDown.classList.remove("opacity-0");
        urgentDropDown.classList.remove("pointer-events-none");

        if(statDropDown.classList.contains("opacity-100")) statDropDown.classList.remove("opacity-100"); statDropDown.classList.add("opacity-0")
        if(statDropDown.classList.contains("pointer-events-auto")) statDropDown.classList.remove('pointer-events-auto'); statDropDown.classList.add("pointer-events-none")

        urgentDropDown.classList.add("opacity-100");
        urgentDropDown.classList.add("pointer-events-auto");

        //DEBUGGING MESSAGE
        console.log("openning urgencyDropDown");
    }
}

//CHANGE STATUS FOR DROPDOWN
function changeStatus(status, statusDOM) {
    st = status;
    switchOption(status, "TO DO", "IN PROGRESS", "IN REVIEW", "DONE", "bg-blue-800", "bg-green-800", "bg-yellow-800", "bg-red-800", "text-blue-500", "text-green-500", "text-yellow-500", "text-red-500", statusDOM);
    
    //REMOVING THE DROPDOWN AFTER MAKING A CHOICE
    statusDropDown.classList.remove("opacity-100");
    statusDropDown.classList.remove("pointer-events-auto");

    statusDropDown.classList.add("opacity-0");
    statusDropDown.classList.add("pointer-events-none");
    
    //DEBUGGING MESSAGE
    console.log(st);
}

//CHANGE URGENCY FOR DROPDOWN
function changeUrgency(urgency, urgencyDOM) {
    urg = urgency;
    switchOption(urgency, "LOW", "URGENT", "CRITICAL", "PRIORITY", "bg-green-800", "bg-yellow-800", "bg-orange-800", "bg-red-800", "text-green-500", "text-yellow-500", "text-orange-500", "text-red-500", urgencyDOM);
    
    urgencyDropDown.classList.remove("opacity-100");
    urgencyDropDown.classList.remove("pointer-events-auto");

    urgencyDropDown.classList.add("opacity-0");
    urgencyDropDown.classList.add("pointer-events-none");

    //DEBUGGING MESSAGE
    console.log(urg);
}

//***** ALL THE POP UPS BELONG HERE ******

//FUNCTION TO SHOW CREATE TASK POP UP
function showCreateTask(status, event){
    event.stopPropagation();
    st = status;
    switchOption(status, "TO DO", "IN PROGRESS", "IN REVIEW", "DONE", "bg-blue-800", "bg-green-800", "bg-yellow-800", "bg-red-800", "text-blue-500", "text-green-500", "text-yellow-500", "text-red-500", curStatus);

    if(createPopUp.classList.contains("opacity-0")) {
        createPopUp.classList.remove("opacity-0");
        createPopUp.classList.remove("pointer-events-none");

        createPopUp.classList.add("opacity-100");
        createPopUp.classList.add("pointer-events-auto");

    }
}

//FUNCTION TO SHOW UPDATE TASK POP UP
async function showUpdateTask(id, event) {
    event.stopPropagation();
    curTaskId = id;
    const getTask = await fetch(`http://localhost:5056/Tasks/${id}`);
    const task = await getTask.json();

    console.log(task);
    console.log(task.urgency);

    updateTitle.value = task.title;
    updateSummary.value = task.summary;
    updateDescription.value = task.description;
    updateAssignee.value = task.assignee;
    updateParentTask.value = task.parentTask;
    updateStartDate.value = task.startDate;
    updateDueDate.value = task.dueDate;
    updateOwner.value = task.owner;
    updateCurStatus.value = task.status;
    updateCurUrgency.value = task.urgency;

    changeStatus(task.status, updateCurStatus);
    changeUrgency(task.urgency, updateCurUrgency);

    if(updatePopUp.classList.contains("opacity-0")) {
        updatePopUp.classList.remove("opacity-0");
        updatePopUp.classList.remove("pointer-events-none");

        updatePopUp.classList.add("opacity-100");
        updatePopUp.classList.add("pointer-events-auto");
    }
}



function showDeletePopUp(proj, projId) {
    if(delPopUp.classList.contains("opacity-0")) {
        delPopUp.classList.remove("opacity-0");
        delPopUp.classList.remove("pointer-events-none");

        delPopUp.classList.add("opacity-100");
        delPopUp.classList.add("pointer-events-auto");
        
        projectNameText.textContent = proj.name;
        curTaskIdToDelete = projId;
    }
}

function showCreateProject(event) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    console.log(today);

    //SHOWING USERS THAT THE CREATE DATE WILL ALWAYS BE TODAY
    projectCreateDate.placeholder = today;

    event.stopPropagation();
    if(createNewProjectPopUp.classList.contains("opacity-0")) {
        createNewProjectPopUp.classList.remove("opacity-0");
        createNewProjectPopUp.classList.remove("pointer-events-none");

        createNewProjectPopUp.classList.add("opacity-100");
        createNewProjectPopUp.classList.add("pointer-events-auto");
    }

}

function toggleSideMenu() {
    if(sideMenu.classList.contains("-translate-x-64")) {
        sideMenu.classList.remove("-translate-x-64");
        toggleSideMenuText.textContent = "< \n < \n <";
    } else {
        sideMenu.classList.add("-translate-x-64");
        toggleSideMenuText.textContent = "> \n > \n >";
    }
}



//HELPER FUNCTIONS FOR REMOVING BACKGROUND COLOR
function removeBg(item) {
    const bgClass = [...item.classList].find(cls => cls.startsWith("bg-"));
    if(bgClass) item.classList.remove(bgClass);
}

function addBg(item, bgColor) {
    item.classList.add(bgColor);
}


//HELPER FUNCTION FOR REMOVING TEXT COLOR
function removeTextColor(child1, child2) {
    const textClass = [...child1.classList].find(cls => cls.startsWith("text-"));
    const textClass2 = [...child2.classList].find(cls => cls.startsWith("text-"));

    if(textClass) child1.classList.remove(textClass);
    if(textClass2) child2.classList.remove(textClass2);
}

function addTextColor(child1, color1, child2, color2) {
    child1.classList.add(color1);
    child2.classList.add(color2);
}

//SWITCHING DROPDOWN OPTIONS FUNCTION
function switchOption(choice, o1, o2, o3, o4, o1c, o2c, o3c, o4c, o1tc, o2tc, o3tc, o4tc, curChoice) {
    curChoice.children[0].textContent = choice;
    console.log(curChoice.children[0]);
    console.log(curChoice.children[1]);
    
    switch (choice) {
        case o1:
            removeBg(curChoice);
            addBg(curChoice, o1c);

            removeTextColor(curChoice.children[0], curChoice.children[1]);
            addTextColor(curChoice.children[0], o1tc, curChoice.children[1], o1tc);
            break;
        case o2:
            removeBg(curChoice);
            addBg(curChoice, o2c);

            removeTextColor(curChoice.children[0], curChoice.children[1]);
            addTextColor(curChoice.children[0], o2tc, curChoice.children[1], o2tc);
            break;
        case o3:
            removeBg(curChoice);
            addBg(curChoice, o3c);

            removeTextColor(curChoice.children[0], curChoice.children[1]);
            addTextColor(curChoice.children[0], o3tc, curChoice.children[1], o3tc);
            break;
        case o4:
            removeBg(curChoice);
            addBg(curChoice, o4c);

            removeTextColor(curChoice.children[0], curChoice.children[1]);
            addTextColor(curChoice.children[0], o4tc, curChoice.children[1], o4tc);
            break;
    }
}

//BUGS / FEATURES TO FIX OR ADD LATER:
//RIGHT NOW CUR DIRECTORY NAME ONLY WORKS WHEN WE SWITCH DIRECTORIES

//TO DO LIST:
//1. ABILITY TO MAKE ACCOUNTS
//3. ADD PPL TO PROJECTS