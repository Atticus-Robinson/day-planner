//Fill sticky-top item with current date and time
$("#date-sticky").text(luxon.DateTime.now().toLocaleString(luxon.DateTime.DATETIME_FULL));

var startTime;
var endTime;

days = {

}

//Generate settings/preferences modal on click of gear icon
$("header").on("click", "span", function() {
    console.log("generate modal");
})

//Generate ul's and li's for schedule
function createSchedule() {
    //debugger;

    //Change start and end time here
    startTime = 6;
    endTime = 18;
    
    //Set horizontal item id to start time
    var hourUlId = startTime;

    //Create horizontal ul item for each hour up to end time
    while (hourUlId <= endTime) {
        
        //Horizontal ul item
        var hourUl = $("<ul>")
        .addClass("list-group list-group-horizontal")
        .attr("id", hourUlId);
        $(".schedule-container").append(hourUl);

        //First li item, hour text. Text created from current ul id i.e. the hour
        displayId = amOrPm(hourUlId);
        var hourLi = $("<li>")
        .addClass("list-group-item hour-item text-left")
        .text(displayId);

        //Second li item, task text content
        var taskLi = $("<li>")
        .addClass("list-group-item task-item");

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
}

function scheduleFill() {
    $(".list-group-horizontal").each(function () {
        $()
    })
}

function amOrPm(hourUlId) {
    if (hourUlId <= 12) return (hourUlId + "am"); 
    hourUlId = hourUlId - 12;
    return (hourUlId + "pm");
}

//When task text item is clicked 
$(".schedule-container").on("click", ".task-item", function() {
    //Create input field
    var inputField = $("<input>").
    addClass("list-group-item task-item-input")
    .attr("placeholder", "Enter text");

    //Repalce item with input field and focus to field
    $(this).replaceWith(inputField);
    inputField.trigger("focus");
    console.log($(this));

    //When task item is clicked away from: save input text, recreate list item
    $("input").blur(function() {
    
    inputText = inputField.val();

    var taskLi = $("<li>")
    .addClass("list-group-item task-item")
    .text(inputText);
    

    $(this).replaceWith(taskLi);
    storeCurrentDay();
    })
})

//When save button is clicked
$(".schedule-container").on("click", ".save-item", function(event) {
    ulItem = $(event.target).closest("ul");
    id = $(ulItem)
    .attr("id");
    storeTask(id);
})
function storeTask(taskId) {

}

function storeCurrentDay() {
    date = luxon.DateTime.now().toLocaleString(luxon.DateTime.DATE_SHORT);
    for(var i = 0; i < 25; i++) {
        var taskText = $(".schedule-container").find("#" + i).find(".task-item").text();
        if (taskText) {
            console.log(days);
            console.log(date);
            days[date] = date;
            console.log(days);
        }
    }

};
  
function createNewArray() {
    date = luxon.DateTime.now().toLocaleString(luxon.DateTime.DATE_SHORT);
    days[date] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    console.log(days);
}
function retrieveDay() {
    days = JSON.parse(localStorage.getItem("days"));
    console.log(days);
    
    if (!days) {
      
      console.log("New array: " + days);
    }

    $.each(days, function (list, arr) {
        console.log(list, arr);
        // then loop over sub-array
        arr.forEach(function (item) {
          //creatItem
        });
      });
}

//Generate current time in sticky-top and update every minute
setInterval(function () {
    $("#date-sticky").text(luxon.DateTime.now().toLocaleString(luxon.DateTime.DATETIME_FULL));
}, (1000 * 60))

createNewArray();
createSchedule();
