
let st = "TO DO";
let urg = "LOW";
let curTaskId = 0;
let curTaskIdToDelete = 0;
let curProjId = 4;
let curProjectDirectory;

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

fetchAllTasks(curProjId);
fetchAllProjects();