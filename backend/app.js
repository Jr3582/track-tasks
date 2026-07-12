let st = "TO DO";
let urg = "LOW";
let curTaskId = 0;
let curTaskIdToDelete = 0;
let previousProject = localStorage.getItem("previousDirectory");
let curProjId = previousProject ? parseInt(previousProject) : null;
let curProjectDirectory = localStorage.getItem("previousDirectoryTitle");
let activeProjDiv = null;
let activeButton = null;
let activeProjectId = null;
let activeProjectName = null;
let timerId = 0;


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

    const response = await authFetch("http://localhost:5056/Tasks", {
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

    const taskBeforeUpdate = await authFetch(`http://localhost:5056/Tasks/${curTaskId}`);
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
    const response = await authFetch(`http://localhost:5056/Tasks/${curTaskId}`, {
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
        curDOM.children[1].children[1].children[1].textContent = fetchUrgency(responseJSON.urgency);
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
        curTask.children[1].children[1].children[1].textContent = fetchUrgency(responseJSON.urgency);
    }

    const curTask = document.getElementById(curTaskId);
    curTask.children[1].children[0].textContent = "Owner: " + responseJSON.owner;

    //GETS RID OF POPUP AFTER UPDATING
    if(updatePopUp.classList.contains("opacity-100")) {
        updatePopUp.classList.remove("opacity-100");
        updatePopUp.classList.add("opacity-0");

        updatePopUp.classList.remove("pointer-events-auto");
        updatePopUp.classList.add("pointer-events-none");
    }

    console.log(responseJSON);

})

//DELETE TASK / PROJECT PROMPTS
confirmDelTask.addEventListener("click", async function (event) {
    event.stopPropagation();
    await deleteTask(curTaskIdToDelete);

    document.getElementById(curTaskIdToDelete).remove();

    if(delPopUp.classList.contains("opacity-100")) {
        delPopUp.classList.remove("opacity-100");
        delPopUp.classList.add("opacity-0");

        delPopUp.classList.remove("pointer-events-auto");
        delPopUp.classList.add("pointer-events-none");
    }
})

confirmDelProj.addEventListener("click", async function (event) {
    event.stopPropagation();
    await deleteProject(activeProjectId);

    document.getElementById("projDivId_"+activeProjectId).remove();

    if(deleteProjectsPopUp.classList.contains("opacity-100")) {
        deleteProjectsPopUp.classList.remove("opacity-100");
        deleteProjectsPopUp.classList.add("opacity-0");

        deleteProjectsPopUp.classList.remove("pointer-events-auto");
        deleteProjectsPopUp.classList.add("pointer-events-none");
    }

    activeProjDiv = null;
})

confirmKeepTask.addEventListener("click", function() {
    if(delPopUp.classList.contains("opacity-100")) {
        delPopUp.classList.remove("opacity-100");
        delPopUp.classList.add("opacity-0");

        delPopUp.classList.remove("pointer-events-auto");
        delPopUp.classList.add("pointer-events-none");
    }
})

confirmKeepProj.addEventListener("click", function() {
    if(deleteProjectsPopUp.classList.contains("opacity-100")) {
        deleteProjectsPopUp.classList.remove("opacity-100");
        deleteProjectsPopUp.classList.add("opacity-0");

        deleteProjectsPopUp.classList.remove("pointer-events-auto");
        deleteProjectsPopUp.classList.add("pointer-events-none");
    }
})
//~~~~~~~~~~~~~~~END OF DELETE TASK AND PROJECT PROMPTS~~~~~~~~~~~~~~~

createProjectForm.addEventListener("submit", async function (event) {
    event.stopPropagation();
    event.preventDefault();
    const username = getOwner();
    if(projectName.value.length === 0) {
        invalidProjTitleMsg.classList.remove("hidden");
        invalidProjTitleMsg.textContent = "Please enter a name for your project!"
        return;
    } else {
        invalidOwnerMsg.classList.add("hidden");
    }

    if(projectDescription.value.length === 0) {
        invalidProjDescriptionMsg.classList.remove("hidden");
        invalidProjDescriptionMsg.textContent = "Please enter a short description of your project!"
        return;
    } else {
        invalidProjDescriptionMsg.classList.add("hidden");
    }

    if(projOwner.value.length === 0) {
        invalidOwnerMsg.classList.remove("opacity-0");
        invalidOwnerMsg.textContent = "Please enter a valid owner for the project!";
        return;
    } else {
        invalidOwnerMsg.classList.add("opacity-0");
    }

    //WHERE IM SETTING THE TITLE, DESCRIPTION, AND OWNER OF THE PROJECT
    const project= {
        title: projectName.value,
        description: projectDescription.value,
        owner: username
    }

    if(projectName.value.length >= 12) {
        projectName.value = projectName.value.slice(0,12)+"...";
    }

    const response = await authFetch("http://localhost:5056/Projects", {
        method: "Post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(project)
    });

    const responseJSON = await response.json();

    //ADDING NEW PROJECT NAME TO SIDE MENU
    const projNameWrapper = document.createElement("div");
    projNameWrapper.className = "nameWrapper"
    const moreOptionsBtn = document.createElement("button");
    moreOptionsBtn.className = "hidden group-hover:flex rounded-md pl-1 pr-1 h-full w-full items-center";
    const i = document.createElement("i");
    i.className = "fa-solid fa-ellipsis";
    const buttonDiv = document.createElement("div");
    buttonDiv.className = "absolute right-0 rounded-m hover:bg-gray-400 w-fit h-full rounded-md";
    const projDiv = document.createElement("div");
    projDiv.className = "group relative flex items-center justify-between bg-gray-300 w-full rounded-md hover:bg-gray-500 hover:scale-105 hover:z-20 cursor-pointer transition ease-in-out duration-300 px-1";
    const newProjectTitle = document.createElement("span");
    newProjectTitle.textContent = responseJSON.title;
    newProjectTitle.className = "font-playfair text-xl";
    projDiv.id = "projDivId_" + responseJSON.id;

    moreOptionsBtn.onclick = function(event) {
        toggleKebabMenu(event);
    }


    moreOptionsBtn.appendChild(i);
    buttonDiv.appendChild(moreOptionsBtn);
    projNameWrapper.appendChild(newProjectTitle);
    projDiv.appendChild(projNameWrapper);
    projDiv.appendChild(buttonDiv);
    projDiv.setAttribute("onclick", `switchProj(${responseJSON.id.toString()})`);
    listOfCurProjects.appendChild(projDiv);

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

deleteBtn?.addEventListener("click", function(event) {
    event.stopPropagation();
})

createProjectForm.addEventListener("click", function(event) {
    event.stopPropagation();
})

addMembersPopUp.addEventListener("click", function(event) {
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

    if(ownerDropDown.classList.contains("opacity-100")) {
        ownerDropDown.classList.remove("opacity-100");
        ownerDropDown.classList.add("opacity-0");
        ownerDropDown.classList.remove("pointer-events-auto");
        ownerDropDown.classList.add("pointer-events-none");
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

    if(updateOwnerDropDown.classList.contains("opacity-100")) {
        updateOwnerDropDown.classList.remove("opacity-100");
        updateOwnerDropDown.classList.add("opacity-0");
        updateOwnerDropDown.classList.remove("pointer-events-auto");
        updateOwnerDropDown.classList.add("pointer-events-none");
    }
})

document.addEventListener("click", function(e) {
    if(createPopUp.classList.contains("opacity-100")) {
        createPopUp.classList.remove("opacity-100");
        createPopUp.classList.add("opacity-0");

        createPopUp.classList.remove("pointer-events-auto");
        createPopUp.classList.add("pointer-events-none");

        createTaskform.reset();
    }

    if(updatePopUp.classList.contains("opacity-100")) {
        updatePopUp.classList.remove("opacity-100");
        updatePopUp.classList.add("opacity-0");

        updatePopUp.classList.remove("pointer-events-auto");
        updatePopUp.classList.add("pointer-events-none");

        updatePopUp.reset();
    }

    if(delPopUp.classList.contains("opacity-100")) {
        delPopUp.classList.remove("opacity-100");
        delPopUp.classList.add("opacity-0");

        delPopUp.classList.remove("pointer-events-auto");
        delPopUp.classList.add("pointer-events-none");

        delPopUp.reset();
    }

    if(createNewProjectPopUp.classList.contains("opacity-100")) {
        createNewProjectPopUp.classList.remove("opacity-100");
        createNewProjectPopUp.classList.add("opacity-0");

        createNewProjectPopUp.classList.remove("pointer-events-auto");
        createNewProjectPopUp.classList.add("pointer-events-none");

        createProjectForm.reset();
    }

    if(!kebabMenu.classList.contains("hidden") && !kebabMenu.contains(e.target) && !addMembersPopUp.contains(e.target) && !viewMembersPopUp.contains(e.target) && !deleteProjectsPopUp.contains(e.target)) {
        kebabMenu.classList.add("hidden");

        activeProjDiv.classList.remove("scale-105", "bg-gray-500");
        activeProjDiv.classList.add("hover:scale-105", "hover:bg-gray-500");

        activeButton.classList.add("hidden");
    }

    if(addMembersPopUp.classList.contains("opacity-100") && e.target === addMembersPopUp) {
        addMembersPopUp.classList.remove("opacity-100");
        addMembersPopUp.classList.add("opacity-0");

        addMembersPopUp.classList.remove("pointer-events-auto");
        addMembersPopUp.classList.add("pointer-events-none");
    }

    if(!toolTip.classList.contains("hidden")) {
        toolTip.classList.add("hidden");
    }
})

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";

}

//ADD MEMBER BUTTON
addMemButton.addEventListener("click", async function(event) {
    event.stopPropagation();
    const username = memberUsername.value;
    const response = await addMemberToProject(activeProjectId, username);
    memberPopUpText.classList.remove("opacity-0");
    if(response.status != 201) {
        memberPopUpText.classList.remove("text-green-600");
        memberPopUpText.classList.add("text-red-600");
    } else {
        memberPopUpText.classList.remove("text-red-600");
        memberPopUpText.classList.add("text-green-600");
    }
    if(response.status == 404) {
        memberPopUpText.textContent = "User not found";
    } else if (response.status == 409) {
        memberPopUpText.textContent = "User already part of this project!"
    } else if (response.status == 401) {
        memberPopUpText.textContent = "Unauthorized directory";
    } else if(response.status == 201) {
        memberPopUpText.textContent = "The member have been sucessfully added";
    } else {
        memberPopUpText.textContent = "There was a error adding your member";
    }
    memberUsername.value = "";
})

closeViewMemPopUp.addEventListener("click", function() {
    if(viewMembersPopUp.classList.contains("opacity-100")) {
        viewMembersPopUp.classList.remove("opacity-100");
        viewMembersPopUp.classList.add("opacity-0");

        viewMembersPopUp.classList.remove("pointer-events-auto");
        viewMembersPopUp.classList.add("pointer-events-none");
    }
})

function getCurrentUser() {
    let username = getOwner();
    toolTip.textContent = "Username: " + username;
    if(username.length > 12) {
        username = username.slice(0,9) + "...";
    }
    console.log(username);
    displayUsername.textContent = username;
}

usernamePill.addEventListener("click", function(event) {
    event.stopPropagation();
    toolTip.classList.toggle("hidden");
    usernamePill.classList.toggle("ring-4");
    usernamePill.classList.toggle("ring-blue-800");
})

toolTip.addEventListener("click", function(event) {
    event.stopPropagation();
})

function getOwner() {
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    const username = payload.sub;
    return username;
}

//FETCH ALL TASKS NOW REMEMBERS WHERE YOU LEFT OFF
getCurrentUser();
if(previousProject) fetchAllTasks(previousProject);
fetchAllProjects();