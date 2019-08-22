module.exports = {
  retrieveList: className => {
    var valuesInList = [];

    // Didnt use arrow func. b/c of jquery bug
    $("." + className).each(function(i, obj) {
      if ($(this).val() != "" && $(this).val() != " ") {
        valuesInList.push($(this).val());
      }
    });

    return valuesInList;
  },

  retrieveListFromDays: (className, startClass, endClass) => {
    var valuesInList = [];
    $("." + className).each(function(i, obj) {
      if ($(this).val() != "" && $(this).val() != " ") {
        var dayUnavailable = {
          dayOfWeek: $(this).val(),
          startTime: $("." + startClass)
            .eq(i)
            .val(),
          endTime: $("." + endClass)
            .eq(i)
            .val()
        };
        valuesInList.push(dayUnavailable);
      }
    });

    return valuesInList;
  },

  retrieveListFromProlonged: (startClass, endClass) => {
    var valuesInList = [];
    $("." + startClass).each(function(i, obj) {
      if ($(this).val() != "" && $(this).val() != " ") {
        var prolongedUnavailability = {
          startTime: $(this).val(),
          endTime: $("." + endClass)
            .eq(i)
            .val()
        };

        valuesInList.push(prolongedUnavailability);
      }
    });

    return valuesInList;
  },

  removeExcessInputs: listOfClassNames => {
    listOfClassNames.forEach(className => {
      var obj = $("." + className);
      var num = obj.length;

      for (var i = num - 1; i > 0; i--) {
        // Checking if the classname is special case in which parent of parent needs to be removed
        if (
          className == "dateUnavailable" ||
          className == "prolongedUnavailability"
        ) {
          obj
            .eq(i)
            .parent()
            .parent()
            .remove();
        }
        // In all other cases, just remove the class' parent
        else {
          obj
            .eq(i)
            .parent()
            .remove();
        }
      }

      obj.val("");
    });
  },

  // Resetting the form is necessary because of jquery append's permanence
  resetForm: removeExcessInputs => {
    // Get rid of extra primary skills
    removeExcessInputs(["primarySkills"]);

    // Get rid of extra secondary skills
    removeExcessInputs(["secondarySkills"]);

    // Get rid of extra days available
    removeExcessInputs([
      "dayUnavailable",
      "dayUnavailabilityStart",
      "dayUnavailabilityEnd"
    ]);

    // Get rid of extra dates available
    removeExcessInputs(["dateUnavailable"]);

    // Get rid of extra prolonged unavailabilities
    removeExcessInputs([
      "prolongedUnavailabilityStart",
      "prolongedUnavailabilityEnd"
    ]);

    // Get rid of extra preferred shifts
    removeExcessInputs([
      "preferredShift",
      "preferredShiftStart",
      "preferredShiftEnd"
    ]);
  }
};
