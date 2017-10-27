
$(document).ready(function() {
  $(".collapsible").collapsible();
  $("button").on("click", function() {
    $("#ind-results").empty();
    $("#irish-times-results").empty();
    $("#midwest-results").empty();
    //add rte div

    // alert("clicked!");
    $.ajax({
      method: "GET",
      url: "/scrape"
    }).done(function(data) {
      setTimeout(populateDivs, 1 * 1000);

    }); //end done
  }); //end event handler
});


function populateDivs(){
  $.getJSON("/articles", function(data) {
    $('.article-stats').text(`${data.length} articles found.`)
    for (var i = 0; i < data.length; i++) {
      if (data[i].source === "times") {
        $("#times-results").append(
          "<a href=" +
            data[i].link +
            ' target="_blank"><div class="results-div hoverable"><p class="head-sum-headline">' +
            data[i].headline +
            '</p><p class="head-sum-summary">' +
            data[i].summary +
            "</p></div></a>"
        );
      } else if (data[i].source == "independent") {
        // Display the apropos information on the page
        $("#ind-results").append(
          "<a href=" +
            data[i].link +
            ' target="_blank"><div class="results-div hoverable"><p class="head-sum-headline">' +
            data[i].headline +
            '</p><p class="head-sum-summary">' +
            data[i].summary +
            "</p></div></a>"
        );
      } else if (data[i].source === "rte") {
        $("#rte-results").append(
          "<a href=" +
            data[i].link +
            ' target="_blank"><div class="results-div hoverable"><p class="head-headline">' +
            data[i].headline +
            "</p></div></a>"
        );
      } else if (data[i].source === "midwest") {
        $("#midwest-results").append(
          "<a href=" +
            data[i].link +
            ' target="_blank"><div class="results-div hoverable"><p class="head-headline">' +
            data[i].headline +
            "</p></div></a>"
        );
      };;

    }//end for loop
  }); //end getjson
}