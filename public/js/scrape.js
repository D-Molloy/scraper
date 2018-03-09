
$(document).ready(function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).done(function(data) {
    console.log("scrape finished");
   
  });
  //materialize css initialization for the collapsible tables
  $(".collapsible").collapsible();
  //event handler for the "Get the News!" button
  $("button").on("click", function() {
    //empty the results divs after the button is clicked
    $("#times-results").empty();
    $("#ind-results").empty();
    $("#midwest-results").empty();
    $("#rte-results").empty();
    populateDivs();

  }); //end event handler
});

//populateDivs takes the scrape data, builds the divs for each article and adds them to the DOM
function populateDivs(){
  //API call to articles to get all the scraped data
  $.getJSON("/articles", function(data) {
    //show the number of articles found
    $('.article-stats').text(`${data.length} articles found.`)
    //iterate through the article data
    for (var i = 0; i < data.length; i++) {
      //find Irish Times articles and add them to the DOM
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
      }
      //find Irish Independent articles and add them to the DOM 
      else if (data[i].source == "independent") {
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
      } 
      //find RTE articles and add them to the DOM
      else if (data[i].source === "rte") {
        $("#rte-results").append(
          "<a href=" +
            data[i].link +
            ' target="_blank"><div class="results-div hoverable"><p class="head-headline">' +
            data[i].headline +
            "</p></div></a>"
        );
      } 
      //find Midwest articles and add them to the DOM
      else if (data[i].source === "midwest") {
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
};//end populateDivs