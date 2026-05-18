const form = document.getElementById("createTask");
const statusDropDown = document.getElementById("statusDropDownOptions");
const urgencyDropDown = document.getElementById("urgencyDropDownOptions");
const curStatus = document.getElementById("currentStatus");
const curUrgency = document.getElementById("curUrgency");
const popUp = document.getElementById("popUp");

let st = "TO DO";

//STOPS THE PAGE FROM REFRESHING AFTER SUBMITTING
form.addEventListener("submit", function(event) {
    event.preventDefault();
})

//STOPS THE FORM FROM DISAPPEARING IF CLICKED INSIDE
form.addEventListener("click", function(event) {
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
    switchOption(status, "TO DO", "IN PROGRESS", "REVIEWING", "DONE", "bg-blue-800", "bg-green-800", "bg-yellow-800", "bg-red-800", "text-blue-500", "text-green-500", "text-yellow-500", "text-red-500", curStatus);
    
    //DEBUGGING MESSAGE
    console.log(st);
}

//CHANGE URGENCY FOR DROPDOWN
function changeUrgency(urgency) {
    switchOption(urgency, "LOW", "URGENT", "VERY URGENT", "TOP PRIORITY", "bg-green-800", "bg-yellow-800", "bg-orange-800", "bg-red-800", "text-green-500", "text-yellow-500", "text-orange-500", "text-red-500", curUrgency);
    
    //DEBUGGING MESSAGE
    console.log(st);
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
function removeBg() {
    const bgClass = [...curStatus.classList].find(cls => cls.startsWith("bg-"));
    if(bgClass) curStatus.classList.remove(bgClass);
}

function addBg(bgClass) {
    curStatus.classList.add(bgClass);
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
    switch (choice) {
        case o1:
            st = o1;

            removeBg();
            addBg(o1c);

            removeTextColor(curChoice.children[0], curChoice.children[1]);
            addTextColor(curChoice.children[0], o1tc, curChoice.children[1], o1tc);
            break;
        case o2:
            st = o2;

            removeBg();
            addBg(o2c);

            removeTextColor(curChoice.children[0], curChoice.children[1]);
            addTextColor(curChoice.children[0], o2tc, curChoice.children[1], o2tc);
            break;
        case o3:
            st = o3;

            removeBg();
            addBg(o3c);

            removeTextColor(curChoice.children[0], curChoice.children[1]);
            addTextColor(curChoice.children[0], o3tc, curChoice.children[1], o3tc);
            break;
        case o4:
            st = o4;

            removeBg();
            addBg(o4c);

            removeTextColor(curChoice.children[0], curChoice.children[1]);
            addTextColor(curChoice.children[0], o4tc, curChoice.children[1], o4tc);
            break;
    }
}