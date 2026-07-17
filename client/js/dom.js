const createTaskform = document.getElementById("createTask");
const updateTaskform = document.getElementById("updateTask");
const createProjectForm = document.getElementById("createProject");
const statusDropDown = document.getElementById("statusDropDownOptions");
const urgencyDropDown = document.getElementById("urgencyDropDownOptions");
const ownerDropDown = document.getElementById("ownerDropDownOptions");
const updateStatusDropDown = document.getElementById("updateStatusDropDownOptions");
const updateUrgencyDropDown = document.getElementById("updateUrgencyDropDownOptions");
const updateOwnerDropDown = document.getElementById("updateOwnerDropDownOptions");

const createPopUp = document.getElementById("popUp");
const updatePopUp = document.getElementById("updatePopUp");
const delPopUp = document.getElementById("deletePopUp");
const createNewProjectPopUp = document.getElementById("createNewProjectPopUp");

//GENERATE AI DESCRIPTION BUTTON
const generateUpdateDescriptionButton = document.getElementById("generateUpdateDescriptionButton");
const generateCreateDescriptionButton = document.getElementById("generateCreateDescriptionButton");

//ADDING MEMBERS
const memberUsername = document.getElementById("memberUsername");
const addMembersPopUp = document.getElementById("addMembersPopUp");
const addMemButton = document.getElementById("addMemButton");
const memberPopUpText = document.getElementById("memberPopUpText");
const usernameSuggestions = document.getElementById("usernameSuggestions");

//VIEWING MEMBERS
const viewMembersPopUp = document.getElementById("viewMembersPopUp");
const listOfMembers = document.getElementById("listOfMembers");
const closeViewMemPopUp = document.getElementById("closeViewMemPopUp");

//DELETE PROJECT POPUP
const deleteProjectsPopUp = document.getElementById("deleteProjectsPopUp");
const deleteProjectName = document.getElementById("deleteProjectName");
const confirmDelProj = document.getElementById("confirmDelProj");
const confirmKeepProj = document.getElementById("confirmKeepProj");

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
const invalidProjTitleMsg = document.getElementById("invalidProjTitleMsg");
const invalidProjDescriptionMsg = document.getElementById("invalidProjDescriptionMsg");
const invalidOwnerMsg = document.getElementById("invalidOwnerMsg");

//DELETE TASK
const deleteBtn = document.getElementById("deleteBtn");
const confirmDelTask = document.getElementById("confirmDelTask");
const confirmKeepTask = document.getElementById("confirmKeepTask");
const taskName = document.getElementById("deleteTaskName");

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
const kebabMenu = document.getElementById("kebabDropdown");
const displayUsername = document.getElementById("displayUsername");
const toolTip = document.getElementById("toolTip");
const usernamePill = document.getElementById("usernamePill");

//REGISTERING USERS
const usernameInput = document.getElementById("usernameInput");
const emailInput = document.getElementById("emailInput");
const usernameErrorMsg = document.getElementById("usernameErrorMsg");
const emailErrorMsg = document.getElementById("emailErrorMsg");
const registerForm = document.getElementById("registerForm");
const registerErrorMsg = document.getElementById("registerErrorMsg");
const registerUserBtn = document.getElementById("registerUserBtn");

//PASSWORD DOMS
const showPassBtn = document.getElementById("showPassBtn");
const passwordInput = document.getElementById("passwordInput");
const confirmPasswordInput = document.getElementById("confirmPasswordInput");
const passwordValidationMsg = document.getElementById("passwordValidationMsg");
const confirmPassMsg = document.getElementById("confirmPassMsg");