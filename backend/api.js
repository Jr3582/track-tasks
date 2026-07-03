async function fetchAllTasks(projId) {
    let task;
    const tasks = await authFetch(`http://localhost:5056/Tasks/project/${projId}`);
    for(task of await tasks.json()){
        createTaskCard(task);
    }
}

async function fetchAllProjects() {
    const projs = await authFetch(`http://localhost:5056/Projects`);
    for(let proj of await projs.json()) {
        const moreOptionsBtn = document.createElement("button");
        moreOptionsBtn.className = "hidden group-hover:flex rounded-md pl-1 pr-1 h-full w-full items-center";
        const i = document.createElement("i");
        i.className = "fa-solid fa-ellipsis";
        const buttonDiv = document.createElement("div");
        buttonDiv.className = "absolute right-0 rounded-m hover:bg-gray-400 w-fit h-full rounded-md";
        const projDiv = document.createElement("div");
        projDiv.className = "group relative flex items-center justify-between bg-gray-300 w-full rounded-md hover:bg-gray-500 hover:scale-105 hover:z-20 cursor-pointer transition ease-in-out duration-300 px-1";
        const projNameSpan = document.createElement("span");
        projNameSpan.className = "font-playfair text-xl";
        projNameSpan.textContent = proj.title;
        projDiv.id = "projDivId_" + proj.id;
        const projNameWrapper = document.createElement("div");
        projNameWrapper.className = "nameWrapper";

        moreOptionsBtn.onclick = function(event) {
            toggleKebabMenu(event);
        }

        moreOptionsBtn.appendChild(i);
        buttonDiv.appendChild(moreOptionsBtn);
        projNameWrapper.appendChild(projNameSpan);
        projDiv.appendChild(projNameWrapper);
        projDiv.appendChild(buttonDiv);
        projDiv.addEventListener("click", () => switchProj(proj.id));
        listOfCurProjects.appendChild(projDiv);

        //REMEMBERS THE CURRENT DIRECTORY NAME
        const previousProjectTitle = localStorage.getItem("previousDirectoryTitle");
        curProjectName.textContent = previousProjectTitle;
    }
}

async function updateStatusOnColSwitch(taskId, newStatus) {
    const taskToUpdate = await authFetch(`http://localhost:5056/Tasks/${taskId}`);
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
    const response = await authFetch(`http://localhost:5056/Tasks/${taskId}`, {
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
    const response = await authFetch(`http://localhost:5056/Projects/${curProjId}`);
    const project = await response.json();
    curProjectName.textContent = project.title;
    curProjectDirectory = project.title;
    localStorage.setItem("previousDirectory", curProjId);
    localStorage.setItem("previousDirectoryTitle", project.title);

    fetchAllTasks(newProjId); 
}

async function addMemberToProject(projectId, username) {
    const response = await authFetch(`http://localhost:5056/Projects/${projectId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ username: username })

    });
    return response;

}

async function deleteProject(projectId) {
    const response = await authFetch(`http://localhost:5056/Projects/${projectId}`, {
        method: "DELETE",
    })
    return response;
}

async function deleteTask(taskId){
    const response = await authFetch(`http://localhost:5056/Tasks/${taskId}`, {
        method: "DELETE"
    })
    return response
}

async function changeName(newName, projectId) {
    const projectToUpdate = await authFetch(`http://localhost:5056/Projects/${projectId}`)
    const projectJSON = await projectToUpdate.json();

    const project = {
        title: newName,
        description: projectJSON.description,
        owner: projectJSON.owner
    }
    const response = await authFetch(`http://localhost:5056/Projects/${projectId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(project)
    })
    return response;
}

async function getListOfMembers(projectId) {
    const response = await authFetch(`http://localhost:5056/Projects/${projectId}/members`);
    const members = await response.json();
    for(let member of members) {
        const memberLi = document.createElement("li");
        const memberName = document.createElement("span");
        const deleteMemberButton = document.createElement("button");

        memberName.textContent = member;
        deleteMemberButton.textContent = "x";

        memberLi.className = "before:content-['•'] before:mr-2 before:text-4xl flex items-center";
        memberName.className = "bg-gray-300 rounded-md px-3";
        deleteMemberButton.className = "ml-2 text-red-600 text-2xl font-sans cursor-pointer hover:scale-110 transition ease-in-out duration-300";
        memberLi.appendChild(memberName);
        memberLi.appendChild(deleteMemberButton);
        listOfMembers.appendChild(memberLi);
    }

    return response;
}