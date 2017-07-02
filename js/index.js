var gsroffset = 0;
var inputVal;
$(document).ready(function() {

	//If enter key pressed
	$(".input").keyup(function(event){
	    if(event.keyCode == 13){
	    	console.log("Enter pressed");
			$(".result-page").html(" ");
	        search();
	    }
	});

   $(".submit-search").on("click", search);

   // Fetch more results if reached bottom of page
    $(window).scroll(function() {
    	if($(window).scrollTop() + $(window).height() == $(document).height()) {
       		get10Entries();
    	}
	});

});

function search(entry){
	inputVal = $('#input1').val();
	if(inputVal == null) inputVal = $('#input2').val();
	gsroffset = 0;
	console.log("Search request");

	//Shift to result page
	$("body").css("overflow", "visible");
	$(".main-page").remove();
	$(".input:focus").css("width", "30vw");
	$(".title").css("font-size", "150%");
	$(".result-header").css("visibility", "visible");
	window.scrollTo(0, 0);

	get10Entries();
}

function get10Entries(){

	//get Wikipedia Data
	var api1 = 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&gsrinfo&prop=pageimages|extracts&pithumbsize=200&pilimit=max&exintro&explaintext=1&exlimit=max&exchars=100&gsroffset=';

	var api2 = '&gsrsearch=';
    var cb = '&callback=?';
    var page = 'https://en.wikipedia.org/?curid=';
    var nEntries = 10; // default value
    var requestURL = api1 + gsroffset + api2+ inputVal + cb;
    console.log(requestURL);

    $.getJSON(requestURL, function(result){

    	var container = document.getElementById("result-page");
    	if(!result.hasOwnProperty("query") && gsroffset <= 10){
    		$(".result-page").css("visibility", "hidden");
    		$(".no-results").html('<h3>No search results found for "' + inputVal + '".</h3>');
    		$(".no-results").css("visibility", "visible");
    		$("body").css("overflow", "hidden");
    	} else {
    		console.log("new result page");
	    	$(".no-results").css("visibility", "hidden");
	    	$(".result-page").css("visibility", "visible");
	    	console.log(result);
	    	nEntries = Object.keys(result.query.pages).length;
	    	pages = result.query.pages;


	    	for(var k in pages) {
	    		if(k == nEntries) break;

	    		var description = " ";
	    		//default image
	    		var imageURL = "https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../assets/preview/2013/png/iconmonstr-note-17.png&r=237&g=237&b=237";

	    		var imageProp;
	    		if(pages[k].hasOwnProperty('thumbnail')) {
	    			imageURL = pages[k].thumbnail.source;
	    			var height = pages[k].thumbnail.height;
	    			var width = pages[k].thumbnail.width;
	    			if(height < width) imageProp = 'height = "100%"';
	    				else imageProp = 'width = "100%"';
	    		}
	    		else{
	    			imageProp = 'height = "40%"';
	    		}

	    		if(pages[k].hasOwnProperty('extract'))
	    			description = pages[k].extract;
				container.innerHTML += '<a target = "_blank" href="https://en.wikipedia.org/?curid=' + pages[k].pageid + '" class = "entry-box"><div class = "entry-image-container"><img class = "entry-img"' + imageProp + ' src = "' + imageURL + '"></div><div class = "entry-text"><h3 class = "entry-title">' +pages[k].title + '</h3><br><p class = "entry-desc">' + description + '</p></div></a>';
			}
    	}

    });
    gsroffset += 10;
}



