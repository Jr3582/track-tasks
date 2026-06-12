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