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

function openAddMembersPopUp(event) {
    event.stopPropagation();
    if(addMembersPopUp.classList.contains("opacity-0")) {
        addMembersPopUp.classList.remove("opacity-0")
        addMembersPopUp.classList.add("opacity-100");

        addMembersPopUp.classList.remove("pointer-events-none");
        addMembersPopUp.classList.add("pointer-events-auto");
    }
}

function closeAddMemPopUp() {
    if(addMembersPopUp.classList.contains("opacity-100")) {
        addMembersPopUp.classList.remove("opacity-100")
        addMembersPopUp.classList.add("opacity-0");

        addMembersPopUp.classList.add("pointer-events-none");
        addMembersPopUp.classList.remove("pointer-events-auto");
    }
}