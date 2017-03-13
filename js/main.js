
function loadArticles(e) {
//e.preventDefault(); // needed if button has 'type=submit' attribute. Without it no results are shown
    var searchBox = document.getElementById('searchBox');
    var searchBtn = document.getElementById('searchBtn');  
    var wikiLinks = document.getElementById('wikiLinks'); 
    var wikiSuggestions = document.getElementById('wikiSuggestions'); 
    
    wikiSuggestions.innerHTML = "";
    wikiLinks.innerHTML = "";
    
    var searchString = searchBox.value;
  //  console.log(searchString);
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
    $.ajax({
        url: "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchBox.value + 
    "&suggest=true&limit=10format=json&callback=?",
        dataType: "jsonp"
    }).done(function(data)   {
        showOptions(data);
    }); 
}

function showOptions(data) {
    //console.log(data);
    wikiSuggestions.innerHTML = "";
    var titles = data[1];
    var urls = data[3];
    var length = titles.length;
    var count = 1;
    for (var i = 0; i < length; i++) {  
        var title = titles[i];
        var listItem = createListElement(title);
      //  var option = createOptionElement(title, count);            
        wikiSuggestions.appendChild(listItem);
        count++;
    } 
  //  searchBox.value = chooseOption();  

}

function createListElement(title) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.setAttribute("href", "#");
    a.addEventListener("click", chooseListItem);
    //a.setAttribute("target", "_blank");
    
    var text = document.createTextNode(title);
    a.appendChild(text);    
    li.appendChild(a);    
    return li;
}

function createOptionElement(title, count) {
     var option = document.createElement("option");
     option.setAttribute("id", count);
     option.setAttribute("class", "suggestion");
     var text = document.createTextNode(title);
     option.appendChild(text);

    return option;
}
function chooseOption(e) {
    searchBox.value = e.target.value;
}

function chooseListItem(e) {
    searchBox.value = e.target.innerHTML;
    //console.log(searchBox.value);
}

function showArticles(data) {
 //   console.log(data);
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


function loadRandomArticle() {
    var randomLink = document.getElementById("randomLink"); 

    /*  namespace=0 means no main namespace. This namespace typically contains the bulk of the content pages in a wiki.
        namespace=1 "Talk" namespace, namespace=2: "User" namespace
    */
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

function showRandomArticle(title) {  
    var regEx = /\s/g;
    var newTitle = title.replace(regEx, "%20");  
    var url = "https://en.wikipedia.org/wiki/" + newTitle;
    //console.log(url);
    var windowObjectReference =  window.open(url); 
}


searchBtn.addEventListener("click", loadArticles);
searchBox.addEventListener("keyup", autoComplete);
wikiSuggestions.addEventListener("change", chooseOption);
randomLink.addEventListener("click", loadRandomArticle);
