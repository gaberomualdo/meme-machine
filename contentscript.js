var topOffset = 0;

chrome.runtime.onMessage.addListener(function (request, sender) {
  var imageURL = request;
  document.head.innerHTML += `
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  `;
  document.body.innerHTML += `
  <div id="MemeMachineChromeExtensionModal">
    <style>body { overflow: hidden !important; }</style>
    <div class="content">
      <button type="button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M23 20.168l-8.185-8.187 8.185-8.174-2.832-2.807-8.182 8.179-8.176-8.179-2.81 2.81 8.186 8.196-8.186 8.184 2.81 2.81 8.203-8.192 8.18 8.192z"/></svg>
      </button>
      <canvas></canvas>
      <div class="row">
        <div class="inputs">
          <input type="text" placeholder="Top Text..." spellcheck="false">
          <input type="text" placeholder="Bottom Text..." spellcheck="false">
        </div>
        <button><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M17 13h6l-11 11-11-11h6v-13h10z"/></svg></button>
      </div>
    </div>
  </div>
  `;

  var image = new Image();
  image.src = imageURL;

  var canvas = document.querySelector('div#MemeMachineChromeExtensionModal div.content canvas');
  var context = canvas.getContext('2d');

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  function drawMemeImage() {
    var width = image.width * (canvas.height / image.height);
    if (width > canvas.height) {
      var height = image.height * (canvas.width / image.width);
      context.drawImage(image, 0, (canvas.height - height) / 2, canvas.width, height);
      topOffset = (canvas.height - height) / 2;
    } else {
      context.drawImage(image, (canvas.width - width) / 2, 0, width, canvas.height);
      topOffset = 0;
    }
  }
  function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  image.onload = drawMemeImage;

  function remToPx(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }

  function updateText() {
    clearCanvas();
    drawMemeImage();
    context.font = '2.625rem Impact';
    context.textAlign = 'center';
    context.fillStyle = '#fff';
    context.lineWidth = 2;
    context.fillText(
      document.querySelector('div#MemeMachineChromeExtensionModal div.content div.row div.inputs input:first-child').value,
      canvas.width / 2,
      topOffset + remToPx(3)
    );
    context.strokeText(
      document.querySelector('div#MemeMachineChromeExtensionModal div.content div.row div.inputs input:first-child').value,
      canvas.width / 2,
      topOffset + remToPx(3)
    );
    context.fillText(
      document.querySelector('div#MemeMachineChromeExtensionModal div.content div.row div.inputs input:last-child').value,
      canvas.width / 2,
      canvas.height - topOffset - remToPx(1)
    );
    context.strokeText(
      document.querySelector('div#MemeMachineChromeExtensionModal div.content div.row div.inputs input:last-child').value,
      canvas.width / 2,
      canvas.height - topOffset - remToPx(1)
    );
  }

  document.querySelector('div#MemeMachineChromeExtensionModal div.content div.row div.inputs input:first-child').oninput = updateText;
  document.querySelector('div#MemeMachineChromeExtensionModal div.content div.row div.inputs input:last-child').oninput = updateText;

  document.querySelector('div#MemeMachineChromeExtensionModal div.content div.row > button').onclick = function () {
    chrome.runtime.sendMessage({
      imageURL: imageURL,
      width: canvas.width,
      height: canvas.height,
      topText: document.querySelector('div#MemeMachineChromeExtensionModal div.content div.row div.inputs input:first-child').value,
      bottomText: document.querySelector('div#MemeMachineChromeExtensionModal div.content div.row div.inputs input:last-child').value,
    });
  };

  const __closeBtn = document.querySelector('div#MemeMachineChromeExtensionModal div.content > button');
  __closeBtn.addEventListener('click', () => {
    const __modal = __closeBtn.parentElement.parentElement;
    __modal.classList.add('closed');
    setInterval(() => {
      __modal.outerHTML = '';
    }, 250);
  });
});
