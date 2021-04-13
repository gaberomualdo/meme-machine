# MemeMachine

Create, edit, and share memes in the browser by right clicking on an image.

### [Download & Further Information &rarr;](https://xtrp.github.io/MemeMachine/)

## About

MemeMachine is a Chrome Extension that allows you to right click on images on a webpage and design memes from them.

MemeMachine was built by Gabriel Romualdo.

In terms of code, it uses two scripts: a content script and a background script, where the content script is used to create the modal and provide the functionality to design the meme, whereas the background script is used to generate the image and download it. Both take advantage of HTML5 canvas and the features that canvas elements provide. Communication between the background and content scripts is vital for the functionality of this extension.

## File Structure

- `src`: source contents of the extension
- `bin`: contents of the extension to upload to the Chrome Developer dashboard for publishing
- `docs`: source of the MemeMachine website
- `build.sh`: builds the extension from `src/` as a `.zip` file and uploads it to `bin`

## License

The code and the extension itself are licensed under the MIT License; see LICENSE.txt for more information.
