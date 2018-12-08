document.body.setAttribute("style","filter: blur(10px);");
chrome.contextMenus.create({
  type: "normal",
  title: "Make Meme with MemeMachine!",
  contexts: ["image"],
  onclick: function(info){
    var imageURL = info.srcUrl;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, imageURL);
    });
  }
});
chrome.runtime.onMessage.addListener(function(request, sender) {

  var image = new Image();
  image.src = request.imageURL;

  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  canvas.width = request.width;
  canvas.height = request.height;

  function drawMemeImage(){
    var width = image.width * (canvas.height / image.height);
    if(width > canvas.height){
      var height = image.height * (canvas.width / image.width);
      context.drawImage(image, 0, (canvas.height - height) / 2, canvas.width, height);
      topOffset = (canvas.height - height) / 2;
    }else{
      context.drawImage(image, (canvas.width - width) / 2, 0, width, canvas.height);
      topOffset = 0;
    }
  }
  function remToPx(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }
  function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
  }

  function loaded(){
    drawMemeImage();
    context.font = "2.625rem Impact";
    context.textAlign = "center";
    context.fillStyle = "#fff";
    context.lineWidth = 2;
    context.fillText(request.topText, canvas.width / 2, topOffset + remToPx(3));
    context.strokeText(request.topText, canvas.width / 2, topOffset + remToPx(3));
    context.fillText(request.bottomText, canvas.width / 2, canvas.height - topOffset - remToPx(1));
    context.strokeText(request.bottomText, canvas.width / 2, canvas.height - topOffset - remToPx(1));
    downloadURI(canvas.toDataURL(), "meme.png");
  }

  image.onload = loaded;
});
