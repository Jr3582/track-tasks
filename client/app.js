const form = document.getElementById("createTask");
const statusDropDown = document.getElementById("statusDropDownOptions");
const urgencyDropDown = document.getElementById("urgencyDropDownOptions");
const curStatus = document.getElementById("currentStatus");
const curUrgency = document.getElementById("curUrgency");

let st = "TO DO";

form.addEventListener("submit", function(event) {
    event.preventDefault();
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

function changeStatus(status) {
    curStatus.children[0].textContent = status;
    switch (status) {
        case "TO DO":
            st = "TO DO";

            removeBg();
            addBg("bg-blue-800");

            removeTextColor(curStatus.children[0], curStatus.children[1]);
            addTextColor(curStatus.children[0], "text-blue-500", curStatus.children[1], "text-blue-500");
            break;
        case "IN PROGRESS":
            st = "IN PROGRESS";

            removeBg();
            addBg("bg-green-800");

            removeTextColor(curStatus.children[0], curStatus.children[1]);
            addTextColor(curStatus.children[0], "text-green-500", curStatus.children[1], "text-green-500");
            break;
        case "REVIEWING":
            st = "REVIEWING";

            removeBg();
            addBg("bg-yellow-800");

            removeTextColor(curStatus.children[0], curStatus.children[1]);
            addTextColor(curStatus.children[0], "text-yellow-500", curStatus.children[1], "text-yellow-500");
            break;
        case "DONE":
            st = "DONE";

            removeBg();
            addBg("bg-red-800");

            removeTextColor(curStatus.children[0], curStatus.children[1]);
            addTextColor(curStatus.children[0], "text-red-500", curStatus.children[1], "text-red-500");
            break;
    }
    //DEBUGGING MESSAGE
    console.log(st);
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