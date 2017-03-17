function init() {
    var searchBox = document.getElementById('searchBox');
    var searchBtn = document.getElementById('searchBtn');  
    var wikiSuggestions = document.getElementById('wikiSuggestions'); 
    var searchLink = document.getElementById("searchLink");
    var formContainer = document.getElementById("form-container");
    
    searchBtn.addEventListener("click", loadArticles);
    searchBox.addEventListener("keyup", autoComplete);
    wikiSuggestions.addEventListener("change", chooseListItem);
    searchLink.addEventListener("click", moveIcon); 
    formContainer.addEventListener("click", moveIcon); 

    searchBox.value = "";
}

/* SHOW INPUT */

function moveIcon() {
    var formContainer = document.getElementById("form-container");
    var movingIcon = document.getElementById("movingIcon");
    var searchBox = document.getElementById('searchBox');
    searchBox.value = "";
    formContainer.classList.remove("invisible");
    /* IE error handling */
    try {
        movingIcon.classList.add("moving");
    }
    catch(err) {
        searchBox.classList.add("expand");
        alert("This app has an animation with the top right looking glass moving down! \n" +
        "If you use another browser you can see it.\n" + 
        "But it's okay, you can go ahead and use this viewer anyway!");
    }    
    searchBox.classList.add("expand");
}

/* AUTOCOMPLETE */

// get the data for the autocomplete list 
function autoComplete() {
    //first clear out results of previous search
    var wikiResults = document.getElementById('wikiResults'); 
    wikiResults.innerHTML = "";
    var searchBox = document.getElementById('searchBox');
    if(searchBox.value != "") {
        $.ajax({
            url: "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchBox.value + 
    "&suggest=true&limit=10format=json&callback=?",
            dataType: "jsonp"
        }).done(function(data)   {
            var titles = data[1];
            showOptions(titles);
        }); 
    }
    else {
        wikiSuggestions.innerHTML = "";
    }    
}

//show autocomplete list
function showOptions(titles) {
    var wikiSuggestions = document.getElementById('wikiSuggestions'); 
    wikiSuggestions.innerHTML = "";    
    var length = titles.length;
    var count = 1;
    for (var i = 0; i < length; i++) {  
        var title = titles[i];
        var listItem = createListElement(title);         
        wikiSuggestions.appendChild(listItem);
        count++;
    }
}

//create individual listitem for autocomplete list
function createListElement(title) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.setAttribute("href", "#");
    a.addEventListener("click", chooseListItem);    
    var text = document.createTextNode(title);
    a.appendChild(text);    
    li.appendChild(a); 

    return li;
}

//put chosen item from autocomplete list in input field
function chooseListItem(e) {
    var searchBox = document.getElementById('searchBox');
    var wikiSuggestions = document.getElementById('wikiSuggestions'); 
    searchBox.value = e.target.innerHTML;
    wikiSuggestions.innerHTML = "";
}


/* ARTICLES LIST */

//get the data for the list of articles
function loadArticles(e) {
    //e.preventDefault(); // needed if button has 'type=submit' attribute. Without it no results are shown
    var results = document.getElementsByClassName("results");
    results[0].classList.remove("active");
    var wikiSuggestions = document.getElementById('wikiSuggestions'); 
    var wikiResults = document.getElementById('wikiResults'); 
    var searchBox = document.getElementById('searchBox');
    wikiSuggestions.innerHTML = "";
    wikiResults.innerHTML = "";    
    var searchString = searchBox.value;
    if (searchString == "") {
        return;
    }
    var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchString + 
    "&format=json&callback=?"; 

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp"
    }).done(function(data)   {
        showArticles(data);
        clearTimeout(wikiRequestTimeout);
    });  

    var wikiRequestTimeout = setTimeout(function(){
       wikiResults.innerHTML = "failed to get wikipedia resources";
    }, 8000);

    searchBox.value = "";
}

//show articles list
function showArticles(data) {
    var results = document.getElementsByClassName("results");
    results[0].classList.add("active");
    var titles = data[1];
    var paragraphs = data[2];
    var urls = data[3];
    var length = titles.length;
    for (var i = 0; i < length; i++) {  
        var url =  urls[i];
        var title = titles[i];
        var paragraph = paragraphs[i];
        var article = createListItem(url, title, paragraph);            
        wikiResults.appendChild(article);
    }     
}

//create individual listitem for articles list
 function createListItem(url, title, paragraph) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("target", "_blank");
    var div = document.createElement("div");
    var h3 = document.createElement("h3");
    var text = document.createTextNode(title);
    h3.appendChild(text);
    var p = document.createElement("p");
    text = document.createTextNode(paragraph);
    p.appendChild(text);
    div.appendChild(h3);
    div.appendChild(p);
    a.appendChild(div);
    li.appendChild(a);

    return li;
}

init();