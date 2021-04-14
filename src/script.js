document.body.setAttribute('style', 'filter: blur(10px);');
chrome.contextMenus.create({
  type: 'normal',
  title: 'Make Meme with MemeMachine!',
  contexts: ['image'],
  onclick: function (info) {
    var imageURL = info.srcUrl;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, imageURL);
    });
  },
});
chrome.runtime.onMessage.addListener(function (request, sender) {
  var image = new Image();
  image.src = request.imageURL;

  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  canvas.width = request.width;
  canvas.height = request.height;

  var topOffset = 0;

  function drawMemeImage() {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
  }
  function remToPx(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }
  function downloadURI(uri, name) {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
  }

  function loaded() {
    drawMemeImage();
    const fontSize = 42 * (canvas.width / 450);
    context.font = `${fontSize}px Impact`;
    context.textAlign = 'center';
    context.fillStyle = '#fff';
    context.lineWidth = 1.7 * (canvas.width / 450);
    topText = request.topText.toUpperCase();
    bottomText = request.bottomText.toUpperCase();

    context.fillText(topText, canvas.width / 2, topOffset + fontSize + remToPx(1));
    context.strokeText(topText, canvas.width / 2, topOffset + fontSize + remToPx(1));
    context.fillText(bottomText, canvas.width / 2, canvas.height - topOffset - remToPx(3));
    context.strokeText(bottomText, canvas.width / 2, canvas.height - topOffset - remToPx(3));
    downloadURI(canvas.toDataURL(), 'meme.png');
  }

  image.onload = loaded;
});
