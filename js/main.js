
function init() {
    var searchBox = document.getElementById('searchBox');
    var searchBtn = document.getElementById('searchBtn');  
    var wikiLinks = document.getElementById('wikiLinks'); 
    var wikiSuggestions = document.getElementById('wikiSuggestions');     
    searchBtn.addEventListener("click", loadArticles);
    searchBox.addEventListener("keyup", autoComplete);
    wikiSuggestions.addEventListener("change", chooseListItem);
    randomLink.addEventListener("click", loadRandomArticle);
}

/* AUTOCOMPLETE */

// get the data for the autocomplete list 
function autoComplete() {
    var searchBox = document.getElementById('searchBox');
    $.ajax({
        url: "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchBox.value + 
    "&suggest=true&limit=10format=json&callback=?",
        dataType: "jsonp"
    }).done(function(data)   {
        var titles = data[1];
        showOptions(titles);
    }); 
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


/* RANDOM ARTICLE */

/* the same effect is achieved by using <a href="https://en.wikipedia.org/wiki/Special:Random" target="_blank"> 
namespace=0 means no main namespace. This namespace typically contains the bulk of the content pages in a wiki.
namespace=1 "Talk" namespace, namespace=2: "User" namespace. There are many more namespaces.
*/

//event handler for 'show random article' button, get data for random article
function loadRandomArticle() {
    var wikiUrl = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnnamespace=0&rnlimit=5";

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp"
    }).done(function(data)   {
    //  console.log(data);
    var title = data.query.random[0].title;    
    showRandomArticle(title);
    // clearTimeout(wikiRequestTimeout);
    });  
}

//show random article in new tab
function showRandomArticle(title) {  
    var regEx = /\s/g;
    var newTitle = title.replace(regEx, "%20");  
    var url = "https://en.wikipedia.org/wiki/" + newTitle;
    var windowObjectReference =  window.open(url); 
}

init();