const { ipcRenderer } = require("electron");

// Functions to allow data to be retrieved from form
const classLibrary = require("../public/javascript/classLibrary.js");
const retrieveList = classLibrary.retrieveList;
const retrieveListFromDays = classLibrary.retrieveListFromDays;
const getDateUnavailable = classLibrary.getDateUnavailable;
const retrieveListFromProlonged = classLibrary.retrieveListFromProlonged;
const fillSkills = classLibrary.fillSkills;

// get shifts
shifts = ipcRenderer.sendSync("getShiftRequestSync");

// Get skills/positions
skills = ipcRenderer.sendSync("getBusinessInfoSync").skills;


function getPreferredShiftsList(className, daysOfWeek) {
    preferredShifts = {};

    daysOfWeek.forEach(day => {
        preferredShifts[day] = [];
    })

    // looping through every form-check
    $("." + className).each((index, obj) => {
        if ($(obj).is(":checked")) {
            var data = $(obj).attr("id").split("_");

            shift = {
                startTime: data[2],
                endTime: data[3],
                position: data[1].split("+").join(" ")
            }

            preferredShifts[data[0]].push(shift);
        }
    })

    return preferredShifts;
}

// INPUT: value -> input in military time format
// OUTPUT: time in format X:XX AM/PM
function convertStandardTime(value) {
    if (value !== null && value !== undefined) { //If value is passed in
        if (value.indexOf('AM') > -1 || value.indexOf('PM') > -1) { //If time is already in standard time then don't format.
            return value;
        }
        else {
            if (value.length == 8) { //If value is the expected length for military time then process to standard time.
                var hour = value.substring(0, 2); //Extract hour
                var minutes = value.substring(3, 5); //Extract minutes
                var identifier = 'AM'; //Initialize AM PM identifier

                if (hour == 12) { //If hour is 12 then should set AM PM identifier to PM
                    identifier = 'PM';
                }
                if (hour == 0) { //If hour is 0 then set to 12 for standard time 12 AM
                    hour = 12;
                }
                if (hour > 12) { //If hour is greater than 12 then convert to standard 12 hour format and set the AM PM identifier to PM
                    hour = hour - 12;
                    identifier = 'PM';
                }

                // Removing any leading 0
                str = hour + ':' + minutes + ' ' + identifier;
                if (str[0] == '0') {
                    str = str.slice(1);
                }
                return str;//Return the constructed standard time
            }
            else { //If value is not the expected length than just return the value as is
                return value;
            }
        }
    }
}

function createShiftPreferencesTable(daysOfWeek) {


    $("#preferredShiftSection").append(
        '<div class="table-responsive">' +
        '<table class="table table-bordered">' +
        '<thead class="thead-light">' +
        '<tr>' +
        '<th id="monday" scope="col">' +
        'Monday' +
        '</th>' +
        '<th id="tuesday" scope="col">' +
        'Tuesday' +
        '</th>' +
        '<th id="wednesday" scope="col">' +
        'Wednesday' +
        '</th>' +
        '<th id="thursday" scope="col">' +
        'Thursday' +
        '</th>' +
        '<th id="friday" scope="col">' +
        'Friday' +
        '</th>' +
        '<th id="saturday" scope="col">' +
        'Saturday' +
        '</th>' +
        '<th id="sunday" scope="col">' +
        'Sunday' +
        '</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody id="preferredShiftTableBody"></tbody>' +
        '</table>' +
        '</div>'
    );

    daysOfWeek.forEach(day => {
        content = "";

        shifts[day].forEach(shift => {
            contentId = day + "_" + shift.position.split(" ").join("+") + "_" + shift.startTime + "_" + shift.endTime;

            message_1 = shift.position + ":";
            message_2 = convertStandardTime(shift.startTime + ":00") + "-" + convertStandardTime(shift.endTime + ":00")

            content += '<div class="form-check">' +
                '<input class="form-check-input" type="checkbox" value="" id="' + contentId + '">' +
                '<label class="form-check-label" for="' + contentId + '">' +
                '<b>' + message_1 + '<br/></b>' + message_2 +
                '</label>' +
                '</div>'
        })

        $("#preferredShiftTableBody").append(
            '<td>' +
            content +
            '</td>'
        )
    })
}

$(document).ready(() => {
    const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

    // Sets the datepicker on the input
    $(".input-group.date").datepicker({
        todayHighlight: true,
        autoclose: true
    });

    // ===================
    // POSITIONS
    // ===================

    // Adding a primary skill
    $("#addPrimaryPosition").on("click", e => {

        $("#primaryPositionsSection").prepend(
            '<div class="form-row">' +
            '<div class="form-group col-md-10">' +
            "<select" +
            ' class="form-control primaryPositions"' +
            ">" +
            '<option selected disable hidden value=""' +
            ">Select Primary Positions</option" +
            ">" +
            fillSkills(skills) +
            "</select>" +
            "</div>" +

            '<div class="form-group col-md-2">' +
            '<button class="btn btn-danger remove" type="button">' +
            'Remove' +
            '</button>' +
            '</div>' +
            "</div>"
        );
    });

    // Removing a primary position
    $(document).on("click", "button.remove", e => {
        // Getting the form row using parentNode twice!!
        e.target.parentNode.parentNode.remove();
    });

    // Adding a secondary position
    $("#addSecondaryPosition").on("click", e => {

        $("#secondaryPositionsSection").prepend(
            '<div class="form-row">' +
            '<div class="form-group col-md-10">' +
            '<select class="form-control secondaryPositions">' +
            '<option selected disable hidden value=""' +
            ">Select Secondary Skills</option" +
            ">" +
            fillSkills(skills) +
            "</select>" +
            "</div>" +

            '<div class="form-group col-md-2">' +
            '<button class="btn btn-danger remove" type="button">' +
            'Remove' +
            '</button>' +
            '</div>' +

            "</div>"
        );
    });

    // Removing a secondary position
    $(document).on("click", "button.removeSecondaryPosition", e => {
        // Getting the form row using parentNode twice!!
        e.target.parentNode.parentNode.remove();
    });



    // ==================
    // SHIFT PREFERENCES
    // ==================
    createShiftPreferencesTable(daysOfWeek);

    // ==================
    // UNAVAILABILITY
    // ==================
    //ADDING DAY UNAVAILABLE
    $("#addDayUnavailability").on("click", e => {
        // Appending new day unavailability
        $("#dayUnavailabilitySection").prepend(
            '<div class="form-row">' +
            '<div class="form-group col-md-3">' +
            "<select" +
            ' class="form-control dayUnavailable"' +
            ">" +
            '<option selected disable hidden value=""' +
            ">Day of the Week</option" +
            ">" +
            '<option value="Monday">Monday</option>' +
            '<option value="Tuesday">Tuesday</option>' +
            '<option value="Wednesday">Wednesday</option>' +
            '<option value="Thursday">Thursday</option>' +
            '<option value="Friday">Friday</option>' +
            '<option value="Saturday">Saturday</option>' +
            '<option value="Sunday">Sunday</option>' +
            "</select>" +
            "</div>" +
            '<div class="form-group col-md-4">' +
            "<input" +
            ' type="time"' +
            ' class="form-control startTime dayUnavailabilityStart"' +
            "/>" +
            "</div>" +
            '<div class="form-group col-md-4">' +
            "<input" +
            ' type="time"' +
            ' class="form-control endTime dayUnavailabilityEnd"' +
            "/>" +
            "</div>" +

            '<div class="form-group col-md-1">' +
            '<button class="btn btn-danger remove" type="button">' +
            'Remove' +
            '</button>' +
            '</div>' +

            "</div>"
        );

    });

    //ADDING DATE UNAVAILABLE
    $("#addDateUnavailability").on("click", e => {

        // Appending new date (the datepicker doesn't work, its okay b/c version 2 will disable added inputs)
        $("#dateUnavailableSection").prepend(
            '<div class="form-row">' +
            '<div class="form-group col-md-3">' +
            '<div class="input-group date">' +
            "<input" +
            ' placeholder="Date"' +
            ' type="text"' +
            ' class="form-control dateInput dateUnavailable"' +
            ' aria-describedby="calenderIcon"' +
            "/>" +
            '<div class="input-group-append">' +
            '<span class="input-group-text" id="calenderIcon"' +
            '><i class="fas fa-calendar-alt"></i' +
            "></span>" +
            "</div>" +
            "</div>" +
            "</div>" +

            '<div class="form-group col-md-4">' +
            "<input" +
            ' type="time"' +
            ' class="form-control startTime dateUnavailableStart"' +
            "/>" +
            "</div>" +
            '<div class="form-group col-md-4">' +
            "<input" +
            ' type="time"' +
            ' class="form-control endTime dateUnavailableEnd"' +
            "/>" +
            "</div>" +

            '<div class="form-group col-md-1">' +
            '<button class="btn btn-danger remove" type="button">' +
            'Remove' +
            '</button>' +
            '</div>' +

            "</div>"
        );

        // Sets the datepicker on the input
        $(".input-group.date").datepicker({
            todayHighlight: true,
            autoclose: true
        });

    });

    //ADDING PROLONGED UNAVAILABILITY
    $("#addProlongedUnavailability").on("click", e => {

        // Appending new prolonged unavailability
        $("#prolongedUnavailabilitySection").prepend(
            '<div class="form-row">' +
            '<div class="form-group col-md-5">' +
            '<div class="input-group date">' +
            "<input" +
            ' placeholder="Start Date"' +
            ' type="text"' +
            ' class="form-control dateInput prolongedUnavailabilityStart"' +
            "/>" +
            '<div class="input-group-append">' +
            '<span class="input-group-text" id="calenderIcon"' +
            '><i class="fas fa-calendar-alt"></i' +
            "></span>" +
            "</div>" +
            "</div>" +
            "</div>" +
            '<div class="form-group col-md-5">' +
            '<div class="input-group date">' +
            "<input" +
            ' type="text"' +
            ' placeholder="End Date"' +
            ' class="form-control dateInput prolongedUnavailabilityEnd"' +
            ' aria-describedby="calenderIcon"' +
            "/>" +
            '<div class="input-group-append">' +
            '<span class="input-group-text" id="calenderIcon"' +
            '><i class="fas fa-calendar-alt"></i' +
            "></span>" +
            "</div>" +
            "</div>" +
            "</div>" +

            '<div class="form-group col-md-2">' +
            '<button class="btn btn-danger remove" type="button">' +
            'Remove' +
            '</button>' +
            '</div>' +

            "</div>"
        );

        // Sets the datepicker on the input
        $(".input-group.date").datepicker({
            todayHighlight: true,
            autoclose: true
        });
    });

    // LEFT OFF HERE BUILDING THESE FUNCTIONS
    // ==================
    // SAVING EMPLOYEE 
    // ==================
    // Employee binding for new Employee
    $("#saveEmployee").on("click", e => {
        // Retrieving form data
        var employee = {
            firstName: $("#firstName").val(),
            lastName: $("#lastName").val(),
            minHoursPerWeek: $("#minHoursPerWeek").val(),
            maxHoursPerWeek: $("#maxHoursPerWeek").val(),
            hourlyWage: $("#hourlyWage").val(),
            primaryPositions: retrieveList("primaryPositions"),
            secondaryPositions: retrieveList("secondaryPositions"),
            daysUnavailable: retrieveListFromDays(
                "dayUnavailable",
                "dayUnavailabilityStart",
                "dayUnavailabilityEnd"
            ),
            datesUnavailable: getDateUnavailable("dateUnavailable", "dateUnavailableStart", "dateUnavailableEnd"),
            prolongedUnavailability: retrieveListFromProlonged(
                "prolongedUnavailabilityStart",
                "prolongedUnavailabilityEnd"
            ),
            preferredShifts: getPreferredShiftsList("form-check-input", daysOfWeek)
        };

        // Sending data to main process to be stored
        ipcRenderer.send("newEmployee", employee);

        // Receiving response and showing success message
    });
})







