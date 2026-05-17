const form = document.getElementById("createTask");
const dropDown = document.getElementById("dropDownOptions");
const curStatus = document.getElementById("currentStatus");

const statuses = {
    "To Do": { bg: "bg-blue-800", text: "text-blue-500"},
    "In Progress": { bg: "bg-green-800", text: "text-green-500"},
    "In Review": { bg: "bg-yellow-800", text: "text-yellow-500"},
    "Done": { bg: "bg-red-800", text: "text-red-500"}
}

let st = "TO DO";

form.addEventListener("submit", function(event) {
    event.preventDefault();
})

document.addEventListener("click", function(e) {
    if(dropDown.classList.contains("opacity-100")) {
        dropDown.classList.remove("opacity-100");
        dropDown.classList.add("opacity-0");

        dropDown.classList.remove("pointer-events-auto");
        dropDown.classList.add("pointer-events-none");

        //DEBUGGING MESSAGE
        console.log("hiding dropdown");
    }
})

function activateDropBox(event) {
    if(dropDown.classList.contains("opacity-0")) {
        event.stopPropagation();
        
        dropDown.classList.remove("opacity-0");
        dropDown.classList.remove("pointer-events-none");

        dropDown.classList.add("opacity-100");
        dropDown.classList.add("pointer-events-auto");

        //DEBUGGING MESSAGE
        console.log("openning dropdown");

        //NOTES:
        //pointer-events-none: Makes it so that you can click through without activating
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