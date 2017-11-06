var Uploader = function () {

  function Uploader(options) {
    // _classCallCheck(this, Uploader);

    if (!options.input) {
      throw '[Uploader] Missing input file element.';
    }
    this.fileInput = options.input;
    this.types = options.types || ['gif', 'jpg', 'jpeg', 'png'];
  }
  /**
   * Listen for an image file to be uploaded, then validate it and resolve with the image data.
   */
  Uploader.prototype.listen = function listen(resolve, reject) {
    var _this = this;
    this.fileInput.onchange = function (e) {
      // Do not submit the form
      e.preventDefault();
      // Make sure one file was selected
      if (!_this.fileInput.files || _this.fileInput.files.length !== 1) {
        reject('[Uploader:listen] Select only one file.');
      }
      var file = _this.fileInput.files[0];
      var reader = new FileReader();
      // Make sure the file is of the correct type
      if (!_this.validFileType(file.type)) {
        reject('[Uploader:listen] Invalid file type: ' + file.type);
      } else {
        // Read the image as base64 data
        reader.readAsDataURL(file);
        // When loaded, return the file data
        reader.onload = function (e) {
          return resolve(e.target.result);
        };
      }
    };
  };

  /** @private */

  Uploader.prototype.validFileType = function validFileType(filename) {
    // Get the second part of the MIME type
    var extension = filename.split('/').pop().toLowerCase();
    // See if it is in the array of allowed types
    return this.types.includes(extension);
  };

  return Uploader;
}();

var Cropper = function () {
  function Cropper(options){

    // Check the inputs

    // console.log(this);
    
    // Hold on to the values
    this.imageCanvas = options.canvas;
    this.previewCanvas = options.preview;
    this.c = this.imageCanvas.getContext("2d");

    // Images larger than options.limit are resized
    this.limit = options.limit || 600; // default to 600px
    // Create the cropping square with the handle's size
    this.crop = {
      size: { x: options.size.width, y: options.size.height },
      pos: { x: 0, y: 0 },
      handleSize: 10 //Это точка для тоо чтобы менять размер области для вырезки картинки
    };

    // Set the preview canvas size
    this.previewCanvas.width = options.size.width;
    this.previewCanvas.height = options.size.height;

    // Bind the methods, ready to be added and removed as events
    // this.boundDrag = this.drag.bind(this);
    // this.boundClickStop = this.clickStop.bind(this);
  }

  Cropper.prototype.render = function render() {
    this.c.clearRect(0, 0, this.imageCanvas.width, this.imageCanvas.height);
    this.displayImage();
    // this.preview();
    // this.drawCropWindow();
  };


  Cropper.prototype.setImageSource = function setImageSource(source) {

    var _this2 = this;
    this.image = new Image();
    this.image.src = source;
    this.image.onload = function (e) {
      // Perform an initial render
      _this2.render();
      // Listen for events on the canvas when the image is ready
      // _this2.imageCanvas.onmousedown = _this2.clickStart.bind(_this2);
    };

  };

  Cropper.prototype.displayImage = function displayImage() {
    // Resize the original to the maximum allowed size
    var ratio = this.limit / Math.max(this.image.width, this.image.height);
    this.image.width *= ratio;
    this.image.height *= ratio;
    // Fit the image to the canvas
    this.imageCanvas.width = this.image.width;
    this.imageCanvas.height = this.image.height;
    this.c.drawImage(this.image, 0, 0, this.image.width, this.image.height);
  };

  return Cropper;
}();


var dimensions = { width: 128, height: 128 };

var uploader = new Uploader({
  input: document.querySelector('.js-fileinput'),
  types: ['gif', 'jpg', 'jpeg', 'png']
});

var editor = new Cropper({
    size: dimensions,
    canvas: document.querySelector('.js-editorcanvas'),
    preview: document.querySelector('.js-previewcanvas')
});

if (uploader && editor) {
  // Start the uploader, which will launch the editor
  uploader.listen(editor.setImageSource.bind(editor), function (error) {
    throw error;
  });
}