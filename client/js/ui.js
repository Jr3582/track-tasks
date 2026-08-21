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

//TAILWIND'S DEFAULT SHADE SCALE, USED TO COMPUTE "ONE SHADE DARKER" FOR dark: VARIANTS
const TAILWIND_SHADE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

//GIVEN "bg-blue-600" RETURNS "dark:bg-blue-700" (ONE STEP DARKER), OR null IF NOT A SHADED COLOR CLASS
function darkerShadeClass(colorClass) {
    const match = colorClass.match(/^(bg|text|border)-([a-z]+)-(\d+)$/);
    if(!match) return null;
    const [, prefix, color, shade] = match;
    const idx = TAILWIND_SHADE_STEPS.indexOf(Number(shade));
    if(idx === -1 || idx >= TAILWIND_SHADE_STEPS.length) return null;
    return `dark:${prefix}-${color}-${TAILWIND_SHADE_STEPS[idx + 1]}`;
}

//HELPER FUNCTIONS FOR REMOVING BACKGROUND COLOR
function removeBg(item) {
    const bgClass = [...item.classList].find(cls => cls.startsWith("bg-"));
    if(bgClass) item.classList.remove(bgClass);
    const darkBgClass = [...item.classList].find(cls => cls.startsWith("dark:bg-"));
    if(darkBgClass) item.classList.remove(darkBgClass);
}

function addBg(item, bgColor) {
    item.classList.add(bgColor);
    const darkVariant = darkerShadeClass(bgColor);
    if(darkVariant) item.classList.add(darkVariant);
}


//HELPER FUNCTION FOR REMOVING TEXT COLOR
function removeTextColor(child1, child2) {
    const textClass = [...child1.classList].find(cls => cls.startsWith("text-"));
    const textClass2 = [...child2.classList].find(cls => cls.startsWith("text-"));
    const darkTextClass = [...child1.classList].find(cls => cls.startsWith("dark:text-"));
    const darkTextClass2 = [...child2.classList].find(cls => cls.startsWith("dark:text-"));

    if(textClass) child1.classList.remove(textClass);
    if(textClass2) child2.classList.remove(textClass2);
    if(darkTextClass) child1.classList.remove(darkTextClass);
    if(darkTextClass2) child2.classList.remove(darkTextClass2);
}

function addTextColor(child1, color1, child2, color2) {
    child1.classList.add(color1);
    child2.classList.add(color2);
    const darkVariant1 = darkerShadeClass(color1);
    const darkVariant2 = darkerShadeClass(color2);
    if(darkVariant1) child1.classList.add(darkVariant1);
    if(darkVariant2) child2.classList.add(darkVariant2);
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

function changeOwner(name, ownerDOM, hiddenInput, dropdownDOM) {
    hiddenInput.value = name;
    ownerDOM.children[0].textContent = name;
    dropdownDOM.classList.remove("opacity-100");
    dropdownDOM.classList.remove("pointer-events-auto");
    dropdownDOM.classList.add("opacity-0");
    dropdownDOM.classList.add("pointer-events-none");
}

function activateOwnerDropBox(event, ownerDropDown, statDropDown, urgentDropDown) {
    event.stopPropagation();

    if(ownerDropDown.classList.contains("opacity-100")) {
        ownerDropDown.classList.remove("opacity-100");
        ownerDropDown.classList.remove("pointer-events-auto");
        ownerDropDown.classList.add("opacity-0");
        ownerDropDown.classList.add("pointer-events-none");
    } else {
        if(statDropDown.classList.contains("opacity-100")) statDropDown.classList.remove("opacity-100"); statDropDown.classList.add("opacity-0")
        if(statDropDown.classList.contains("pointer-events-auto")) statDropDown.classList.remove("pointer-events-auto"); statDropDown.classList.add("pointer-events-none")
        if(urgentDropDown.classList.contains("opacity-100")) urgentDropDown.classList.remove("opacity-100"); urgentDropDown.classList.add("opacity-0")
        if(urgentDropDown.classList.contains("pointer-events-auto")) urgentDropDown.classList.remove("pointer-events-auto"); urgentDropDown.classList.add("pointer-events-none")

        ownerDropDown.classList.remove("opacity-0");
        ownerDropDown.classList.remove("pointer-events-none");
        ownerDropDown.classList.add("opacity-100");
        ownerDropDown.classList.add("pointer-events-auto");
    }
}

function buildAndPlaceTaskCard(task, titleDiv, taskTitle, deleteButton, projName, urgency, newTask, taskSubInfoDiv, ownerSpan, projectNameAndUrgencyDiv, dueDateSpan) {
    let bgColor;
    let column;
    //APPENDING EVERYTHING TOGETHER
    titleDiv.appendChild(taskTitle);
    titleDiv.appendChild(deleteButton);

    projectNameAndUrgencyDiv.appendChild(projName);
    projectNameAndUrgencyDiv.appendChild(urgency);

    taskSubInfoDiv.appendChild(ownerSpan);
    taskSubInfoDiv.appendChild(dueDateSpan);
    taskSubInfoDiv.appendChild(projectNameAndUrgencyDiv);

    newTask.appendChild(titleDiv);
    newTask.appendChild(taskSubInfoDiv);
    switch(task.status) {
        case "TO DO":
            bgColor = "bg-blue-600";
            column = todo_col;
            break;
        case "IN PROGRESS":
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
    addBg(newTask, bgColor);
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

//HELPER FUNCTION TO FORMAT A DUE DATE INTO DISPLAY TEXT + STYLING
function getDueDateDisplay(dueDate) {
    const date = new Date(dueDate);
    const curDate = new Date();
    //MILLISEC (1000) * SEC (60) * MIN (60) * DAY (24)
    const diffDays = (date - curDate) / (1000 * 60 * 60 * 24);
    const formatted = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
    });
    let className = null;
    if(diffDays < 0) {
        className = "text-sm font-playfair italic font-black bg-gray-400 dark:bg-gray-600 text-gray-700 dark:text-gray-900 underline rounded-md pl-1 pr-1";
    } else if(diffDays <= 3 && diffDays >= 0) {
        className = "text-sm font-playfair italic font-black bg-red-400 dark:bg-red-600 text-red-700 dark:text-red-900 underline rounded-md pl-1 pr-1";
    } else if(diffDays <= 6 && diffDays > 3) {
        className = "text-sm font-playfair italic font-black bg-orange-400 dark:bg-orange-600 text-orange-700 dark:text-orange-900 underline rounded-md pl-1 pr-1"
    } else if(diffDays > 6) {
        className = "text-sm font-playfair italic font-black bg-green-400 dark:bg-green-600 text-green-700 dark:text-green-900 underline rounded-md pl-1 pr-1";
    }
    return { formatted, className };
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
    const taskSubInfoDiv = document.createElement("div");
    const ownerSpan = document.createElement("span");
    const dueDateSpan = document.createElement("span");
    const dueDateText = document.createElement("span");
    const projectNameAndUrgencyDiv = document.createElement("div");
    newTask.setAttribute("onclick", `showUpdateTask(${task.id.toString()}, event)`);
    newTask.setAttribute("id", task.id.toString());
    let projectName;


    //ADDING ATTRIBUTES TO THE DELETE BUTTON
    deleteButton.setAttribute("id", "deleteBtn");
    deleteButton.setAttribute("name", `PROJ_${task.id.toString()}`);
    deleteButton.addEventListener("click", function(event) {
        showTaskDeletePopUp(task, taskId);
        event.stopPropagation();
    })

    //CHANGING THE DATE FORMAT
    const { formatted: formattedDueDate, className: dueDateTextClassName } = getDueDateDisplay(task.dueDate);

    //ADDING CLASS STYLING
    newTask.className = "relative rounded-md p-2 font-playfair text-2xl text-bold task-card cursor-pointer button-anim mb-2 group";

    titleDiv.className = "flex h-fit";
    projNameDiv.className = "flex";

    deleteButton.className = "flex leading-none text-2xl ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-700 font-sans";

    urgency.className = "text-2xl text-red-800 dark:text-red-900 ml-auto pr-1";
    title.className = "flex w-1/2";
    projName.className = "text-lg";

    taskSubInfoDiv.className = "flex flex-col mt-4";
    ownerSpan.className = "text-sm font-playfair italic";
    //CHANGE TEXT COLOR TO RED IF THE DUE DATE IS APPROACHING
    dueDateText.className = dueDateTextClassName;
    dueDateSpan.className = "text-sm font-playfair italic";
    projectNameAndUrgencyDiv.className = "flex";

    //CHANGING TEXT
    title.textContent = task.title.length > 30 ? task.title.slice(0, 30) + "..." : task.title;
    deleteButton.textContent = "X";
    urgency.textContent = fetchUrgency(task.urgency);
    ownerSpan.textContent = "Owner: " + task.owner;
    dueDateText.textContent = formattedDueDate;
    dueDateSpan.textContent = "Due: "
    dueDateSpan.appendChild(dueDateText);
    //~~~ PROJ_ IS JUST FILLER FOR NOW, I'LL CHANGE LATER TO REFLECT ACTUAL PROJECTS ~~~
    if(task.projectName.length >= 4) {
        projectName = task.projectName.slice(0,4).toUpperCase();
    } else {
        projectName = task.projectName.slice(0, task.projName.length).toUpperCase();
    }
    projName.textContent = `${projectName.replace(/\s/g, "")}-${task.taskNumber}`;

    buildAndPlaceTaskCard(task, titleDiv, title, deleteButton, projName, urgency, newTask, taskSubInfoDiv, ownerSpan, projectNameAndUrgencyDiv, dueDateSpan);
}

function toggleKebabMenu(event) {
    event.stopPropagation()
    const rect = event.currentTarget.getBoundingClientRect();
    kebabMenu.style.top = rect.bottom + "px";
    kebabMenu.style.left = rect.left + "px";
    const parentDiv = event.target.closest(".group");
    const currentButton = event.currentTarget;
    const buttonParent = event.target.closest(".absolute");
    activeProjDiv = parentDiv;
    activeButton = currentButton;
    //GET THE ID OF THE PROJECT DIV
    const projectId = parseInt(parentDiv.id.replace("projDivId_", ""));
    activeProjectId = projectId;
    activeProjectName = parentDiv.children[0].textContent;
    if(kebabMenu.classList.contains("hidden")) {
        kebabMenu.classList.remove("hidden");

        parentDiv.classList.remove("hover:scale-105");
        parentDiv.classList.remove("hover:bg-gray-500");

        parentDiv.classList.add("scale-105");
        parentDiv.classList.add("bg-gray-500");

        currentButton.classList.remove("hidden");
        buttonParent.classList.remove("hover:bg-gray-400");

        buttonParent.classList.add("bg-gray-400");

        const deleteProjectRow = document.getElementById("deleteProjectRow");
        if(listOfCurProjects.children.length <= 1) {
            deleteProjectRow.classList.add("opacity-50", "pointer-events-none", "cursor-not-allowed");
            deleteProjectRow.classList.remove("cursor-pointer", "hover:scale-105");
        } else {
            deleteProjectRow.classList.remove("opacity-50", "pointer-events-none", "cursor-not-allowed");
            deleteProjectRow.classList.add("cursor-pointer", "hover:scale-105");
        }
    } else if (!kebabMenu.classList.contains("hidden")) {
        kebabMenu.classList.add("hidden");

        parentDiv.classList.remove("scale-105");
        parentDiv.classList.remove("bg-gray-500");

        parentDiv.classList.add("hover:scale-105");
        parentDiv.classList.add("hover:bg-gray-500");

        currentButton.classList.add("hidden");
        buttonParent.classList.remove("bg-gray-400");

        buttonParent.classList.add("hover:bg-gray-400");
    }
}

function renameProject() {
    const nameSpan = activeProjDiv.querySelector("span");
    const curNameText = nameSpan.textContent;
    const nameWrapper = activeProjDiv.querySelector(".nameWrapper");
    nameWrapper.innerHTML = `<input type="text" value="${curNameText}" class="font-playfair text-xl w-full bg-white rounded-md outline-none px-1">`;

    activeProjDiv.classList.remove("hover:bg-gray-500", "hover:scale-105", "scale-105", "bg-gray-500", "hover:z-20", "cursor-pointer", "bg-gray-300");

    const nameInput = nameWrapper.querySelector("input");

    //STOPS THE INPUT FROM CHANGING IF CLICKED ON
    nameInput.addEventListener("click", function(event) {
        event.stopPropagation();
    });

    //WHEN PRESS ENTER BUTTON MAKE THE NAME CHANGES
    nameInput.addEventListener("keydown", function(event) {
        if(event.key == "Enter") {
            changeName(nameInput.value, activeProjectId);
            nameWrapper.innerHTML = `<span class="font-playfair text-xl">${nameInput.value}</span>`;
        }
    });

    //WHEN CLICKING OUT OF THE INPUT, RETURN TO A SPAN
    nameInput.addEventListener("blur", function() {
        nameWrapper.innerHTML = `<span class="font-playfair text-xl">${nameInput.value}</span>`;
    });
}

memberUsername.addEventListener("input", async function() {
    //CLEAR INNER HTML SO SUGGESTIONS DON'T STACK
    usernameSuggestions.innerHTML = "";

    //AUTOMATICALLY RETURN IF USERNAME IS NULL (NO ERRORS THIS WAY)
    if(memberUsername.value === "") return;

    //CLEAR TIMEOUT
    clearTimeout(timerId);

    timerId = setTimeout(async function() {
        const searchUsers = await authFetch(`/Users/searchUsername?username=${memberUsername.value}`);
        for(let users of await searchUsers.json()) {
            if(getOwner() === users.username) continue;
            
            const searchedUserDiv = document.createElement("div");
            searchedUserDiv.className = "p-1 font-playfair cursor-pointer border-black border-b-2";
            searchedUserDiv.textContent = users.username;

            searchedUserDiv.onclick = function() {
                autoFillUsername(users.username);
            }

            usernameSuggestions.appendChild(searchedUserDiv);
        }
    }, 1000);
})

function autoFillUsername(username){
    //GET RID OF DROPDOWN LIST AFTER NAME IS CLICKED
    usernameSuggestions.innerHTML = "";

    memberUsername.textContent = username;
    memberUsername.value = username;
}