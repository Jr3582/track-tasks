const createTaskform = document.getElementById("createTask");
const updateTaskform = document.getElementById("updateTask");
const statusDropDown = document.getElementById("statusDropDownOptions");
const urgencyDropDown = document.getElementById("urgencyDropDownOptions");

const popUp = document.getElementById("popUp");
const updatePopUp = document.getElementById("updatePopUp");

//FORM INPUTS
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

//SORTABLE
const todo_col = document.getElementById("todo_col");
const inprog_col = document.getElementById("inprog_col");
const inrew_col = document.getElementById("inrew_col");
const done_col = document.getElementById("done_col");

let st = "TO DO";
let urg = "LOW";

// VVV THIS IS FOR MOVING TASK AROUND TO EACH COL VVV
new Sortable(todo_col, {
    group: "tasks",
    draggable: ".task-card",
    filter: ".no-drag",
    onAdd: function(event) {
        removeBg(event.item);
        addBg(event.item, "bg-blue-600");
    },
});

new Sortable(inprog_col, {
    group: "tasks",
    draggable: ".task-card",
    filter: ".no-drag",
    onAdd: function(event) {
        removeBg(event.item);
        addBg(event.item, "bg-green-600");
    },
});

new Sortable(inrew_col, {
    group: "tasks",
    draggable: ".task-card",
    filter: ".no-drag",
    onAdd: function(event) {
        removeBg(event.item);
        addBg(event.item, "bg-yellow-600");
    },
});
new Sortable(done_col, {
    group: "tasks",
    draggable: ".task-card",
    filter: ".no-drag",
    onAdd: function(event) {
        removeBg(event.item);
        addBg(event.item, "bg-red-600");
    },
});

//FETCHING ALL TASKS WHEN SITE IS LOADED
async function fetchAllTasks() {
    let task;
    const tasks = await fetch("http://localhost:5056/Tasks");
    for(task of await tasks.json()) {
        const newTask = document.createElement("div");
        const title = document.createElement("span");
        const urgency = document.createElement("span");
        newTask.setAttribute("onclick", `showUpdateTask(${task.id.toString()}, event)`);
        newTask.setAttribute("id", task.id.toString());
        
        switch (task.status) {
            case "TO DO":
                newTask.className = "relative bg-blue-600 rounded-md p-2 font-playfair text-2xl text-bold task-card cursor-pointer button-anim mb-2";
                urgency.className = "absolute right-2 bottom-1 text-2xl text-red-800";
                title.className = "flex w-1/2";

                title.textContent = task.title;
                urgency.textContent = fetchUrgency(task.urgency);

                newTask.appendChild(title);
                newTask.appendChild(urgency);
                todo_col.appendChild(newTask);
                break;
            case "IN PROGRESS":
                newTask.className = "relative bg-green-600 rounded-md p-2 font-playfair text-2xl text-bold task-card cursor-pointer button-anim mb-2";
                urgency.className = "absolute right-2 bottom-1 text-2xl text-red-800";
                title.className = "flex w-1/2";

                title.textContent = task.title;
                urgency.textContent = fetchUrgency(task.urgency);

                newTask.appendChild(title);
                newTask.appendChild(urgency);
                inprog_col.appendChild(newTask);
                break;
            case "REVIEWING":
                newTask.className = "relative bg-yellow-600 rounded-md p-2 font-playfair text-2xl text-bold task-card cursor-pointer button-anim mb-2";
                urgency.className = "absolute right-2 bottom-1 text-2xl text-red-800";
                title.className = "flex w-1/2";

                title.textContent = task.title;
                urgency.textContent = fetchUrgency(task.urgency);

                newTask.appendChild(title);
                newTask.appendChild(urgency);
                inrew_col.appendChild(newTask);
                break;
            case "DONE":
                newTask.className = "relative bg-red-600 rounded-md p-2 font-playfair text-2xl text-bold task-card cursor-pointer button-anim mb-2";
                urgency.className = "absolute right-2 bottom-1 text-2xl text-red-800";
                title.className = "flex w-1/2";

                title.textContent = task.title;
                urgency.textContent = fetchUrgency(task.urgency);

                newTask.appendChild(title);
                newTask.appendChild(urgency);
                done_col.appendChild(newTask);
                break;
        }
    }
}

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

fetchAllTasks();

//EVENT LISTENER FOR FORM
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
        curStatus: st,
        curUrgency: urg
    }
    const response = await fetch("http://localhost:5056/Tasks", {
        method: "Post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    console.log(await response.json());
})

//STOPS THE FORM FROM DISAPPEARING IF CLICKED INSIDE
createTaskform.addEventListener("click", function(event) {
    event.stopPropagation();
})

document.addEventListener("click", function(e) {
    if(statusDropDown.classList.contains("opacity-100")) {
        statusDropDown.classList.remove("opacity-100");
        statusDropDown.classList.add("opacity-0");

        statusDropDown.classList.remove("pointer-events-auto");
        statusDropDown.classList.add("pointer-events-none");

        //DEBUGGING MESSAGE
        console.log("hiding statusDropDown");
    }
    console.log(urgencyDropDown);
    if(urgencyDropDown.classList.contains("opacity-100")) {
        urgencyDropDown.classList.remove("opacity-100");
        urgencyDropDown.classList.add("opacity-0");

        urgencyDropDown.classList.remove("pointer-events-auto");
        urgencyDropDown.classList.add("pointer-events-none");

        //DEBUGGING MESSAGE
        console.log("hiding urgencyDropDown");
    }
    if(popUp.classList.contains("opacity-100")) {
        popUp.classList.remove("opacity-100");
        popUp.classList.add("opacity-0");

        popUp.classList.remove("pointer-events-auto");
        popUp.classList.add("pointer-events-none");

        createTaskform.reset();

        //DEBUGGING MESSAGE
        console.log("hiding create task pop up");
    }

    if(updatePopUp.classList.contains("opacity-100")) {
        updatePopUp.classList.remove("opacity-100");
        updatePopUp.classList.add("opacity-0");

        updatePopUp.classList.remove("pointer-events-auto");
        updatePopUp.classList.add("pointer-events-none");

        updateTaskform.reset();

        //DEBUGGING MESSAGE
        console.log("hiding update task pop up");
    }
})

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
function changeStatus(status) {
    st = status;
    switchOption(status, "TO DO", "IN PROGRESS", "REVIEWING", "DONE", "bg-blue-800", "bg-green-800", "bg-yellow-800", "bg-red-800", "text-blue-500", "text-green-500", "text-yellow-500", "text-red-500", curStatus);
    
    //REMOVING THE DROPDOWN AFTER MAKING A CHOICE
    statusDropDown.classList.remove("opacity-100");
    statusDropDown.classList.remove("pointer-events-auto");

    statusDropDown.classList.add("opacity-0");
    statusDropDown.classList.add("pointer-events-none");
    
    //DEBUGGING MESSAGE
    console.log(st);
}

//CHANGE URGENCY FOR DROPDOWN
function changeUrgency(urgency) {
    urg = urgency;
    switchOption(urgency, "LOW", "URGENT", "CRITICAL", "PRIORITY", "bg-green-800", "bg-yellow-800", "bg-orange-800", "bg-red-800", "text-green-500", "text-yellow-500", "text-orange-500", "text-red-500", curUrgency);
    
    urgencyDropDown.classList.remove("opacity-100");
    urgencyDropDown.classList.remove("pointer-events-auto");

    urgencyDropDown.classList.add("opacity-0");
    urgencyDropDown.classList.add("pointer-events-none");

    //DEBUGGING MESSAGE
    console.log(urg);
}

//FUNCTION TO SHOW CREATE TASK POP UP
function showCreateTask(status, event){
    event.stopPropagation();
    switchOption(status, "TO DO", "IN PROGRESS", "REVIEWING", "DONE", "bg-blue-800", "bg-green-800", "bg-yellow-800", "bg-red-800", "text-blue-500", "text-green-500", "text-yellow-500", "text-red-500", curStatus);

    if(popUp.classList.contains("opacity-0")) {
        popUp.classList.remove("opacity-0");
        popUp.classList.remove("pointer-events-none");

        popUp.classList.add("opacity-100");
        popUp.classList.add("pointer-events-auto");

    }
}

//FUNCTION TO SHOW UPDATE TASK POP UP
async function showUpdateTask(id, event) {
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

    const response = await fetch(`http://localhost:5056/Tasks/${id}`, {
        method: "Put",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });
    event.stopPropagation();
    if(updatePopUp.classList.contains("opacity-0")) {
        updatePopUp.classList.remove("opacity-0");
        updatePopUp.classList.remove("pointer-events-none");

        updatePopUp.classList.add("opacity-100");
        updatePopUp.classList.add("pointer-events-auto");
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