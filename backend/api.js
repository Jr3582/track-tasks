async function fetchAllTasks(projId) {
    let task;
    const tasks = await fetch(`http://localhost:5056/Tasks/project/${projId}`);
    for(task of await tasks.json()){
        createTaskCard(task);
    }
}

async function fetchAllProjects() {
    const projs = await fetch(`http://localhost:5056/Projects`);
    for(let proj of await projs.json()) {
        const projNameSpan = document.createElement("span");
        projNameSpan.className = "font-playfair text-xl cursor-pointer";
        projNameSpan.textContent = proj.title;
        projNameSpan.addEventListener("click", () => switchProj(proj.id));
        listOfCurProjects.appendChild(projNameSpan);
    }
}

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