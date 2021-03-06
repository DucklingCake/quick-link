var studioid = 2955398;
var curators = ["ZLGames", "MegaByteCorporations", "Novakitty", "banana439monkey"];
var count = 0;
function getUnread(page){
  var commentList;
  var topList;
  //Grab comments
  var xml = new XMLHttpRequest();
  xml.onreadystatechange = function(){
    if (xml.readyState = 4){
      var container = document.implementation.createHTMLDocument().documentElement;
      container.innerHTML = xml.responseText;
      commentList = Array.from(container.querySelectorAll('.top-level-reply')).reverse().filter( //Get only comments with links in them
        function(comment){
          var c = comment.querySelector(".comment > .info > .content");
          if (c){
            return c.innerHTML.match(/projects\/[0-9]+/) != null;
          }
        }
      ).map(
        function(comment){
          return comment.querySelector('.replies');
        }
      )

    }
  }
  xml.open("GET", "https://crossorigin.me/https://scratch.mit.edu/site-api/comments/gallery/" + studioid + "/?page=" + page , false);
  xml.send(null);

  //Parse through array
  var tempCount = commentList.length;
  var lastReply = -1;
  for (i = 0; i < commentList.length; i++){
    var replyList = commentList[i].querySelectorAll('.reply > .comment'); //Get all comments
    for (j = 0; j < replyList.length; j++){ //go through replies
      if(curators.indexOf(replyList[j].querySelector(".info > .name > a").innerHTML) != -1){ //pick comment by a curator
        lastReply = i;
        tempCount--;
        break;
        
      }
    }
  }
  if (lastReply == commentList.length-1){
    return false; //All comments on page have been checked, so this should return the first comment of the next page (commentList[0]) if the next page *isn't* done
  } else {
    count += tempCount;
    return commentList[lastReply+1].getAttribute('data-thread'); // last unread link
  }

}

function formatLink(lastCommentId){
  return "https://scratch.mit.edu/studios/" + studioid + "/comments/#comments-" + lastCommentId;
}

function changeLink(link){
  document.getElementById("link").href=link;
}

function changecount(count){
  document.getElementById("projectcount").innerHTML = count + " projects left review or add to the spreadsheet!";

}

function nextLink(){
  var previousLink;
  var link = true;
  var page = 1;
  count = 0;
  while (link){
    previousLink = link;
    link = getUnread(page);
    console.log(page + ' and ' + link);
    page++;
  }
  if (previousLink != true){
    return formatLink(previousLink);
  } else {
    return "https://scratch.mit.edu/studios/" + studioid + "/comments/";
  }
}
