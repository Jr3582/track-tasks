const createTaskform = document.getElementById("createTask");
const updateTaskform = document.getElementById("updateTask");
const createProjectForm = document.getElementById("createProject");
const statusDropDown = document.getElementById("statusDropDownOptions");
const urgencyDropDown = document.getElementById("urgencyDropDownOptions");
const updateStatusDropDown = document.getElementById("updateStatusDropDownOptions");
const updateUrgencyDropDown = document.getElementById("updateUrgencyDropDownOptions");

const createPopUp = document.getElementById("popUp");
const updatePopUp = document.getElementById("updatePopUp");
const delPopUp = document.getElementById("deletePopUp");
const createNewProjectPopUp = document.getElementById("createNewProjectPopUp");

//FORM INPUTS TO CREATE
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

//FORM INPUTS FOR PROJECT CREATION
const projectName = document.getElementById("projName");
const projectDescription = document.getElementById("projDescription");
const projOwner = document.getElementById("projOwner");
const projectCreateDate = document.getElementById("projectCreateDate");

//BUTTON TO DELETE TASK
const deleteBtn = document.getElementById("deleteBtn");
const confirmDel = document.getElementById("confirmDel");
const projectNameText = document.getElementById("deleteProjectName");

//SORTABLE
const todo_col = document.getElementById("todo_col");
const inprog_col = document.getElementById("inprog_col");
const inrew_col = document.getElementById("inrew_col");
const done_col = document.getElementById("done_col");

//SIDE MENU
const sideMenu = document.getElementById("sideMenu");
const toggleSideMenuText = document.getElementById("toggleSideMenuText");
const listOfCurProjects = document.getElementById("listOfProjects");
const curProjectName = document.getElementById("curProjectName");