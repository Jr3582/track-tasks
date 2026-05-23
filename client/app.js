const createTaskform = document.getElementById("createTask");
const statusDropDown = document.getElementById("statusDropDownOptions");
const urgencyDropDown = document.getElementById("urgencyDropDownOptions");

const popUp = document.getElementById("popUp");

//FORM INPUTS
const title = document.getElementById("title");
const summary = document.getElementById("summary");
const description = document.getElementById("description");
const assignee = document.getElementById("assignee");
const parentTask = document.getElementById("parent");
const startDate = document.getElementById("start_date");
const dueDate = document.getElementById("due_date");
const owner = document.getElementById("owner");
const curStatus = document.getElementById("currentStatus");
const curUrgency = document.getElementById("curUrgency");

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
        console.log("hiding urgencyDropDown");
    }
})

function activateStatusDropBox(event) {
    if(statusDropDown.classList.contains("opacity-0")) {
        event.stopPropagation();
        
        statusDropDown.classList.remove("opacity-0");
        statusDropDown.classList.remove("pointer-events-none");

        if(urgencyDropDown.classList.contains("opacity-100")) urgencyDropDown.classList.remove("opacity-100"); urgencyDropDown.classList.add("opacity-0")
        if(urgencyDropDown.classList.contains("pointer-events-auto")) urgencyDropDown.classList.remove("pointer-events-auto"); urgencyDropDown.classList.add("pointer-events-none")

        statusDropDown.classList.add("opacity-100");
        statusDropDown.classList.add("pointer-events-auto");

        //DEBUGGING MESSAGE
        console.log("openning statusDropDown");

        //NOTES:
        //pointer-events-none: Makes it so that you can click through without activating
    }
}

function activateUrgencyDropBox(event) {
    if(urgencyDropDown.classList.contains("opacity-0")) {
        event.stopPropagation();
        
        urgencyDropDown.classList.remove("opacity-0");
        urgencyDropDown.classList.remove("pointer-events-none");

        if(statusDropDown.classList.contains("opacity-100")) statusDropDown.classList.remove("opacity-100"); statusDropDown.classList.add("opacity-0")
        if(statusDropDown.classList.contains("pointer-events-auto")) statusDropDown.classList.remove('pointer-events-auto'); statusDropDown.classList.add("pointer-events-none")

        urgencyDropDown.classList.add("opacity-100");
        urgencyDropDown.classList.add("pointer-events-auto");

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