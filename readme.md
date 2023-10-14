# Single HTML
A NPM package to create a single minified index.html file from all sources in the default index.html file.

# Install
Add npm package to your project
``` 
npm install https://github.com/MarkusTieche/singleHTML.git 
```

# how to use
Minify & inject index.html in main folder to build/index.html
```
npm singlehtml
```

Convert resources to create a single index.html without any dependencies.

Audio:convert to base64 mp3 https://base64.guru/converter/encode/audio/mp3

Font: convert to base64 font and embed in css https://www.base64encode.org/enc/font/
src: url(data:application/x-font-woff;charset=utf-8;base64,d09GRgABAAAAAGy …) format('woff');

Images: convert to base64 image https://www.base64-image.de

3dModels: use gltf in a script tag <script type="application/json" id="Model"></script>