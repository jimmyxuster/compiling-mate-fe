const three = require('three');
global.THREE = three;

require('three/examples/js/controls/OrbitControls');
require('three/examples/js/loaders/OBJLoader');

require('three/examples/js/postprocessing/EffectComposer');
require('three/examples/js/postprocessing/RenderPass');
require('three/examples/js/postprocessing/ShaderPass');
require('three/examples/js/postprocessing/BloomPass');

require('three/examples/js/shaders/FXAAShader');
require('three/examples/js/shaders/CopyShader');
require('three/examples/js/shaders/ConvolutionShader');

module.exports = global.THREE;