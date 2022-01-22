var startTime = 6;
var endTime = 18;
var daysObject;
var hourUlId;
var luxonObject = luxon.DateTime.local();


//Create Schedule Container and Sticky-top
function createContainer(luxonObject) {

    //Create container and append after jumbotron
    console.log("New Container");
    var ulDiv = $("<div>")
        .addClass("schedule-container");
    var stickyP = $("<p>")
        .addClass("sticky-top text-center bg-info text-white")
        .attr("id", "date-sticky")
    ulDiv.append(stickyP);
    $(".jumbotron").after(ulDiv);

    //Fill sticky-top with DATE_SHORT from Luxon object
    $("#date-sticky").text(luxonObject.toLocaleString(luxon.DateTime.DATE_HUGE));

    createSchedule(luxonObject);

}

//Generate ul's and li's for schedule
function createSchedule(luxonObject1) {
    retrieveDay(luxonObject1);

    //Set horizontal item id to start time
    hourUlId = startTime;
    //Create horizontal ul item for each hour up to end time
    while (hourUlId <= endTime) {

        //Horizontal ul item
        var hourUl = $("<ul>")
            .addClass("list-group list-group-horizontal")
            .attr("id", hourUlId);
        $(".schedule-container").append(hourUl);

        //First li item, hour text. Text created from current ul id i.e. the hour
        if (hourUlId < 12) {
            var meridian = "am";
        } else if (hourUlId >= 12) {
            var meridian = "pm";
        }
        displayId = amOrPm(hourUlId);
        var hourLi = $("<li>")
            .addClass("list-group-item hour-item text-left")
            .text(displayId + meridian);

        //Second li item, task text content
        let fill = retrieveTask(hourUlId);
        var taskLi = $("<li>")
            .addClass("list-group-item task-item")
            .text(fill);

        //Third li item, save/delete button
        var saveLi = $("<li>")
            .addClass("list-group-item save-item");

        var saveIcon = $("<span>")
            .addClass("bi bi-caret-down fa-2x");

        //Append all li items and increment  hourUlId
        hourUl.append(hourLi, taskLi, saveLi);
        saveLi.append(saveIcon);
        hourUlId++;
    }
    console.log("List Created");
    //Audit tasks after list creation
    const time2 = new luxon.DateTime.now();
    console.log(time2);
    dueAudit(luxonObject1, time2);
}

//Retrieve local storage item for selected day
function retrieveDay(luxonObject2) {

    //Pull local storage and parse
    daysObject = JSON.parse(localStorage.getItem("daysObject"));
    //Match Luxon data to local storage key
    selectedDateShort = luxonObject2.toLocaleString(luxon.DateTime.DATE_SHORT);

    //If no local storage item exits, createNewObject
    if (!daysObject) {
        console.log("No Stored Data, Creating New Object...");
        daysObject = createNewObject();
    }
    //If local storage item exists
    else {
        console.log("Retieving Stored Data");
        console.log(daysObject);
        //If there is no stored info at selected date, create a new array
        if (!daysObject[selectedDateShort]) {
            console.log("No Stored Data For Selected Date, Creating Array...");
            createNewArray();
        }
    }
}

function createNewObject() {
    //Create empty object
    daysObject = {

    }
    //Call createNewArray to fill object
    createNewArray();
    return daysObject;
}

function createNewArray() {
    console.log("Creating New Object For Current Date");
    //Create empty 24 length array in daysObject, with key name of selected date
    daysObject[selectedDateShort] = Array(24);
}

function amOrPm(input) {
    if (input <= 12) return input;
    input = input - 12;
    return input;
}

function retrieveTask(hourUlId) {
    //If value exists at index array for selected date within daysObject, return text
    if (taskText = daysObject[selectedDateShort][hourUlId]) return taskText;
}


//Check each list item, change color based on position relative to current time
function dueAudit(luxonObject3, checkTimeObject) {
    console.log("Auditing Tasks...");

    //Round selected day to start of day (12am). Convert to unix
    var selectHour = luxonObject3.startOf('day');
    selectHour = (selectHour.valueOf());

    //Round current time to beggining of hour. Convert to unix
    var currentHour = checkTimeObject.startOf('hour');
    currentHour = (currentHour.valueOf());

    //Target schedule container, find each hour horizontal
    $(".schedule-container").find(".list-group-horizontal").each(function () {
        //On each horizontal; convert id (hour of day) to miliseconds, add to selected hour (12 am).
        var convertHour = (selectHour + (($(this).attr("id")) * (60 * 60 * 1000)));
        //Set class based on unix value comparison
        if (convertHour < currentHour) {
            $(this).find(".hour-item").addClass("past-due");
        } else if (convertHour === currentHour) {
            $(this).find(".hour-item").addClass("current-due")
        } else if (convertHour > currentHour) {
            $(this).find(".hour-item").addClass("future-due");
        }
    });

}

//Interval to change dueAudit check hour
setInterval(function () {
    const time = new luxon.DateTime.now();
    dueAudit(luxonObject, time);
}, 1000 * 60);

//When task text item is clicked 
$("body").on("click", ".task-item", function () {
    //Create input field
    var inputField = $("<input>").
    addClass("list-group-item task-item-input")
        .attr("placeholder", "Enter text");

    //Repalce item with input field and focus to field
    $(this).replaceWith(inputField);
    inputField.trigger("focus");

    //When task item is clicked away from: save input text, recreate list item
    $(".task-item-input").blur(function () {

        inputText = inputField.val();

        var taskLi = $("<li>")
            .addClass("list-group-item task-item")
            .text(inputText);


        $(this).replaceWith(taskLi);
    })
})

//When save button is clicked
$("body").on("click", ".save-item", function (event) {
    ulItem = $(event.target).closest("ul");
    id = $(ulItem)
        .attr("id");
    storeTask(id);
})

//Store task text into matching object => array, called when save button is clicked on task line
function storeTask(taskId) {
    let taskText = $(".schedule-container").find("#" + taskId).find(".task-item").text();
    daysObject[selectedDateShort][(taskId)] = taskText;
    console.log("Store Task Run");
    storeObject();
}

//Store days object in local storage
function storeObject() {
    let objectString = JSON.stringify(daysObject);
    console.log("Stringify Object: " + objectString);
    localStorage.setItem("daysObject", objectString);

}

$("#preferences-modal").on("show.bs.modal", function () {
    var jar = dateFormatChanger("/", "-", luxonObject.toLocaleString(luxon.DateTime.DATE_SHORT))
    $(".date-input").val(jar);
    $("#start-time-number").val(amOrPm(startTime));
    $("#end-time-number").val(amOrPm(endTime));
})

//Used to reconcile / usage in luxon with - usage in datepicker
function dateFormatChanger(changeFrom, changeTo, string) {
    var inter = string.replace(changeFrom, changeTo);
    var changed = inter.replace(changeFrom, changeTo);
    return changed;
}

//When save button on modal is clicked
$("#preferences-modal").on("click", ".btn-save", function () {
    console.log("Save Preferences");

    //Check Start and End time numbers
    startTime = parseFloat($("#start-time-number").val());
    endTime = parseFloat($("#end-time-number").val());
    var startTime12 = $("#start-time-selector").val();
    var endTime12 = $("#end-time-selector").val();

    console.log("New Start Time: " + startTime + startTime12);
    console.log("New End Time: " + endTime + endTime12);

    var check = checkNewTimes(startTime, endTime, startTime12, endTime12);

    //Store Date
    var dateReturn = $(".date-input").val();
    newDate = (dateFormatChanger("-", "/", dateReturn)).split("/");
    var newDay = {
        month: Number(newDate[0]),
        day: Number(newDate[1]),
        year: Number(newDate[2])
    }

    var newDateObject = luxon.DateTime.fromObject({
        month: newDay.month,
        day: newDay.day,
        year: newDay.year
    });

    console.log(newDateObject);

    if (!check) return;
    $("#preferences-modal").modal("hide");
    $(".schedule-container").remove();
    createContainer(newDateObject);


})

//Check validity of new times
function checkNewTimes(num1, num2, val1, val2) {
    if (isNaN(num1) || num1 >= 13) {
        window.alert("Please enter a valid time");
        $("#start-time-number").val('');
        return false;
    }
    if (isNaN(num2) || num2 >= 13) {
        window.alert("Please enter a valid time");
        $("#end-time-number").val('');
        return false;
    }
    if (val1 === "PM") {
        startTime = (num1 + 12);
    }

    if (val2 === "PM") {
        endTime = (num2 + 12);
    }
    if (startTime >= endTime) {
        window.alert("Please enter a valid time range");
        return false;
    }
    return true;
}


//Store entire day's tasks into matching array, called on save day click
function storeCurrentDay() {
    for (var i = 0; i <= 23; i++) {
        var taskText = $(".schedule-container").find("#" + i).find(".task-item").text();
        if (taskText) {
            daysObject[selectedDateShort][i] = taskText;
        }
    }
    console.log("Store Day Run: " + daysObject);
    storeObject();
}

//Create datepicker
$(".date-input").datepicker({
    dateFormat: "m-d-yy",
})

//When document is ready, call createContainer on current day (luxon object)
$("document").ready(function () {
    console.log("Document Ready");
    createContainer(luxonObject);
})