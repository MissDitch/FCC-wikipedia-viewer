
function loadArticles(e) {
//e.preventDefault(); // needed if button has 'type=submit' attribute. Without it no results are shown
    var searchBox = document.getElementById('searchBox');
    var searchBtn = document.getElementById('searchBtn');  
    var wikiLinks = document.getElementById('wikiLinks');   
    var searchString = searchBox.value;
    console.log(searchString);
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
       wikiLinks.text("failed to get wikipedia resources");
    }, 8000);

     // clear out old data before new request
    searchBox.value = "";

   // 
   /* return false;  use e.preventDefault instead, return false is deprecated? 
   https://css-tricks.com/return-false-and-prevent-default/ 
   http://stackoverflow.com/questions/30473581/when-to-use-preventdefault-vs-return-false
   http://stackoverflow.com/questions/5963669/whats-the-difference-between-event-stoppropagation-and-event-preventdefault
      
   */
}

function autoComplete() {
    var searchBox = document.getElementById('searchBox');
    var searchString = searchBox.value;
    var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchString + 
    "&suggest=true&format=json&callback=?";  

    if (searchString.length > 2) { $.ajax({
        url: wikiUrl,
        dataType: "jsonp"
    }).done(function(data)   {
        showSuggestions(data);
        clearTimeout(wikiRequestTimeout);
    });   
  }
}

function showSuggestions(data) {
    console.log(data);
}

function showArticles(data) {
    console.log(data);
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

 function createListItem(url, title, paragraph) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("target", "_blank");
    var div = document.createElement("div");
    var h3 = document.createElement("h3");
    var text = document.createTextNode(title);
    h3.appendChild(text);
    //  h3.setAttribute("id", "headline");
    var p = document.createElement("p");
    text = document.createTextNode(paragraph);
    p.appendChild(text);
    //  p.setAttribute("id", "paragraph");
    div.appendChild(h3);
    div.appendChild(p);
    a.appendChild(div);
    li.appendChild(a);

    return li;
}


searchBtn.addEventListener("click", loadArticles);
searchBox.addEventListener("keydown", autoComplete);
