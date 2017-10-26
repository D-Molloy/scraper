function getTimes() {
  $.getJSON("/times", function(data) {
    // For each one
    console.log("HERE IS YOUR DATA" + data);
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#irish-times-results").append(
        "<a href=" +
          data[i].link +
          ' target="_blank"><div class="results-div hoverable"><p class="res-headline">' +
          data[i].headline +
          '</p><p class="res-summary">' +
          data[i].summary +
          "</p></div></a>"
      );
    }
  });
  getIndependent();
}

function getIndependent() {
  $.getJSON("/independent", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      // $("#ind-results").append("<p>" + data[i].headline + "</p>");
      $("#ind-results").append(
        "<a href=" +
          data[i].link +
          ' target="_blank"><div class="results-div hoverable"><p class="res-headline">' +
          data[i].headline +
          '</p><p class="res-summary">' +
          data[i].summary +
          "</p></div></a>"
      );
    }
  });
}

$(document).ready(function() {
  $(".collapsible").collapsible();
  $("button").on("click", function() {
    $("#ind-results").empty();
    $("#irish-times-results").empty();
    // alert("clicked!");
    $.ajax({
      method: "GET",
      url: "/scrape"
    }).done(function(data) {
      $.getJSON("/articles", function(data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].source == "independent") {
            // Display the apropos information on the page
            $("#ind-results").append(
              "<a href=" +
                data[i].link +
                ' target="_blank"><div class="results-div hoverable"><p class="res-headline">' +
                data[i].headline +
                '</p><p class="res-summary">' +
                data[i].summary +
                "</p></div></a>"
            );
          } else if (data[i].source === "times") {
            $("#irish-times-results").append(
              "<a href=" +
                data[i].link +
                ' target="_blank"><div class="results-div hoverable"><p class="res-headline">' +
                data[i].headline +
                '</p><p class="res-summary">' +
                data[i].summary +
                "</p></div></a>"
            );
          } else if (data[i].source === "midwest"){
            $('#midwest-results').append(
              "<a href=" +
              data[i].link +
              ' target="_blank"><div class="results-div hoverable"><p class="res-headline">' +
              data[i].headline +
              '</p></div></a>'
            );
          }
        }
      });
    });
  }); //end event handler
});
