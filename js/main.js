function init() {
    var searchBox = document.getElementById('searchBox');
    var searchBtn = document.getElementById('searchBtn');  
    var wikiLinks = document.getElementById('wikiLinks'); 
    var wikiSuggestions = document.getElementById('wikiSuggestions');     
    searchBtn.addEventListener("click", loadArticles);
    searchBox.addEventListener("keyup", autoComplete);
    wikiSuggestions.addEventListener("change", chooseListItem);
}

/* AUTOCOMPLETE */

// get the data for the autocomplete list 
function autoComplete() {
   // var searchBox = document.getElementById('searchBox');
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
    searchBox.value = e.target.innerHTML;
}


/* ARTICLES LIST */

//get the data for the list of articles
function loadArticles(e) {
    //e.preventDefault(); // needed if button has 'type=submit' attribute. Without it no results are shown
    wikiSuggestions.innerHTML = "";
    wikiLinks.innerHTML = "";    
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
       wikiLinks.innerHTML = "failed to get wikipedia resources";
    }, 8000);

    searchBox.value = "";
}

//show articles list
function showArticles(data) {
    var titles = data[1];
    var paragraphs = data[2];
    var urls = data[3];
    var length = titles.length;
    for (var i = 0; i < length; i++) {  
        var url =  urls[i];
        var title = titles[i];
        var paragraph = paragraphs[i];
        var article = createListItem(url, title, paragraph);            
        wikiLinks.appendChild(article);
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