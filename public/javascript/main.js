// /* global $ */

$(document).ready(() => {
  // Sets the datepicker on the input
  $(".input-group.date").datepicker({
    todayHighlight: true,
    autoclose: true
  });

  // Sets value of datepicker to today's date for all date inputs
  today = new Date();
  date =
    today.getMonth() + 1 + "-" + today.getDate() + "-" + today.getFullYear();
  $(".dateInput").val(date);

  //===================
  // FORM FUNCTIONALITY
  //===================

  //ADDING PRIMARY SKILL
  $("#addPrimarySkill").on("click", (e) => {
    //Getting the currently selected primary skills
    var primarySkill = $(".primarySkills").first().val();

    $("#primarySkillsSection").append('<div class="form-row">' +
      '<div class="form-group col-md-10">' +
      '<select' +
      ' class="form-control primarySkills"' +
      '>' +
      '<option selected disable hidden value=""' +
      '>Select Primary Skills</option' +
      '>' +
      '<option value="Prescription Processing"' +
      '>Prescription Processing</option' +
      '>' +
      '<option value="Medication Counting"' +
      '>Medication Counting</option' +
      '>' +
      '<option value="Cashier">Cashier</option>' +
      '</select>' +
      '</div>')

    // Setting selected primary skill to new input
    $(".primarySkills").last().val(primarySkill)

    // Resetting input
    $(".primarySkills").first().val("")
  })
  
  //ADDING SECONDARY SKILL
  //ADDING DAY UNAVAILABLE
  //ADDING DATE UNAVAILABLE
  //ADDING PROLONGED UNAVAILABILITY
  //ADDING PREFERRED SHIFTS
});
