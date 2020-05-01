// const { ipcRenderer } = require("electron");

const removeExcessInputs = classLibrary.removeExcessInputs;
const resetForm = classLibrary.resetForm;


ipcRenderer.on("showEmployee", (e, employee) => {
  resetForm(removeExcessInputs);

  // Setting Name of employee
  $(".card-header.text-white").html(
    "<h2>" + employee.firstName + " " + employee.lastName + "</h2>"
  );

  $("#firstName").val(employee.firstName);
  $("#lastName").val(employee.lastName);

  // Setting min and max hours
  $("#minHoursPerWeek").val(employee.minHoursPerWeek);
  $("#maxHoursPerWeek").val(employee.maxHoursPerWeek);

  // Setting primary skills
  if (employee.primarySkills.length > 1) {
    // Setting first field
    $(".primarySkills").val(employee.primarySkills[0]);

    // looping through and setting the rest
    for (var i = 1; i < employee.primarySkills.length; i++) {
      $("#primarySkillsSection").append(
        '<div class="form-row">' +
        '<div class="form-group col-md-10">' +
        "<select" +
        ' class="form-control primarySkills"' +
        ">" +
        '<option selected disable hidden value=""' +
        ">Select Primary Skills</option" +
        ">" +
        fillSkills(skills) +
        "</select>" +
        "</div>" +
        "</div>"
      );

      $(".primarySkills")
        .last()
        .val(employee.primarySkills[i]);
    }
  } else if (employee.primarySkills.length == 1) {
    $(".primarySkills").val(employee.primarySkills[0]);
  }

  // Setting secondary skills
  if (employee.secondarySkills.length > 1) {
    // Setting first field
    $(".secondarySkills").val(employee.secondarySkills[0]);

    // Looping through rest of secondary skills
    for (var i = 1; i < employee.secondarySkills.length; i++) {
      $("#secondarySkillsSection").append(
        '<div class="form-row">' +
        '<div class="form-group col-md-10">' +
        '<select class="form-control secondarySkills">' +
        '<option selected disable hidden value=""' +
        ">Select Secondary Skills</option" +
        ">" +
        fillSkills(skills) +
        "</select>" +
        "</div>" +
        "</div>"
      );

      $(".secondarySkills")
        .last()
        .val(employee.secondarySkills[i]);
    }
  } else if (employee.secondarySkills.length == 1) {
    $(".secondarySkills").val(employee.secondarySkills[0]);
  }

  // Setting days unavailable
  if (employee.daysUnavailable.length > 1) {
    // Setting first field
    $(".dayUnavailable").val(employee.daysUnavailable[0].dayOfWeek);

    $(".dayUnavailabilityStart").val(employee.daysUnavailable[0].startTime);

    $(".dayUnavailabilityEnd").val(employee.daysUnavailable[0].endTime);

    // Appending the rest of the fields
    for (var i = 1; i < employee.daysUnavailable.length; i++) {
      $("#dayUnavailabilitySection").append(
        '<div class="form-row">' +
        '<div class="form-group col-md-6">' +
        "<select" +
        ' class="form-control dayUnavailable"' +
        ">" +
        '<option selected disable hidden value=""' +
        ">Select Day of the Week</option" +
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
        '<div class="form-group col-md-2">' +
        "<input" +
        ' type="time"' +
        ' class="form-control dayUnavailabilityStart"' +
        "/>" +
        "</div>" +
        '<div class="form-group col-md-2">' +
        "<input" +
        ' type="time"' +
        ' class="form-control dayUnavailabilityEnd"' +
        "/>" +
        "</div>" +
        "</div>"
      );

      // Setting value of new day unavailability
      $(".dayUnavailable")
        .last()
        .val(employee.daysUnavailable[i].dayOfWeek);
      $(".dayUnavailabilityStart")
        .last()
        .val(employee.daysUnavailable[i].startTime);
      $(".dayUnavailabilityEnd")
        .last()
        .val(employee.daysUnavailable[i].endTime);
    }
  } else if (employee.daysUnavailable.length == 1) {
    $(".dayUnavailable").val(employee.daysUnavailable[0].dayOfWeek);

    $(".dayUnavailabilityStart").val(employee.daysUnavailable[0].startTime);

    $(".dayUnavailabilityEnd").val(employee.daysUnavailable[0].endTime);
  }

  // Setting dates unavailable
  if (employee.datesUnavailable.length > 1) {
    // Setting first date
    $(".dateUnavailable").val(employee.datesUnavailable[0]);

    // Appending the rest of the dates
    for (var i = 1; i < employee.datesUnavailable.length; i++) {
      $("#dateUnavailableSection").append(
        '<div class="form-row">' +
        '<div class="form-group col-md-10">' +
        '<div class="input-group date">' +
        "<input" +
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
        "</div>"
      );

      $(".dateUnavailable")
        .last()
        .val(employee.datesUnavailable[i]);
    }
  } else if (employee.datesUnavailable.length == 1) {
    $(".dateUnavailable").val(employee.datesUnavailable[0]);
  }

  // Setting prolonged unavailability
  if (employee.prolongedUnavailability.length > 1) {
    console.log(employee.prolongedUnavailability[0].startTime);
    // Setting first row
    $(".prolongedUnavailabilityStart").val(
      employee.prolongedUnavailability[0].startTime
    );

    $(".prolongedUnavailabilityEnd").val(
      employee.prolongedUnavailability[0].endTime
    );

    for (var i = 1; i < employee.prolongedUnavailability.length; i++) {
      // Appending new prolonged unavailability
      $("#prolongedUnavailabilitySection").append(
        '<div class="form-row">' +
        '<div class="form-group col-md-5">' +
        '<div class="input-group date">' +
        "<input" +
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
        "</div>"
      );

      console.log(
        "PROLONGED UNAVAIL " +
        i +
        ":" +
        employee.prolongedUnavailability[i].startTime
      );
      // Setting selected times
      $(".prolongedUnavailabilityStart")
        .last()
        .val(employee.prolongedUnavailability[i].startTime);
      $(".prolongedUnavailabilityEnd")
        .last()
        .val(employee.prolongedUnavailability[i].endTime);
    }
  } else if (employee.prolongedUnavailability.length == 1) {
    $(".prolongedUnavailabilityStart").val(
      employee.prolongedUnavailability[0].startTime
    );

    $(".prolongedUnavailabilityEnd").val(
      employee.prolongedUnavailability[0].endTime
    );
  }

  // Setting preferred shifts
  if (employee.preferredShifts.length > 1) {
    for (var i = 1; i < employee.preferredShifts.length; i++) {
      // Setting first row
      $(".preferredShift").val(employee.preferredShifts[0].dayOfWeek);

      $(".preferredShiftStart").val(employee.preferredShifts[0].startTime);

      $(".preferredShiftEnd").val(employee.preferredShifts[0].endTime);

      // Appending the rest
      $("#preferredShiftSection").append(
        '<div class="form-row">' +
        '<div class="form-group col-md-6">' +
        '<select class="form-control preferredShift">' +
        '<option selected disable hidden value=""' +
        ">Select Day of the Week</option" +
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
        '<div class="form-group col-md-2">' +
        '<input type="time" class="form-control preferredShiftStart" />' +
        "</div>" +
        '<div class="form-group col-md-2">' +
        '<input type="time" class="form-control preferredShiftEnd" />' +
        "</div>" +
        "</div>"
      );

      // Setting selected preferred shift and time
      $(".preferredShift")
        .last()
        .val(employee.preferredShifts[i].dayOfWeek);
      $(".preferredShiftStart")
        .last()
        .val(employee.preferredShifts[i].startTime);
      $(".preferredShiftEnd")
        .last()
        .val(employee.preferredShifts[i].endTime);
    }
  } else if (employee.preferredShifts.length == 1) {
    $(".preferredShift").val(employee.preferredShifts[0].dayOfWeek);

    $(".preferredShiftStart").val(employee.preferredShifts[0].startTime);

    $(".preferredShiftEnd").val(employee.preferredShifts[0].endTime);
  }

  // Required for fixing bug in which jquery would run twice
  $("#updateEmployee").unbind("click");

  $("#updateEmployee").click(e => {
    // Retrieving form data
    var updatedEmployee = {
      firstName: $("#firstName").val(),
      lastName: $("#lastName").val(),
      minHoursPerWeek: $("#minHoursPerWeek").val(),
      maxHoursPerWeek: $("#maxHoursPerWeek").val(),
      primarySkills: retrieveList("primarySkills"),
      secondarySkills: retrieveList("secondarySkills"),
      daysUnavailable: retrieveListFromDays(
        "dayUnavailable",
        "dayUnavailabilityStart",
        "dayUnavailabilityEnd"
      ),
      datesUnavailable: retrieveList("dateUnavailable"),
      prolongedUnavailability: retrieveListFromProlonged(
        "prolongedUnavailabilityStart",
        "prolongedUnavailabilityEnd"
      ),
      preferredShifts: retrieveListFromDays(
        "preferredShift",
        "preferredShiftStart",
        "preferredShiftEnd"
      )
    };

    console.log("BEFORE UPDATING DATABASE EMPLOYEE");
    console.log(updatedEmployee);
    console.log(employee._id);

    // Sending data to main process to be stored
    ipcRenderer.send("updateEmployee", {
      id: employee._id,
      updatedEmployee: updatedEmployee
    });
  });
});
