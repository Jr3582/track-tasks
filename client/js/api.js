async function fetchAllTasks(projId) {
    let task;
    const tasks = await authFetch(`/Tasks/project/${projId}`);
    for (task of await tasks.json()) {
        createTaskCard(task);
    }
}

async function fetchAllProjects() {
    const projs = await authFetch(`/Projects`);
    const projList = await projs.json();
    let firstProjId = null;
    for (let proj of projList) {
        if (firstProjId === null) firstProjId = proj.id;
        const moreOptionsBtn = document.createElement("button");
        moreOptionsBtn.className = "hidden group-hover:flex rounded-md pl-1 pr-1 h-full w-full items-center";
        const i = document.createElement("i");
        i.className = "fa-solid fa-ellipsis";
        const buttonDiv = document.createElement("div");
        buttonDiv.className = "absolute right-0 rounded-m hover:bg-gray-400 w-fit h-full rounded-md";
        const projDiv = document.createElement("div");
        projDiv.className = "group relative flex items-center justify-between bg-gray-300 dark:bg-gray-600 w-full rounded-md hover:bg-gray-500 hover:scale-105 hover:z-20 cursor-pointer transition ease-in-out duration-300 px-1";
        const projNameSpan = document.createElement("span");
        projNameSpan.className = "font-playfair text-xl";
        projNameSpan.textContent = proj.title;
        projDiv.id = "projDivId_" + proj.id;
        const projNameWrapper = document.createElement("div");
        projNameWrapper.className = "nameWrapper";

        moreOptionsBtn.onclick = function (event) {
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
        curProjectName.className = "dark:bg-gray-600 font-playfair text-xl p-1 rounded-md"
        curProjectName.textContent = previousProjectTitle;
    }

    return firstProjId;
}

async function updateStatusOnColSwitch(taskId, newStatus) {
    const taskToUpdate = await authFetch(`/Tasks/${taskId}`);
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
    const response = await authFetch(`/Tasks/${taskId}`, {
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
    const response = await authFetch(`/Projects/${curProjId}`);
    const project = await response.json();
    curProjectName.textContent = project.title;
    curProjectDirectory = project.title;
    localStorage.setItem("previousDirectory", curProjId);
    localStorage.setItem("previousDirectoryTitle", project.title);

    fetchAllTasks(newProjId);
}

async function addMemberToProject(projectId, username) {
    const response = await authFetch(`/Projects/${projectId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username })

    });
    return response;

}

async function deleteProject(projectId) {
    const response = await authFetch(`/Projects/${projectId}`, {
        method: "DELETE",
    })
    return response;
}

async function deleteTask(taskId) {
    const response = await authFetch(`/Tasks/${taskId}`, {
        method: "DELETE"
    })
    return response
}

async function changeName(newName, projectId) {
    const projectToUpdate = await authFetch(`/Projects/${projectId}`)
    const projectJSON = await projectToUpdate.json();

    const project = {
        title: newName,
        description: projectJSON.description,
        owner: projectJSON.owner
    }
    const response = await authFetch(`/Projects/${projectId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(project)
    })
    return response;
}

async function deleteMember(projectId, userId) {
    const response = await authFetch(`/Projects/${projectId}/members/${userId}`, {
        method: "DELETE",
    })
    const member = document.getElementById("member_" + userId);
    member.remove();
    return response;
}

async function getListOfMembers(projectId) {
    const response = await authFetch(`/Projects/${projectId}/members`);
    const pResponse = await authFetch(`/Projects/${projectId}`);
    const project = await pResponse.json();
    const members = await response.json();
    const username = getOwner();

    //ADDING THE OWNER FIRST
    const ownerLi = document.createElement("li");
    const ownerName = document.createElement("span");
    const ownerBadge = document.createElement("span");
    ownerLi.className = "before:content-['•'] before:mr-2 before:text-4xl flex items-center";
    ownerName.className = "bg-gray-300 rounded-md px-3";
    ownerName.textContent = project.owner;
    ownerBadge.className = "ml-2 text-sm bg-yellow-400 text-black rounded-md px-1 font-sans";
    ownerBadge.textContent = "Owner";
    ownerLi.appendChild(ownerName);
    ownerLi.appendChild(ownerBadge);
    listOfMembers.appendChild(ownerLi);

    //ADDING REST OF MEMBERS
    for (let member of members) {
        if (member.username === project.owner) continue;
        const memberLi = document.createElement("li");
        const memberName = document.createElement("span");

        memberName.textContent = member.username;

        memberLi.className = "before:content-['•'] before:mr-2 before:text-4xl flex items-center";
        memberName.className = "bg-gray-300 rounded-md px-3";
        memberLi.id = "member_" + member.userId;


        memberLi.appendChild(memberName);
        listOfMembers.appendChild(memberLi);

        //ONLY THE OWNER CAN SEE AND DELETE USERS
        if (project.owner == username) {
            const deleteMemberButton = document.createElement("button");
            deleteMemberButton.className = "ml-2 text-red-600 text-2xl font-sans cursor-pointer hover:scale-110 transition ease-in-out duration-300";
            deleteMemberButton.textContent = "x";
            deleteMemberButton.addEventListener("click", function () {
                deleteMember(projectId, member.userId);
            })
            memberLi.appendChild(deleteMemberButton);
        }
    }
    return response;
}

async function getListOfMembersForDropDown(projectId, dropdownEl, curOwnerEl, ownerInputEl) {
    dropdownEl.innerHTML = "";

    const response = await authFetch(`/Projects/${projectId}/members`);
    const pResponse = await authFetch(`/Projects/${projectId}`);
    const project = await pResponse.json();
    const members = await response.json();
    const projectOwner = project.owner;

    const ownerDiv = document.createElement("div");
    const ownerName = document.createElement("span");
    ownerDiv.className = "bg-purple-800 button-anim cursor-pointer";
    ownerName.className = "font-playfair text-purple-300 p-1";
    ownerName.textContent = projectOwner;
    ownerDiv.appendChild(ownerName);
    ownerDiv.addEventListener("click", function () {
        changeOwner(projectOwner, curOwnerEl, ownerInputEl, dropdownEl);
    });
    dropdownEl.appendChild(ownerDiv);

    for (let member of members) {
        const memberDiv = document.createElement("div");
        const memberName = document.createElement("span");

        memberDiv.className = "bg-purple-800 button-anim cursor-pointer";
        memberName.className = "font-playfair text-purple-300 p-1";
        memberName.textContent = member.username;
        memberDiv.appendChild(memberName);

        memberDiv.addEventListener("click", function () {
            changeOwner(member.username, curOwnerEl, ownerInputEl, dropdownEl);
        });

        dropdownEl.appendChild(memberDiv);
    }
    return response;
}

async function generateDescription(titleEl, descriptionEl, buttonEl) {
    if (titleEl.value === "") return;
    const original = buttonEl.innerHTML;
    buttonEl.disabled = true;
    buttonEl.innerHTML = `
        <span class="flex items-center justify-center">
            <svg class="mr-3 size-5 animate-spin" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"
                    stroke="currentColor"
                    stroke-width="4" fill="none"
                    class="opacity-25"
                    />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            Processing...
        </span>`;

    try{
        const response = await authFetch(`/Ai/generateDescription`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ title: titleEl.value})
        });
        const data = await response.json()
        descriptionEl.value = data.description;
        return response;
    } catch {
        console.error();
    } finally {
        buttonEl.innerHTML = original;
        buttonEl.disabled = false;
    }

}