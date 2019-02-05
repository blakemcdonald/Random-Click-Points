/*
Blake McDonald
Lakehead University
Created: 2019-02-05
*/
var vertexShaderCode = [
'attribute vec4 vertPosition;',
'',
'void main() {',
'  gl_Position = vertPosition;',
'  gl_PointSize = 10.0;',
'}'
].join('\n');

var fragmentShaderCode = [
  'precision mediump float;',
  'uniform vec4 fColor;',
  '',
  'void main()',
  '{',
  ' gl_FragColor = fColor;',
  '}'
].join('\n');

var main = function() {
  //Retrieve canvas
  var canvas = document.getElementById('game-surface');

  //Get rendering context for webgl
  var gl = canvas.getContext('webgl');

  //Error Check for getting context
  if(!gl) {
    console.log("WebGL not supported, falling back on experimental-WebGL");
    gl = canvas.getContext('experimental-webgl');
  }
  //I don't know what browser you'd be using to get this error, I don't even known if the alert would go through on such a browser!
  if(!gl) {
    alert('Your browser does not support WebGL');
  }

  //Initialize shaders using 'cuon-utils.js'
  if(!initShaders(gl, vertexShaderCode, fragmentShaderCode)) {
    console.log('Failed to initialize shaders!!');
    return;
  }

  //Get storage location of variables from shaders
  //'gl.program' was created by 'cuon-utils.js' with InitShaders()
  var vertPosition = gl.getAttribLocation(gl.program, 'vertPosition');
  var fColor = gl.getUniformLocation(gl.program, 'fColor');

  //Error Check the above
  if (vertPosition < 0 || fColor < 0) {
    console.log('Failed to get location from shaders');
    return;
  }

  //Set color(RGBA) and clear canvas
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
//--------------------------------------------------------------------//

  //Array for point location coords and colors
  var pLocs = [];
  var pColors = [];

  //Variable for selected color, defaults as Random
  var colorChoice = "Random";

  //Assign function to Clear Canvas button
  document.getElementById("btnClear").onclick = function(){btnClear()};
  //Function to clear the Canvas
  function btnClear(){
    //Arrays need to be emptied too or else it will still display everything in the array (as intended).
    pLocs=[];
    pColors=[];
    gl.clear(gl.COLOR_BUFFER_BIT);
    console.log("Canvas cleared!");
  }

  //Assign function to changing select menu
  document.getElementById("colorChoice").onchange = function(e){updateColorChoice(e)};
  //Function will update variables to ultimately decide which color the next point will be
  function updateColorChoice(e) {
    console.log("Set point color to: " + e.target.options[e.target.selectedIndex].text);
    colorChoice = e.target.options[e.target.selectedIndex].text;
  }

  //Assign function to mouse click
  canvas.onmousedown = function(e){click(e, gl, canvas, colorChoice, vertPosition, fColor);};
  //Function click, itself
  function click(e, gl, canvas, colorChoice, vertPosition, fColor) {
    var x = e.clientX;
    var y = e.clientY;
    var rect = e.target.getBoundingClientRect();

    //Convert default canvas coords to webgl vector coords
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    //Push points into location array
    pLocs.push([x, y]);

    //Push colors to color Array depending on selected color
    switch(colorChoice){
      case "Random":
      pColors.push([Math.random(), Math.random(), Math.random(), 1.0]);
      break;
      case "Red":
      pColors.push([1.0, 0.0, 0.0, 1.0]);
      break;
      case "Green":
      pColors.push([0.0, 1.0, 0.0, 1.0]);
      break;
      case "Blue":
      pColors.push([0.0, 0.0, 1.0, 1.0]);
      break;
      default: //This should be impossible
      pColors.push([Math.random(), Math.random(), Math.random(), 1.0]);
    }

    //Clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    for(var i = 0; i < pLocs.length; i++) {
      //Iterates through all the points to be displayed
      var coords = pLocs[i];
      var colors = pColors[i];

      //Send data to the shaders
      gl.vertexAttrib3f(vertPosition, coords[0], coords[1], 0.0);
      gl.uniform4f(fColor, colors[0], colors[1], colors[2], colors[3]);

      //Draw
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  }
}
