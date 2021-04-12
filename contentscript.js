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
      <div class="meta">
        <h1>MemeMachine</h1>
        <p>design your meme from the image</p>
      </div>
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

  function drawMemeImage() {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    topOffset = 0;
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
    const fontSize = 42 * (canvas.width / 450);
    context.font = `${fontSize}px Impact`;
    context.textAlign = 'center';
    context.fillStyle = '#fff';
    context.lineWidth = 2;
    let topText = document.querySelector('div#MemeMachineChromeExtensionModal div.content div.row div.inputs input:first-child').value;
    let bottomText = document.querySelector('div#MemeMachineChromeExtensionModal div.content div.row div.inputs input:last-child').value;
    topText = topText.toUpperCase();
    bottomText = bottomText.toUpperCase();

    context.fillText(topText, canvas.width / 2, topOffset + fontSize + remToPx(1));
    context.strokeText(topText, canvas.width / 2, topOffset + fontSize + remToPx(1));
    context.fillText(bottomText, canvas.width / 2, canvas.height - topOffset - remToPx(1.5));
    context.strokeText(bottomText, canvas.width / 2, canvas.height - topOffset - remToPx(1.5));
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

  const __modal = document.querySelector('div#MemeMachineChromeExtensionModal');

  const closeModal = () => {
    __modal.classList.add('closed');
    setInterval(() => {
      __modal.outerHTML = '';
    }, 250);
  };

  const __closeBtn = document.querySelector('div#MemeMachineChromeExtensionModal div.content > button');
  __closeBtn.addEventListener('click', () => {
    closeModal();
  });

  __modal.addEventListener('click', ({ target }) => {
    if (target === __modal) {
      // takes advantage of event bubbling and that target references the most specific element
      closeModal();
    }
  });
});
