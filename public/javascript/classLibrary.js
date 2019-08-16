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
  }
};
