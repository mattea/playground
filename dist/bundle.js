(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
function shuffle(array) {
    var counter = array.length;
    var temp = 0;
    var index = 0;
    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
}
exports.shuffle = shuffle;
function classifyTwoGaussData(numSamples, noise) {
    var points = [];
    var varianceScale = d3.scale.linear().domain([0, .5]).range([0.5, 4]);
    var variance = varianceScale(noise);
    function genGauss(cx, cy, label) {
        for (var i = 0; i < numSamples / 2; i++) {
            var x = normalRandom(cx, variance);
            var y = normalRandom(cy, variance);
            points.push({ x: x, y: y, label: label });
        }
    }
    genGauss(2, 2, 1);
    genGauss(-2, -2, -1);
    return points;
}
exports.classifyTwoGaussData = classifyTwoGaussData;
function regressPlane(numSamples, noise) {
    var radius = 6;
    var labelScale = d3.scale.linear()
        .domain([-10, 10])
        .range([-1, 1]);
    var getLabel = function (x, y) { return labelScale(x + y); };
    var points = [];
    for (var i = 0; i < numSamples; i++) {
        var x = randUniform(-radius, radius);
        var y = randUniform(-radius, radius);
        var noiseX = randUniform(-radius, radius) * noise;
        var noiseY = randUniform(-radius, radius) * noise;
        var label = getLabel(x + noiseX, y + noiseY);
        points.push({ x: x, y: y, label: label });
    }
    return points;
}
exports.regressPlane = regressPlane;
function regressGaussian(numSamples, noise) {
    var points = [];
    var labelScale = d3.scale.linear()
        .domain([0, 2])
        .range([1, 0])
        .clamp(true);
    var gaussians = [
        [-4, 2.5, 1],
        [0, 2.5, -1],
        [4, 2.5, 1],
        [-4, -2.5, -1],
        [0, -2.5, 1],
        [4, -2.5, -1]
    ];
    function getLabel(x, y) {
        var label = 0;
        gaussians.forEach(function (_a) {
            var cx = _a[0], cy = _a[1], sign = _a[2];
            var newLabel = sign * labelScale(dist({ x: x, y: y }, { x: cx, y: cy }));
            if (Math.abs(newLabel) > Math.abs(label)) {
                label = newLabel;
            }
        });
        return label;
    }
    var radius = 6;
    for (var i = 0; i < numSamples; i++) {
        var x = randUniform(-radius, radius);
        var y = randUniform(-radius, radius);
        var noiseX = randUniform(-radius, radius) * noise;
        var noiseY = randUniform(-radius, radius) * noise;
        var label = getLabel(x + noiseX, y + noiseY);
        points.push({ x: x, y: y, label: label });
    }
    ;
    return points;
}
exports.regressGaussian = regressGaussian;
function classifySpiralData(numSamples, noise) {
    var points = [];
    var n = numSamples / 2;
    function genSpiral(deltaT, label) {
        for (var i = 0; i < n; i++) {
            var r = i / n * 5;
            var t = 1.75 * i / n * 2 * Math.PI + deltaT;
            var x = r * Math.sin(t) + randUniform(-1, 1) * noise;
            var y = r * Math.cos(t) + randUniform(-1, 1) * noise;
            points.push({ x: x, y: y, label: label });
        }
    }
    genSpiral(0, 1);
    genSpiral(Math.PI, -1);
    return points;
}
exports.classifySpiralData = classifySpiralData;
function classifyCircleData(numSamples, noise) {
    var points = [];
    var radius = 5;
    function getCircleLabel(p, center) {
        return (dist(p, center) < (radius * 0.5)) ? 1 : -1;
    }
    for (var i = 0; i < numSamples / 2; i++) {
        var r = randUniform(0, radius * 0.5);
        var angle = randUniform(0, 2 * Math.PI);
        var x = r * Math.sin(angle);
        var y = r * Math.cos(angle);
        var noiseX = randUniform(-radius, radius) * noise;
        var noiseY = randUniform(-radius, radius) * noise;
        var label = getCircleLabel({ x: x + noiseX, y: y + noiseY }, { x: 0, y: 0 });
        points.push({ x: x, y: y, label: label });
    }
    for (var i = 0; i < numSamples / 2; i++) {
        var r = randUniform(radius * 0.7, radius);
        var angle = randUniform(0, 2 * Math.PI);
        var x = r * Math.sin(angle);
        var y = r * Math.cos(angle);
        var noiseX = randUniform(-radius, radius) * noise;
        var noiseY = randUniform(-radius, radius) * noise;
        var label = getCircleLabel({ x: x + noiseX, y: y + noiseY }, { x: 0, y: 0 });
        points.push({ x: x, y: y, label: label });
    }
    return points;
}
exports.classifyCircleData = classifyCircleData;
function classifyXORData(numSamples, noise) {
    function getXORLabel(p) { return p.x * p.y >= 0 ? 1 : -1; }
    var points = [];
    for (var i = 0; i < numSamples; i++) {
        var x = randUniform(-5, 5);
        var padding = 0.3;
        x += x > 0 ? padding : -padding;
        var y = randUniform(-5, 5);
        y += y > 0 ? padding : -padding;
        var noiseX = randUniform(-5, 5) * noise;
        var noiseY = randUniform(-5, 5) * noise;
        var label = getXORLabel({ x: x + noiseX, y: y + noiseY });
        points.push({ x: x, y: y, label: label });
    }
    return points;
}
exports.classifyXORData = classifyXORData;
function classifyUserData(numSamples, noise) {
    return classifyTwoGaussData(numSamples, noise);
}
exports.classifyUserData = classifyUserData;
function randUniform(a, b) {
    return Math.random() * (b - a) + a;
}
function normalRandom(mean, variance) {
    if (mean === void 0) { mean = 0; }
    if (variance === void 0) { variance = 1; }
    var v1, v2, s;
    do {
        v1 = 2 * Math.random() - 1;
        v2 = 2 * Math.random() - 1;
        s = v1 * v1 + v2 * v2;
    } while (s > 1);
    var result = Math.sqrt(-2 * Math.log(s) / s) * v1;
    return mean + Math.sqrt(variance) * result;
}
function dist(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

},{}],2:[function(require,module,exports){
"use strict";
var NUM_SHADES = 30;
var HeatMap = (function () {
    function HeatMap(width, numSamples, xDomain, yDomain, container, userSettings) {
        this.settings = {
            showAxes: false,
            noSvg: false
        };
        this.numSamples = numSamples;
        var height = width;
        var padding = userSettings.showAxes ? 20 : 0;
        if (userSettings != null) {
            for (var prop in userSettings) {
                this.settings[prop] = userSettings[prop];
            }
        }
        this.xScale = d3.scale.linear()
            .domain(xDomain)
            .range([0, width - 2 * padding]);
        this.yScale = d3.scale.linear()
            .domain(yDomain)
            .range([height - 2 * padding, 0]);
        var tmpScale = d3.scale.linear()
            .domain([0, .5, 1])
            .range(["#f59322", "#e8eaeb", "#0877bd"])
            .clamp(true);
        var colors = d3.range(0, 1 + 1E-9, 1 / NUM_SHADES).map(function (a) {
            return tmpScale(a);
        });
        this.color = d3.scale.quantize()
            .domain([-1, 1])
            .range(colors);
        container = container.append("div")
            .style({
            width: width + "px",
            height: height + "px",
            position: "relative",
            top: "-" + padding + "px",
            left: "-" + padding + "px"
        });
        this.canvas = container.append("canvas")
            .attr("width", numSamples)
            .attr("height", numSamples)
            .style("width", (width - 2 * padding) + "px")
            .style("height", (height - 2 * padding) + "px")
            .style("position", "absolute")
            .style("top", padding + "px")
            .style("left", padding + "px");
        if (!this.settings.noSvg) {
            this.svg = container.append("svg").attr({
                "width": width,
                "height": height
            }).style({
                "position": "absolute",
                "left": "0",
                "top": "0"
            }).append("g")
                .attr("transform", "translate(" + padding + "," + padding + ")");
            this.svg.append("g").attr("class", "train");
            this.svg.append("g").attr("class", "test");
        }
        if (this.settings.showAxes) {
            var xAxis = d3.svg.axis()
                .scale(this.xScale)
                .orient("bottom");
            var yAxis = d3.svg.axis()
                .scale(this.yScale)
                .orient("right");
            this.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (height - 2 * padding) + ")")
                .call(xAxis);
            this.svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + (width - 2 * padding) + ",0)")
                .call(yAxis);
        }
    }
    HeatMap.prototype.updateTestPoints = function (points) {
        if (this.settings.noSvg) {
            throw Error("Can't add points since noSvg=true");
        }
        this.updateCircles(this.svg.select("g.test"), points);
    };
    HeatMap.prototype.updatePoints = function (points) {
        if (this.settings.noSvg) {
            throw Error("Can't add points since noSvg=true");
        }
        this.updateCircles(this.svg.select("g.train"), points);
    };
    HeatMap.prototype.updateBackground = function (data, discretize) {
        var dx = data[0].length;
        var dy = data.length;
        if (dx !== this.numSamples || dy !== this.numSamples) {
            throw new Error("The provided data matrix must be of size " +
                "numSamples X numSamples");
        }
        var context = this.canvas.node().getContext("2d");
        var image = context.createImageData(dx, dy);
        for (var y = 0, p = -1; y < dy; ++y) {
            for (var x = 0; x < dx; ++x) {
                var value = data[x][y];
                if (discretize) {
                    value = (value >= 0 ? 1 : -1);
                }
                var c = d3.rgb(this.color(value));
                image.data[++p] = c.r;
                image.data[++p] = c.g;
                image.data[++p] = c.b;
                image.data[++p] = 160;
            }
        }
        context.putImageData(image, 0, 0);
    };
    HeatMap.prototype.updateCircles = function (container, points) {
        var _this = this;
        var xDomain = this.xScale.domain();
        var yDomain = this.yScale.domain();
        points = points.filter(function (p) {
            return p.x >= xDomain[0] && p.x <= xDomain[1]
                && p.y >= yDomain[0] && p.y <= yDomain[1];
        });
        var selection = container.selectAll("circle").data(points);
        selection.enter().append("circle").attr("r", 3);
        selection
            .attr({
            cx: function (d) { return _this.xScale(d.x); },
            cy: function (d) { return _this.yScale(d.y); }
        })
            .style("fill", function (d) { return _this.color(d.label); });
        selection.exit().remove();
    };
    return HeatMap;
}());
exports.HeatMap = HeatMap;
function reduceMatrix(matrix, factor) {
    if (matrix.length !== matrix[0].length) {
        throw new Error("The provided matrix must be a square matrix");
    }
    if (matrix.length % factor !== 0) {
        throw new Error("The width/height of the matrix must be divisible by " +
            "the reduction factor");
    }
    var result = new Array(matrix.length / factor);
    for (var i = 0; i < matrix.length; i += factor) {
        result[i / factor] = new Array(matrix.length / factor);
        for (var j = 0; j < matrix.length; j += factor) {
            var avg = 0;
            for (var k = 0; k < factor; k++) {
                for (var l = 0; l < factor; l++) {
                    avg += matrix[i + k][j + l];
                }
            }
            avg /= (factor * factor);
            result[i / factor][j / factor] = avg;
        }
    }
    return result;
}
exports.reduceMatrix = reduceMatrix;

},{}],3:[function(require,module,exports){
"use strict";
var AppendingLineChart = (function () {
    function AppendingLineChart(container, lineColors) {
        this.data = [];
        this.minY = Number.MAX_VALUE;
        this.maxY = Number.MIN_VALUE;
        this.lineColors = lineColors;
        this.numLines = lineColors.length;
        var node = container.node();
        var totalWidth = node.offsetWidth;
        var totalHeight = node.offsetHeight;
        var margin = { top: 2, right: 0, bottom: 2, left: 2 };
        var width = totalWidth - margin.left - margin.right;
        var height = totalHeight - margin.top - margin.bottom;
        this.xScale = d3.scale.linear()
            .domain([0, 0])
            .range([0, width]);
        this.yScale = d3.scale.linear()
            .domain([0, 0])
            .range([height, 0]);
        this.svg = container.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        this.paths = new Array(this.numLines);
        for (var i = 0; i < this.numLines; i++) {
            this.paths[i] = this.svg.append("path")
                .attr("class", "line")
                .style({
                "fill": "none",
                "stroke": lineColors[i],
                "stroke-width": "1.5px"
            });
        }
    }
    AppendingLineChart.prototype.reset = function () {
        this.data = [];
        this.redraw();
        this.minY = Number.MAX_VALUE;
        this.maxY = Number.MIN_VALUE;
    };
    AppendingLineChart.prototype.addDataPoint = function (dataPoint) {
        var _this = this;
        if (dataPoint.length !== this.numLines) {
            throw Error("Length of dataPoint must equal number of lines");
        }
        dataPoint.forEach(function (y) {
            _this.minY = Math.min(_this.minY, y);
            _this.maxY = Math.max(_this.maxY, y);
        });
        this.data.push({ x: this.data.length + 1, y: dataPoint });
        this.redraw();
    };
    AppendingLineChart.prototype.redraw = function () {
        var _this = this;
        this.xScale.domain([1, this.data.length]);
        this.yScale.domain([this.minY, this.maxY]);
        var getPathMap = function (lineIndex) {
            return d3.svg.line()
                .x(function (d) { return _this.xScale(d.x); })
                .y(function (d) { return _this.yScale(d.y[lineIndex]); });
        };
        for (var i = 0; i < this.numLines; i++) {
            this.paths[i].datum(this.data).attr("d", getPathMap(i));
        }
    };
    return AppendingLineChart;
}());
exports.AppendingLineChart = AppendingLineChart;

},{}],4:[function(require,module,exports){
"use strict";
var Node = (function () {
    function Node(id, activation, initZero) {
        this.inputLinks = [];
        this.bias = 0.1;
        this.outputs = [];
        this.outputDer = 0;
        this.inputDer = 0;
        this.accInputDer = 0;
        this.numAccumulatedDers = 0;
        this.id = id;
        this.activation = activation;
        if (initZero) {
            this.bias = 0;
        }
    }
    Node.prototype.updateOutput = function () {
        this.totalInput = this.bias;
        for (var j = 0; j < this.inputLinks.length; j++) {
            var link = this.inputLinks[j];
            this.totalInput += link.weight * link.source.output;
        }
        this.output = this.activation.output(this.totalInput);
        return this.output;
    };
    return Node;
}());
exports.Node = Node;
var Errors = (function () {
    function Errors() {
    }
    Errors.SQUARE = {
        error: function (output, target) {
            return 0.5 * Math.pow(output - target, 2);
        },
        der: function (output, target) { return output - target; }
    };
    return Errors;
}());
exports.Errors = Errors;
Math.tanh = Math.tanh || function (x) {
    if (x === Infinity) {
        return 1;
    }
    else if (x === -Infinity) {
        return -1;
    }
    else {
        var e2x = Math.exp(2 * x);
        return (e2x - 1) / (e2x + 1);
    }
};
var Activations = (function () {
    function Activations() {
    }
    Activations.TANH = {
        output: function (x) { return Math.tanh(x); },
        der: function (x) {
            var output = Activations.TANH.output(x);
            return 1 - output * output;
        }
    };
    Activations.RELU = {
        output: function (x) { return Math.max(0, x); },
        der: function (x) { return x <= 0 ? 0 : 1; }
    };
    Activations.SIGMOID = {
        output: function (x) { return 1 / (1 + Math.exp(-x)); },
        der: function (x) {
            var output = Activations.SIGMOID.output(x);
            return output * (1 - output);
        }
    };
    Activations.LINEAR = {
        output: function (x) { return x; },
        der: function (x) { return 1; }
    };
    return Activations;
}());
exports.Activations = Activations;
var RegularizationFunction = (function () {
    function RegularizationFunction() {
    }
    RegularizationFunction.L1 = {
        output: function (w) { return Math.abs(w); },
        der: function (w) { return w < 0 ? -1 : 1; }
    };
    RegularizationFunction.L2 = {
        output: function (w) { return 0.5 * w * w; },
        der: function (w) { return w; }
    };
    return RegularizationFunction;
}());
exports.RegularizationFunction = RegularizationFunction;
var Link = (function () {
    function Link(source, dest, regularization, initZero) {
        this.weight = Math.random() - 0.5;
        this.errorDer = 0;
        this.accErrorDer = 0;
        this.numAccumulatedDers = 0;
        this.id = source.id + "-" + dest.id;
        this.source = source;
        this.dest = dest;
        this.regularization = regularization;
        if (initZero) {
            this.weight = 0;
        }
    }
    return Link;
}());
exports.Link = Link;
function buildNetwork(networkShape, activation, outputActivation, regularization, inputIds, initZero) {
    var numLayers = networkShape.length;
    var id = 1;
    var network = [];
    for (var layerIdx = 0; layerIdx < numLayers; layerIdx++) {
        var isOutputLayer = layerIdx === numLayers - 1;
        var isInputLayer = layerIdx === 0;
        var currentLayer = [];
        network.push(currentLayer);
        var numNodes = networkShape[layerIdx];
        for (var i = 0; i < numNodes; i++) {
            var nodeId = id.toString();
            if (isInputLayer) {
                nodeId = inputIds[i];
            }
            else {
                id++;
            }
            var node = new Node(nodeId, isOutputLayer ? outputActivation : activation, initZero);
            currentLayer.push(node);
            if (layerIdx >= 1) {
                for (var j = 0; j < network[layerIdx - 1].length; j++) {
                    var prevNode = network[layerIdx - 1][j];
                    var link = new Link(prevNode, node, regularization, initZero);
                    prevNode.outputs.push(link);
                    node.inputLinks.push(link);
                }
            }
        }
    }
    return network;
}
exports.buildNetwork = buildNetwork;
function forwardProp(network, inputs) {
    var inputLayer = network[0];
    if (inputs.length !== inputLayer.length) {
        throw new Error("The number of inputs must match the number of nodes in" +
            " the input layer");
    }
    for (var i = 0; i < inputLayer.length; i++) {
        var node = inputLayer[i];
        node.output = inputs[i];
    }
    for (var layerIdx = 1; layerIdx < network.length; layerIdx++) {
        var currentLayer = network[layerIdx];
        for (var i = 0; i < currentLayer.length; i++) {
            var node = currentLayer[i];
            node.updateOutput();
        }
    }
    return network[network.length - 1][0].output;
}
exports.forwardProp = forwardProp;
function backProp(network, target, errorFunc) {
    var outputNode = network[network.length - 1][0];
    outputNode.outputDer = errorFunc.der(outputNode.output, target);
    for (var layerIdx = network.length - 1; layerIdx >= 1; layerIdx--) {
        var currentLayer = network[layerIdx];
        for (var i = 0; i < currentLayer.length; i++) {
            var node = currentLayer[i];
            node.inputDer = node.outputDer * node.activation.der(node.totalInput);
            node.accInputDer += node.inputDer;
            node.numAccumulatedDers++;
        }
        for (var i = 0; i < currentLayer.length; i++) {
            var node = currentLayer[i];
            for (var j = 0; j < node.inputLinks.length; j++) {
                var link = node.inputLinks[j];
                link.errorDer = node.inputDer * link.source.output;
                link.accErrorDer += link.errorDer;
                link.numAccumulatedDers++;
            }
        }
        if (layerIdx === 1) {
            continue;
        }
        var prevLayer = network[layerIdx - 1];
        for (var i = 0; i < prevLayer.length; i++) {
            var node = prevLayer[i];
            node.outputDer = 0;
            for (var j = 0; j < node.outputs.length; j++) {
                var output = node.outputs[j];
                node.outputDer += output.weight * output.dest.inputDer;
            }
        }
    }
}
exports.backProp = backProp;
function updateWeights(network, learningRate, regularizationRate) {
    for (var layerIdx = 1; layerIdx < network.length; layerIdx++) {
        var currentLayer = network[layerIdx];
        for (var i = 0; i < currentLayer.length; i++) {
            var node = currentLayer[i];
            if (node.numAccumulatedDers > 0) {
                node.bias -= learningRate * node.accInputDer / node.numAccumulatedDers;
                node.accInputDer = 0;
                node.numAccumulatedDers = 0;
            }
            for (var j = 0; j < node.inputLinks.length; j++) {
                var link = node.inputLinks[j];
                var regulDer = link.regularization ?
                    link.regularization.der(link.weight) : 0;
                if (link.numAccumulatedDers > 0) {
                    link.weight -= (learningRate / link.numAccumulatedDers) *
                        (link.accErrorDer + regularizationRate * regulDer);
                    link.accErrorDer = 0;
                    link.numAccumulatedDers = 0;
                }
            }
        }
    }
}
exports.updateWeights = updateWeights;
function forEachNode(network, ignoreInputs, accessor) {
    for (var layerIdx = ignoreInputs ? 1 : 0; layerIdx < network.length; layerIdx++) {
        var currentLayer = network[layerIdx];
        for (var i = 0; i < currentLayer.length; i++) {
            var node = currentLayer[i];
            accessor(node);
        }
    }
}
exports.forEachNode = forEachNode;
function getOutputNode(network) {
    return network[network.length - 1][0];
}
exports.getOutputNode = getOutputNode;

},{}],5:[function(require,module,exports){
"use strict";
var nn = require("./nn");
var heatmap_1 = require("./heatmap");
var state_1 = require("./state");
var dataset_1 = require("./dataset");
var linechart_1 = require("./linechart");
var mainWidth;
d3.select(".more button").on("click", function () {
    var position = 800;
    d3.transition()
        .duration(1000)
        .tween("scroll", scrollTween(position));
});
function scrollTween(offset) {
    return function () {
        var i = d3.interpolateNumber(window.pageYOffset ||
            document.documentElement.scrollTop, offset);
        return function (t) { scrollTo(0, i(t)); };
    };
}
var RECT_SIZE = 30;
var BIAS_SIZE = 5;
var NUM_SAMPLES_CLASSIFY = 500;
var NUM_SAMPLES_REGRESS = 1200;
var DENSITY = 100;
var HoverType;
(function (HoverType) {
    HoverType[HoverType["BIAS"] = 0] = "BIAS";
    HoverType[HoverType["WEIGHT"] = 1] = "WEIGHT";
})(HoverType || (HoverType = {}));
var INPUTS = {
    "x": { f: function (x, y) { return x; }, label: "X_1" },
    "y": { f: function (x, y) { return y; }, label: "X_2" },
    "xSquared": { f: function (x, y) { return x * x; }, label: "X_1^2" },
    "ySquared": { f: function (x, y) { return y * y; }, label: "X_2^2" },
    "xTimesY": { f: function (x, y) { return x * y; }, label: "X_1X_2" },
    "sinX": { f: function (x, y) { return Math.sin(x); }, label: "sin(X_1)" },
    "sinY": { f: function (x, y) { return Math.sin(y); }, label: "sin(X_2)" }
};
var HIDABLE_CONTROLS = [
    ["Show test data", "showTestData"],
    ["Discretize output", "discretize"],
    ["Play button", "playButton"],
    ["Step button", "stepButton"],
    ["Reset button", "resetButton"],
    ["Learning rate", "learningRate"],
    ["Activation", "activation"],
    ["Regularization", "regularization"],
    ["Regularization rate", "regularizationRate"],
    ["Problem type", "problem"],
    ["Which dataset", "dataset"],
    ["Ratio train data", "percTrainData"],
    ["Noise level", "noise"],
    ["Batch size", "batchSize"],
    ["# of hidden layers", "numHiddenLayers"],
];
var Player = (function () {
    function Player() {
        this.timerIndex = 0;
        this.isPlaying = false;
        this.callback = null;
    }
    Player.prototype.playOrPause = function () {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.pause();
        }
        else {
            this.isPlaying = true;
            this.play();
        }
    };
    Player.prototype.onPlayPause = function (callback) {
        this.callback = callback;
    };
    Player.prototype.play = function () {
        this.pause();
        this.isPlaying = true;
        if (this.callback) {
            this.callback(this.isPlaying);
        }
        this.start(this.timerIndex);
    };
    Player.prototype.pause = function () {
        this.timerIndex++;
        this.isPlaying = false;
        if (this.callback) {
            this.callback(this.isPlaying);
        }
    };
    Player.prototype.start = function (localTimerIndex) {
        var _this = this;
        d3.timer(function () {
            if (localTimerIndex < _this.timerIndex) {
                return true;
            }
            oneStep();
            return false;
        }, 0);
    };
    return Player;
}());
var state = state_1.State.deserializeState();
state.getHiddenProps().forEach(function (prop) {
    if (prop in INPUTS) {
        delete INPUTS[prop];
    }
});
var boundary = {};
var selectedNodeId = null;
var xDomain = [-6, 6];
var yDomain = [-6, 6];
var heatMap = new heatmap_1.HeatMap(300, DENSITY, xDomain, yDomain, d3.select("#heatmap"), { showAxes: true });
var linkWidthScale = d3.scale.linear()
    .domain([0, 5])
    .range([1, 10])
    .clamp(true);
var colorScale = d3.scale.linear()
    .domain([-1, 0, 1])
    .range(["#f59322", "#e8eaeb", "#0877bd"])
    .clamp(true);
var iter = 0;
var trainData = [];
var testData = [];
var network = null;
var lossTrain = 0;
var lossTest = 0;
var player = new Player();
var lineChart = new linechart_1.AppendingLineChart(d3.select("#linechart"), ["#777", "black"]);
function makeGUI() {
    d3.select("#reset-button").on("click", function () {
        reset();
        d3.select("#play-pause-button");
    });
    d3.select("#play-pause-button").on("click", function () {
        player.playOrPause();
    });
    player.onPlayPause(function (isPlaying) {
        d3.select("#play-pause-button").classed("playing", isPlaying);
    });
    d3.select("#next-step-button").on("click", function () {
        player.pause();
        oneStep();
    });
    d3.select("#data-regen-button").on("click", function () {
        generateData();
    });
    d3.select("#data-load-button").on("change", handleLoadData, false);
    d3.select("#data-column").on("dragover", handleDragOver, false);
    d3.select("#data-column").on("drop", handleLoadData, false);
    var dataThumbnails = d3.selectAll("canvas[data-dataset]");
    dataThumbnails.on("click", function () {
        var newDataset = state_1.datasets[this.dataset.dataset];
        if (newDataset === state.dataset) {
            return;
        }
        state.dataset = newDataset;
        dataThumbnails.classed("selected", false);
        d3.select(this).classed("selected", true);
        generateData();
        reset();
    });
    var datasetKey = state_1.getKeyFromValue(state_1.datasets, state.dataset);
    d3.select("canvas[data-dataset=" + datasetKey + "]")
        .classed("selected", true);
    var regDataThumbnails = d3.selectAll("canvas[data-regDataset]");
    regDataThumbnails.on("click", function () {
        var newDataset = state_1.regDatasets[this.dataset.regdataset];
        if (newDataset === state.regDataset) {
            return;
        }
        state.regDataset = newDataset;
        regDataThumbnails.classed("selected", false);
        d3.select(this).classed("selected", true);
        generateData();
        reset();
    });
    var regDatasetKey = state_1.getKeyFromValue(state_1.regDatasets, state.regDataset);
    d3.select("canvas[data-regDataset=" + regDatasetKey + "]")
        .classed("selected", true);
    d3.select("#add-layers").on("click", function () {
        if (state.numHiddenLayers >= 6) {
            return;
        }
        state.networkShape[state.numHiddenLayers] = 2;
        state.numHiddenLayers++;
        reset();
    });
    d3.select("#remove-layers").on("click", function () {
        if (state.numHiddenLayers <= 0) {
            return;
        }
        state.numHiddenLayers--;
        state.networkShape.splice(state.numHiddenLayers);
        reset();
    });
    var showTestData = d3.select("#show-test-data").on("change", function () {
        state.showTestData = this.checked;
        state.serialize();
        heatMap.updateTestPoints(state.showTestData ? testData : []);
    });
    showTestData.property("checked", state.showTestData);
    var discretize = d3.select("#discretize").on("change", function () {
        state.discretize = this.checked;
        state.serialize();
        updateUI();
    });
    discretize.property("checked", state.discretize);
    var percTrain = d3.select("#percTrainData").on("input", function () {
        state.percTrainData = this.value;
        d3.select("label[for='percTrainData'] .value").text(this.value);
        generateData();
        reset();
    });
    percTrain.property("value", state.percTrainData);
    d3.select("label[for='percTrainData'] .value").text(state.percTrainData);
    var noise = d3.select("#noise").on("input", function () {
        state.noise = this.value;
        d3.select("label[for='noise'] .value").text(this.value);
        generateData();
        reset();
    });
    noise.property("value", state.noise);
    d3.select("label[for='noise'] .value").text(state.noise);
    var batchSize = d3.select("#batchSize").on("input", function () {
        state.batchSize = this.value;
        d3.select("label[for='batchSize'] .value").text(this.value);
        reset();
    });
    batchSize.property("value", state.batchSize);
    d3.select("label[for='batchSize'] .value").text(state.batchSize);
    var activationDropdown = d3.select("#activations").on("change", function () {
        state.activation = state_1.activations[this.value];
        reset();
    });
    activationDropdown.property("value", state_1.getKeyFromValue(state_1.activations, state.activation));
    var learningRate = d3.select("#learningRate").on("change", function () {
        state.learningRate = +this.value;
    });
    learningRate.property("value", state.learningRate);
    var regularDropdown = d3.select("#regularizations").on("change", function () {
        state.regularization = state_1.regularizations[this.value];
        reset();
    });
    regularDropdown.property("value", state_1.getKeyFromValue(state_1.regularizations, state.regularization));
    var regularRate = d3.select("#regularRate").on("change", function () {
        state.regularizationRate = +this.value;
        reset();
    });
    regularRate.property("value", state.regularizationRate);
    var problem = d3.select("#problem").on("change", function () {
        state.problem = state_1.problems[this.value];
        generateData();
        drawDatasetThumbnails();
        reset();
    });
    problem.property("value", state_1.getKeyFromValue(state_1.problems, state.problem));
    var x = d3.scale.linear().domain([-1, 1]).range([0, 144]);
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickValues([-1, 0, 1])
        .tickFormat(d3.format("d"));
    d3.select("#colormap g.core").append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,10)")
        .call(xAxis);
    window.addEventListener("resize", function () {
        var newWidth = document.querySelector("#main-part")
            .getBoundingClientRect().width;
        if (newWidth !== mainWidth) {
            mainWidth = newWidth;
            drawNetwork(network);
            updateUI(true);
        }
    });
}
function updateBiasesUI(network) {
    nn.forEachNode(network, true, function (node) {
        d3.select("rect#bias-" + node.id).style("fill", colorScale(node.bias));
    });
}
function updateWeightsUI(network, container) {
    for (var layerIdx = 1; layerIdx < network.length; layerIdx++) {
        var currentLayer = network[layerIdx];
        for (var i = 0; i < currentLayer.length; i++) {
            var node = currentLayer[i];
            for (var j = 0; j < node.inputLinks.length; j++) {
                var link = node.inputLinks[j];
                container.select("#link" + link.source.id + "-" + link.dest.id)
                    .style({
                    "stroke-dashoffset": -iter / 3,
                    "stroke-width": linkWidthScale(Math.abs(link.weight)),
                    "stroke": colorScale(link.weight)
                })
                    .datum(link);
            }
        }
    }
}
function drawNode(cx, cy, nodeId, isInput, container, node) {
    var x = cx - RECT_SIZE / 2;
    var y = cy - RECT_SIZE / 2;
    var nodeGroup = container.append("g")
        .attr({
        "class": "node",
        "id": "node" + nodeId,
        "transform": "translate(" + x + "," + y + ")"
    });
    nodeGroup.append("rect")
        .attr({
        x: 0,
        y: 0,
        width: RECT_SIZE,
        height: RECT_SIZE
    });
    var activeOrNotClass = state[nodeId] ? "active" : "inactive";
    if (isInput) {
        var label = INPUTS[nodeId].label != null ?
            INPUTS[nodeId].label : nodeId;
        var text = nodeGroup.append("text").attr({
            class: "main-label",
            x: -10,
            y: RECT_SIZE / 2, "text-anchor": "end"
        });
        if (/[_^]/.test(label)) {
            var myRe = /(.*?)([_^])(.)/g;
            var myArray = void 0;
            var lastIndex = void 0;
            while ((myArray = myRe.exec(label)) !== null) {
                lastIndex = myRe.lastIndex;
                var prefix = myArray[1];
                var sep = myArray[2];
                var suffix = myArray[3];
                if (prefix) {
                    text.append("tspan").text(prefix);
                }
                text.append("tspan")
                    .attr("baseline-shift", sep == "_" ? "sub" : "super")
                    .style("font-size", "9px")
                    .text(suffix);
            }
            if (label.substring(lastIndex)) {
                text.append("tspan").text(label.substring(lastIndex));
            }
        }
        else {
            text.append("tspan").text(label);
        }
        nodeGroup.classed(activeOrNotClass, true);
    }
    if (!isInput) {
        nodeGroup.append("rect")
            .attr({
            id: "bias-" + nodeId,
            x: -BIAS_SIZE - 2,
            y: RECT_SIZE - BIAS_SIZE + 3,
            width: BIAS_SIZE,
            height: BIAS_SIZE
        }).on("mouseenter", function () {
            updateHoverCard(HoverType.BIAS, node, d3.mouse(container.node()));
        }).on("mouseleave", function () {
            updateHoverCard(null);
        });
    }
    var div = d3.select("#network").insert("div", ":first-child")
        .attr({
        "id": "canvas-" + nodeId,
        "class": "canvas"
    })
        .style({
        position: "absolute",
        left: (x + 3) + "px",
        top: (y + 3) + "px"
    })
        .on("mouseenter", function () {
        selectedNodeId = nodeId;
        div.classed("hovered", true);
        nodeGroup.classed("hovered", true);
        updateDecisionBoundary(network, false);
        heatMap.updateBackground(boundary[nodeId], state.discretize);
    })
        .on("mouseleave", function () {
        selectedNodeId = null;
        div.classed("hovered", false);
        nodeGroup.classed("hovered", false);
        updateDecisionBoundary(network, false);
        heatMap.updateBackground(boundary[nn.getOutputNode(network).id], state.discretize);
    });
    if (isInput) {
        div.on("click", function () {
            state[nodeId] = !state[nodeId];
            reset();
        });
        div.style("cursor", "pointer");
    }
    if (isInput) {
        div.classed(activeOrNotClass, true);
    }
    var nodeHeatMap = new heatmap_1.HeatMap(RECT_SIZE, DENSITY / 10, xDomain, xDomain, div, { noSvg: true });
    div.datum({ heatmap: nodeHeatMap, id: nodeId });
}
function drawNetwork(network) {
    var svg = d3.select("#svg");
    svg.select("g.core").remove();
    d3.select("#network").selectAll("div.canvas").remove();
    d3.select("#network").selectAll("div.plus-minus-neurons").remove();
    var padding = 3;
    var co = d3.select(".column.output").node();
    var cf = d3.select(".column.features").node();
    var width = co.offsetLeft - cf.offsetLeft;
    svg.attr("width", width);
    var node2coord = {};
    var container = svg.append("g")
        .classed("core", true)
        .attr("transform", "translate(" + padding + "," + padding + ")");
    var numLayers = network.length;
    var featureWidth = 118;
    var layerScale = d3.scale.ordinal()
        .domain(d3.range(1, numLayers - 1))
        .rangePoints([featureWidth, width - RECT_SIZE], 0.7);
    var nodeIndexScale = function (nodeIndex) { return nodeIndex * (RECT_SIZE + 25); };
    var calloutThumb = d3.select(".callout.thumbnail").style("display", "none");
    var calloutWeights = d3.select(".callout.weights").style("display", "none");
    var idWithCallout = null;
    var targetIdWithCallout = null;
    var cx = RECT_SIZE / 2 + 50;
    var nodeIds = Object.keys(INPUTS);
    var maxY = nodeIndexScale(nodeIds.length);
    nodeIds.forEach(function (nodeId, i) {
        var cy = nodeIndexScale(i) + RECT_SIZE / 2;
        node2coord[nodeId] = { cx: cx, cy: cy };
        drawNode(cx, cy, nodeId, true, container);
    });
    for (var layerIdx = 1; layerIdx < numLayers - 1; layerIdx++) {
        var numNodes = network[layerIdx].length;
        var cx_1 = layerScale(layerIdx) + RECT_SIZE / 2;
        maxY = Math.max(maxY, nodeIndexScale(numNodes));
        addPlusMinusControl(layerScale(layerIdx), layerIdx);
        for (var i = 0; i < numNodes; i++) {
            var node_1 = network[layerIdx][i];
            var cy_1 = nodeIndexScale(i) + RECT_SIZE / 2;
            node2coord[node_1.id] = { cx: cx_1, cy: cy_1 };
            drawNode(cx_1, cy_1, node_1.id, false, container, node_1);
            var numNodes_1 = network[layerIdx].length;
            var nextNumNodes = network[layerIdx + 1].length;
            if (idWithCallout == null &&
                i === numNodes_1 - 1 &&
                nextNumNodes <= numNodes_1) {
                calloutThumb.style({
                    display: null,
                    top: (20 + 3 + cy_1) + "px",
                    left: cx_1 + "px"
                });
                idWithCallout = node_1.id;
            }
            for (var j = 0; j < node_1.inputLinks.length; j++) {
                var link = node_1.inputLinks[j];
                var path = drawLink(link, node2coord, network, container, j === 0, j, node_1.inputLinks.length).node();
                var prevLayer = network[layerIdx - 1];
                var lastNodePrevLayer = prevLayer[prevLayer.length - 1];
                if (targetIdWithCallout == null &&
                    i === numNodes_1 - 1 &&
                    link.source.id === lastNodePrevLayer.id &&
                    (link.source.id !== idWithCallout || numLayers <= 5) &&
                    link.dest.id !== idWithCallout &&
                    prevLayer.length >= numNodes_1) {
                    var midPoint = path.getPointAtLength(path.getTotalLength() * 0.7);
                    calloutWeights.style({
                        display: null,
                        top: (midPoint.y + 5) + "px",
                        left: (midPoint.x + 3) + "px"
                    });
                    targetIdWithCallout = link.dest.id;
                }
            }
        }
    }
    cx = width + RECT_SIZE / 2;
    var node = network[numLayers - 1][0];
    var cy = nodeIndexScale(0) + RECT_SIZE / 2;
    node2coord[node.id] = { cx: cx, cy: cy };
    for (var i = 0; i < node.inputLinks.length; i++) {
        var link = node.inputLinks[i];
        drawLink(link, node2coord, network, container, i === 0, i, node.inputLinks.length);
    }
    svg.attr("height", maxY);
    var height = Math.max(getRelativeHeight(calloutThumb), getRelativeHeight(calloutWeights), getRelativeHeight(d3.select("#network")));
    d3.select(".column.features").style("height", height + "px");
}
function getRelativeHeight(selection) {
    var node = selection.node();
    return node.offsetHeight + node.offsetTop;
}
function addPlusMinusControl(x, layerIdx) {
    var div = d3.select("#network").append("div")
        .classed("plus-minus-neurons", true)
        .style("left", (x - 10) + "px");
    var i = layerIdx - 1;
    var firstRow = div.append("div").attr("class", "ui-numNodes" + layerIdx);
    firstRow.append("button")
        .attr("class", "mdl-button mdl-js-button mdl-button--icon")
        .on("click", function () {
        var numNeurons = state.networkShape[i];
        if (numNeurons >= 8) {
            return;
        }
        state.networkShape[i]++;
        reset();
    })
        .append("i")
        .attr("class", "material-icons")
        .text("add");
    firstRow.append("button")
        .attr("class", "mdl-button mdl-js-button mdl-button--icon")
        .on("click", function () {
        var numNeurons = state.networkShape[i];
        if (numNeurons <= 1) {
            return;
        }
        state.networkShape[i]--;
        reset();
    })
        .append("i")
        .attr("class", "material-icons")
        .text("remove");
    var suffix = state.networkShape[i] > 1 ? "s" : "";
    div.append("div").text(state.networkShape[i] + " neuron" + suffix);
}
function updateHoverCard(type, nodeOrLink, coordinates) {
    var hovercard = d3.select("#hovercard");
    if (type == null) {
        hovercard.style("display", "none");
        d3.select("#svg").on("click", null);
        return;
    }
    d3.select("#svg").on("click", function () {
        hovercard.select(".value").style("display", "none");
        var input = hovercard.select("input");
        input.style("display", null);
        input.on("input", function () {
            if (this.value != null && this.value !== "") {
                if (type == HoverType.WEIGHT) {
                    nodeOrLink.weight = +this.value;
                }
                else {
                    nodeOrLink.bias = +this.value;
                }
                updateUI();
            }
        });
        input.on("keypress", function () {
            if (d3.event.keyCode == 13) {
                updateHoverCard(type, nodeOrLink, coordinates);
            }
        });
        input.node().focus();
    });
    var value = type == HoverType.WEIGHT ?
        nodeOrLink.weight :
        nodeOrLink.bias;
    var name = type == HoverType.WEIGHT ? "Weight" : "Bias";
    hovercard.style({
        "left": (coordinates[0] + 20) + "px",
        "top": coordinates[1] + "px",
        "display": "block"
    });
    hovercard.select(".type").text(name);
    hovercard.select(".value")
        .style("display", null)
        .text(value.toPrecision(2));
    hovercard.select("input")
        .property("value", value.toPrecision(2))
        .style("display", "none");
}
function drawLink(input, node2coord, network, container, isFirst, index, length) {
    var line = container.insert("path", ":first-child");
    var source = node2coord[input.source.id];
    var dest = node2coord[input.dest.id];
    var datum = {
        source: {
            y: source.cx + RECT_SIZE / 2 + 2,
            x: source.cy
        },
        target: {
            y: dest.cx - RECT_SIZE / 2,
            x: dest.cy + ((index - (length - 1) / 2) / length) * 12
        }
    };
    var diagonal = d3.svg.diagonal().projection(function (d) { return [d.y, d.x]; });
    line.attr({
        "marker-start": "url(#markerArrow)",
        class: "link",
        id: "link" + input.source.id + "-" + input.dest.id,
        d: diagonal(datum, 0)
    });
    container.append("path")
        .attr("d", diagonal(datum, 0))
        .attr("class", "link-hover")
        .on("mouseenter", function () {
        updateHoverCard(HoverType.WEIGHT, input, d3.mouse(this));
    }).on("mouseleave", function () {
        updateHoverCard(null);
    });
    return line;
}
function updateDecisionBoundary(network, firstTime) {
    if (firstTime) {
        boundary = {};
        nn.forEachNode(network, true, function (node) {
            boundary[node.id] = new Array(DENSITY);
        });
        for (var nodeId in INPUTS) {
            boundary[nodeId] = new Array(DENSITY);
        }
    }
    var xScale = d3.scale.linear().domain([0, DENSITY - 1]).range(xDomain);
    var yScale = d3.scale.linear().domain([DENSITY - 1, 0]).range(xDomain);
    var i = 0, j = 0;
    for (i = 0; i < DENSITY; i++) {
        if (firstTime) {
            nn.forEachNode(network, true, function (node) {
                boundary[node.id][i] = new Array(DENSITY);
            });
            for (var nodeId in INPUTS) {
                boundary[nodeId][i] = new Array(DENSITY);
            }
        }
        for (j = 0; j < DENSITY; j++) {
            var x = xScale(i);
            var y = yScale(j);
            var input = constructInput(x, y);
            nn.forwardProp(network, input);
            nn.forEachNode(network, true, function (node) {
                boundary[node.id][i][j] = node.output;
            });
            if (firstTime) {
                for (var nodeId in INPUTS) {
                    boundary[nodeId][i][j] = INPUTS[nodeId].f(x, y);
                }
            }
        }
    }
}
function getLoss(network, dataPoints) {
    var loss = 0;
    for (var i = 0; i < dataPoints.length; i++) {
        var dataPoint = dataPoints[i];
        var input = constructInput(dataPoint.x, dataPoint.y);
        var output = nn.forwardProp(network, input);
        loss += nn.Errors.SQUARE.error(output, dataPoint.label);
    }
    return loss / dataPoints.length;
}
function updateUI(firstStep) {
    if (firstStep === void 0) { firstStep = false; }
    updateWeightsUI(network, d3.select("g.core"));
    updateBiasesUI(network);
    updateDecisionBoundary(network, firstStep);
    var selectedId = selectedNodeId != null ?
        selectedNodeId : nn.getOutputNode(network).id;
    heatMap.updateBackground(boundary[selectedId], state.discretize);
    d3.select("#network").selectAll("div.canvas")
        .each(function (data) {
        data.heatmap.updateBackground(heatmap_1.reduceMatrix(boundary[data.id], 10), state.discretize);
    });
    function zeroPad(n) {
        var pad = "000000";
        return (pad + n).slice(-pad.length);
    }
    function addCommas(s) {
        return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function humanReadable(n) {
        return n.toFixed(3);
    }
    d3.select("#loss-train").text(humanReadable(lossTrain));
    d3.select("#loss-test").text(humanReadable(lossTest));
    d3.select("#iter-number").text(addCommas(zeroPad(iter)));
    lineChart.addDataPoint([lossTrain, lossTest]);
}
function constructInputIds() {
    var result = [];
    for (var inputName in INPUTS) {
        if (state[inputName]) {
            result.push(inputName);
        }
    }
    return result;
}
function constructInput(x, y) {
    var input = [];
    for (var inputName in INPUTS) {
        if (state[inputName]) {
            input.push(INPUTS[inputName].f(x, y));
        }
    }
    return input;
}
function oneStep() {
    iter++;
    trainData.forEach(function (point, i) {
        var input = constructInput(point.x, point.y);
        nn.forwardProp(network, input);
        nn.backProp(network, point.label, nn.Errors.SQUARE);
        if ((i + 1) % state.batchSize === 0) {
            nn.updateWeights(network, state.learningRate, state.regularizationRate);
        }
    });
    lossTrain = getLoss(network, trainData);
    lossTest = getLoss(network, testData);
    updateUI();
}
function getOutputWeights(network) {
    var weights = [];
    for (var layerIdx = 0; layerIdx < network.length - 1; layerIdx++) {
        var currentLayer = network[layerIdx];
        for (var i = 0; i < currentLayer.length; i++) {
            var node = currentLayer[i];
            for (var j = 0; j < node.outputs.length; j++) {
                var output = node.outputs[j];
                weights.push(output.weight);
            }
        }
    }
    return weights;
}
exports.getOutputWeights = getOutputWeights;
function reset() {
    lineChart.reset();
    state.serialize();
    player.pause();
    var suffix = state.numHiddenLayers !== 1 ? "s" : "";
    d3.select("#layers-label").text("Hidden layer" + suffix);
    d3.select("#num-layers").text(state.numHiddenLayers);
    iter = 0;
    var numInputs = constructInput(0, 0).length;
    var shape = [numInputs].concat(state.networkShape).concat([1]);
    var outputActivation = (state.problem == state_1.Problem.REGRESSION) ?
        nn.Activations.LINEAR : nn.Activations.TANH;
    network = nn.buildNetwork(shape, state.activation, outputActivation, state.regularization, constructInputIds(), state.initZero);
    lossTrain = getLoss(network, trainData);
    lossTest = getLoss(network, testData);
    drawNetwork(network);
    updateUI(true);
}
;
function initTutorial() {
    if (state.tutorial == null) {
        return;
    }
    d3.selectAll("article div.l--body").remove();
    var tutorial = d3.select("article").append("div")
        .attr("class", "l--body");
    d3.html("tutorials/" + state.tutorial + ".html", function (err, htmlFragment) {
        if (err) {
            throw err;
        }
        tutorial.node().appendChild(htmlFragment);
        var title = tutorial.select("title");
        if (title.size()) {
            d3.select("header h1").style({
                "margin-top": "20px",
                "margin-bottom": "20px"
            })
                .text(title.text());
            document.title = title.text();
        }
    });
}
function drawDatasetThumbnails() {
    function renderThumbnail(canvas, dataGenerator) {
        var w = 100;
        var h = 100;
        canvas.setAttribute("width", w);
        canvas.setAttribute("height", h);
        var context = canvas.getContext("2d");
        var data = dataGenerator(200, 0);
        data.forEach(function (d) {
            context.fillStyle = colorScale(d.label);
            context.fillRect(w * (d.x + 6) / 12, h * (d.y + 6) / 12, 4, 4);
        });
        d3.select(canvas.parentNode).style("display", null);
    }
    d3.selectAll(".dataset").style("display", "none");
    if (state.problem == state_1.Problem.CLASSIFICATION) {
        for (var dataset in state_1.datasets) {
            var canvas = document.querySelector("canvas[data-dataset=" + dataset + "]");
            var dataGenerator = state_1.datasets[dataset];
            renderThumbnail(canvas, dataGenerator);
        }
    }
    if (state.problem == state_1.Problem.REGRESSION) {
        for (var regDataset in state_1.regDatasets) {
            var canvas = document.querySelector("canvas[data-regDataset=" + regDataset + "]");
            var dataGenerator = state_1.regDatasets[regDataset];
            renderThumbnail(canvas, dataGenerator);
        }
    }
}
function hideControls() {
    var hiddenProps = state.getHiddenProps();
    hiddenProps.forEach(function (prop) {
        var controls = d3.selectAll(".ui-" + prop);
        if (controls.size() == 0) {
            console.warn("0 html elements found with class .ui-" + prop);
        }
        controls.style("display", "none");
    });
    var hideControls = d3.select(".hide-controls");
    HIDABLE_CONTROLS.forEach(function (_a) {
        var text = _a[0], id = _a[1];
        var label = hideControls.append("label")
            .attr("class", "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect");
        var input = label.append("input")
            .attr({
            type: "checkbox",
            class: "mdl-checkbox__input"
        });
        if (hiddenProps.indexOf(id) == -1) {
            input.attr("checked", "true");
        }
        input.on("change", function () {
            state.setHideProperty(id, !this.checked);
            state.serialize();
            d3.select(".hide-controls-link")
                .attr("href", window.location.href);
        });
        label.append("span")
            .attr("class", "mdl-checkbox__label label")
            .text(text);
    });
    d3.select(".hide-controls-link")
        .attr("href", window.location.href);
}
function generateData(firstTime) {
    if (firstTime === void 0) { firstTime = false; }
    if (!firstTime) {
        state.seed = Math.random().toFixed(5);
        state.serialize();
    }
    Math.seedrandom(state.seed);
    var numSamples = (state.problem == state_1.Problem.REGRESSION) ?
        NUM_SAMPLES_REGRESS : NUM_SAMPLES_CLASSIFY;
    var generator = state.problem == state_1.Problem.CLASSIFICATION ?
        state.dataset : state.regDataset;
    var data = generator(numSamples, state.noise / 100);
    dataset_1.shuffle(data);
    var splitIndex = Math.floor(data.length * state.percTrainData / 100);
    trainData = data.slice(0, splitIndex);
    testData = data.slice(splitIndex);
    heatMap.updatePoints(trainData);
    heatMap.updateTestPoints(state.showTestData ? testData : []);
}
function handleDragOver() {
    this.stopPropagation();
    this.preventDefault();
    this.dataTransfer.dropEffect = 'copy';
}
function readData() {
    var data = this.result.split('\n');
    var points = [];
    trainData = [];
    var minpoint = { x: Number.MAX_VALUE,
        y: Number.MAX_VALUE,
        label: Number.MAX_VALUE };
    var maxpoint = { x: Number.MIN_VALUE,
        y: Number.MIN_VALUE,
        label: Number.MIN_VALUE };
    for (var l in data) {
        if (data[l] == "" && trainData.length == 0) {
            trainData = points;
            points = [];
        }
        var elms = data[l].split(" ");
        if (elms.length == 3) {
            var point = { x: parseFloat(elms[0]), y: parseFloat(elms[1]), label: parseFloat(elms[2]) };
            points.push(point);
            minpoint.x = Math.min(minpoint.x, point.x);
            minpoint.y = Math.min(minpoint.y, point.y);
            minpoint.label = Math.min(minpoint.label, point.label);
            maxpoint.x = Math.max(maxpoint.x, point.x);
            maxpoint.y = Math.max(maxpoint.y, point.y);
            maxpoint.label = Math.max(maxpoint.label, point.label);
        }
    }
    testData = points;
    xDomain = [Math.min(xDomain[0], minpoint.x), Math.max(xDomain[1], maxpoint.x)];
    yDomain = [Math.min(yDomain[0], minpoint.y), Math.max(yDomain[1], maxpoint.y)];
    d3.select("#heatmap").select("*").remove();
    heatMap =
        new heatmap_1.HeatMap(300, DENSITY, xDomain, yDomain, d3.select("#heatmap"), { showAxes: true });
    heatMap.updatePoints(trainData);
    heatMap.updateTestPoints(state.showTestData ? testData : []);
    if (state.problem == state_1.Problem.CLASSIFICATION) {
        var dataThumbnails = d3.selectAll("canvas[data-dataset]");
        dataThumbnails.classed("selected", false);
        d3.select("canvas[data-dataset=user]").classed("selected", true);
        state.dataset = state_1.datasets["user"];
    }
    else {
        var dataThumbnails = d3.selectAll("canvas[data-regDataset]");
        dataThumbnails.classed("selected", false);
        d3.select("canvas[data-regDataset=reg-user]").classed("selected", true);
        state.regDataset = state_1.datasets["reg-user"];
    }
    reset();
    var str = d3.select("#data-load-button").property("value", "");
}
function handleLoadData() {
    var file;
    if (this.files) {
        file = this.files[0];
    }
    else {
        file = this.dataTransfer.files[0];
    }
    changeInputText();
    var fileInputTextDiv = d3.select("#file_input_text_div");
    if (d3.select("#file_input_text").text().length != 0) {
        if (!fileInputTextDiv.classed("is-focused")) {
            fileInputTextDiv.classed('is-focused', true);
        }
    }
    else {
        if (fileInputTextDiv.classed("is-focused")) {
            fileInputTextDiv.classed('is-focused', false);
        }
    }
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = readData;
}
function changeInputText() {
    var str = d3.select("#data-load-button").property("value");
    var i;
    if (str.lastIndexOf('\\')) {
        i = str.lastIndexOf('\\') + 1;
    }
    else if (str.lastIndexOf('/')) {
        i = str.lastIndexOf('/') + 1;
    }
    d3.select("#file_input_text").property("value", str.slice(i, str.length));
}
drawDatasetThumbnails();
initTutorial();
makeGUI();
generateData(true);
reset();
hideControls();

},{"./dataset":1,"./heatmap":2,"./linechart":3,"./nn":4,"./state":6}],6:[function(require,module,exports){
"use strict";
var nn = require("./nn");
var dataset = require("./dataset");
var HIDE_STATE_SUFFIX = "_hide";
exports.activations = {
    "relu": nn.Activations.RELU,
    "tanh": nn.Activations.TANH,
    "sigmoid": nn.Activations.SIGMOID,
    "linear": nn.Activations.LINEAR
};
exports.regularizations = {
    "none": null,
    "L1": nn.RegularizationFunction.L1,
    "L2": nn.RegularizationFunction.L2
};
exports.datasets = {
    "circle": dataset.classifyCircleData,
    "xor": dataset.classifyXORData,
    "gauss": dataset.classifyTwoGaussData,
    "spiral": dataset.classifySpiralData,
    "user": dataset.classifyUserData
};
exports.regDatasets = {
    "reg-plane": dataset.regressPlane,
    "reg-gauss": dataset.regressGaussian,
    "reg-user": dataset.classifyUserData
};
function getKeyFromValue(obj, value) {
    for (var key in obj) {
        if (obj[key] === value) {
            return key;
        }
    }
    return undefined;
}
exports.getKeyFromValue = getKeyFromValue;
function endsWith(s, suffix) {
    return s.substr(-suffix.length) === suffix;
}
function getHideProps(obj) {
    var result = [];
    for (var prop in obj) {
        if (endsWith(prop, HIDE_STATE_SUFFIX)) {
            result.push(prop);
        }
    }
    return result;
}
(function (Type) {
    Type[Type["STRING"] = 0] = "STRING";
    Type[Type["NUMBER"] = 1] = "NUMBER";
    Type[Type["ARRAY_NUMBER"] = 2] = "ARRAY_NUMBER";
    Type[Type["ARRAY_STRING"] = 3] = "ARRAY_STRING";
    Type[Type["BOOLEAN"] = 4] = "BOOLEAN";
    Type[Type["OBJECT"] = 5] = "OBJECT";
})(exports.Type || (exports.Type = {}));
var Type = exports.Type;
(function (Problem) {
    Problem[Problem["CLASSIFICATION"] = 0] = "CLASSIFICATION";
    Problem[Problem["REGRESSION"] = 1] = "REGRESSION";
})(exports.Problem || (exports.Problem = {}));
var Problem = exports.Problem;
exports.problems = {
    "classification": Problem.CLASSIFICATION,
    "regression": Problem.REGRESSION
};
;
var State = (function () {
    function State() {
        this.learningRate = 0.03;
        this.regularizationRate = 0;
        this.showTestData = false;
        this.noise = 0;
        this.batchSize = 10;
        this.discretize = false;
        this.tutorial = null;
        this.percTrainData = 50;
        this.activation = nn.Activations.TANH;
        this.regularization = null;
        this.problem = Problem.CLASSIFICATION;
        this.initZero = false;
        this.collectStats = false;
        this.numHiddenLayers = 1;
        this.hiddenLayerControls = [];
        this.networkShape = [4, 2];
        this.x = true;
        this.y = true;
        this.xTimesY = false;
        this.xSquared = false;
        this.ySquared = false;
        this.cosX = false;
        this.sinX = false;
        this.cosY = false;
        this.sinY = false;
        this.dataset = dataset.classifyCircleData;
        this.regDataset = dataset.regressPlane;
    }
    State.deserializeState = function () {
        var map = {};
        for (var _i = 0, _a = window.location.hash.slice(1).split("&"); _i < _a.length; _i++) {
            var keyvalue = _a[_i];
            var _b = keyvalue.split("="), name_1 = _b[0], value = _b[1];
            map[name_1] = value;
        }
        var state = new State();
        function hasKey(name) {
            return name in map && map[name] != null && map[name].trim() !== "";
        }
        function parseArray(value) {
            return value.trim() === "" ? [] : value.split(",");
        }
        State.PROPS.forEach(function (_a) {
            var name = _a.name, type = _a.type, keyMap = _a.keyMap;
            switch (type) {
                case Type.OBJECT:
                    if (keyMap == null) {
                        throw Error("A key-value map must be provided for state " +
                            "variables of type Object");
                    }
                    if (hasKey(name) && map[name] in keyMap) {
                        state[name] = keyMap[map[name]];
                    }
                    break;
                case Type.NUMBER:
                    if (hasKey(name)) {
                        state[name] = +map[name];
                    }
                    break;
                case Type.STRING:
                    if (hasKey(name)) {
                        state[name] = map[name];
                    }
                    break;
                case Type.BOOLEAN:
                    if (hasKey(name)) {
                        state[name] = (map[name] === "false" ? false : true);
                    }
                    break;
                case Type.ARRAY_NUMBER:
                    if (name in map) {
                        state[name] = parseArray(map[name]).map(Number);
                    }
                    break;
                case Type.ARRAY_STRING:
                    if (name in map) {
                        state[name] = parseArray(map[name]);
                    }
                    break;
                default:
                    throw Error("Encountered an unknown type for a state variable");
            }
        });
        getHideProps(map).forEach(function (prop) {
            state[prop] = (map[prop] === "true") ? true : false;
        });
        state.numHiddenLayers = state.networkShape.length;
        if (state.seed == null) {
            state.seed = Math.random().toFixed(5);
        }
        Math.seedrandom(state.seed);
        return state;
    };
    State.prototype.serialize = function () {
        var _this = this;
        var props = [];
        State.PROPS.forEach(function (_a) {
            var name = _a.name, type = _a.type, keyMap = _a.keyMap;
            var value = _this[name];
            if (value == null) {
                return;
            }
            if (type === Type.OBJECT) {
                value = getKeyFromValue(keyMap, value);
            }
            else if (type === Type.ARRAY_NUMBER ||
                type === Type.ARRAY_STRING) {
                value = value.join(",");
            }
            props.push(name + "=" + value);
        });
        getHideProps(this).forEach(function (prop) {
            props.push(prop + "=" + _this[prop]);
        });
        window.location.hash = props.join("&");
    };
    State.prototype.getHiddenProps = function () {
        var result = [];
        for (var prop in this) {
            if (endsWith(prop, HIDE_STATE_SUFFIX) && this[prop] === true) {
                result.push(prop.replace(HIDE_STATE_SUFFIX, ""));
            }
        }
        return result;
    };
    State.prototype.setHideProperty = function (name, hidden) {
        this[name + HIDE_STATE_SUFFIX] = hidden;
    };
    State.PROPS = [
        { name: "activation", type: Type.OBJECT, keyMap: exports.activations },
        { name: "regularization", type: Type.OBJECT, keyMap: exports.regularizations },
        { name: "batchSize", type: Type.NUMBER },
        { name: "dataset", type: Type.OBJECT, keyMap: exports.datasets },
        { name: "regDataset", type: Type.OBJECT, keyMap: exports.regDatasets },
        { name: "learningRate", type: Type.NUMBER },
        { name: "regularizationRate", type: Type.NUMBER },
        { name: "noise", type: Type.NUMBER },
        { name: "networkShape", type: Type.ARRAY_NUMBER },
        { name: "seed", type: Type.STRING },
        { name: "showTestData", type: Type.BOOLEAN },
        { name: "discretize", type: Type.BOOLEAN },
        { name: "percTrainData", type: Type.NUMBER },
        { name: "x", type: Type.BOOLEAN },
        { name: "y", type: Type.BOOLEAN },
        { name: "xTimesY", type: Type.BOOLEAN },
        { name: "xSquared", type: Type.BOOLEAN },
        { name: "ySquared", type: Type.BOOLEAN },
        { name: "cosX", type: Type.BOOLEAN },
        { name: "sinX", type: Type.BOOLEAN },
        { name: "cosY", type: Type.BOOLEAN },
        { name: "sinY", type: Type.BOOLEAN },
        { name: "collectStats", type: Type.BOOLEAN },
        { name: "tutorial", type: Type.STRING },
        { name: "problem", type: Type.OBJECT, keyMap: exports.problems },
        { name: "initZero", type: Type.BOOLEAN },
    ];
    return State;
}());
exports.State = State;

},{"./dataset":1,"./nn":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkYXRhc2V0LnRzIiwiaGVhdG1hcC50cyIsImxpbmVjaGFydC50cyIsIm5uLnRzIiwicGxheWdyb3VuZC50cyIsInN0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ2lDQSxpQkFBd0IsS0FBWTtJQUNsQyxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQzNCLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNiLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztJQUVkLE9BQU8sT0FBTyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBRW5CLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsQ0FBQztRQUU1QyxPQUFPLEVBQUUsQ0FBQztRQUVWLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3RCLENBQUM7QUFDSCxDQUFDO0FBZmUsZUFBTyxVQWV0QixDQUFBO0FBSUQsOEJBQXFDLFVBQWtCLEVBQUUsS0FBYTtJQUVwRSxJQUFJLE1BQU0sR0FBZ0IsRUFBRSxDQUFDO0lBRTdCLElBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEUsSUFBSSxRQUFRLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXBDLGtCQUFrQixFQUFVLEVBQUUsRUFBVSxFQUFFLEtBQWE7UUFDckQsR0FB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LENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUIsSUFBSSxNQUFNLEdBQUcsV0FBVyxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUNsRCxJQUFJLE1BQU0sR0FBRyxXQUFXLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ2xELElBQUksS0FBSyxHQUFHLGNBQWMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ3pFLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUdELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLElBQUksS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1QixJQUFJLE1BQU0sR0FBRyxXQUFXLENBQUMsQ0FB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RSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLElBQUksS0FBSyxHQUFjLEVBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQztZQUNwRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRW5CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0MsUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZELFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0MsUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pELENBQUM7SUFDSCxDQUFDO0lBQ0QsUUFBUSxHQUFHLE1BQU0sQ0FBQztJQUNsQixPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0UsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdFLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzNDLE9BQU87UUFDSCxJQUFJLGlCQUFPLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQzdELEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7SUFDMUIsT0FBTyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNoQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLFlBQVksR0FBRyxRQUFRLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFFN0QsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxlQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUM1QyxJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDMUQsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDMUMsRUFBRSxDQUFDLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDakUsS0FBSyxDQUFDLE9BQU8sR0FBRyxnQkFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLElBQUksY0FBYyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUM3RCxjQUFjLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMxQyxFQUFFLENBQUMsTUFBTSxDQUFDLGtDQUFrQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RSxLQUFLLENBQUMsVUFBVSxHQUFHLGdCQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUNELEtBQUssRUFBRSxDQUFDO0lBQ1IsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUMsRUFBRSxDQUFDLENBQUM7QUFDaEUsQ0FBQztBQUVEO0lBQ0UsSUFBSSxJQUFJLENBQUM7SUFDVCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNmLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQsZUFBZSxFQUFFLENBQUM7SUFDbEIsSUFBSSxnQkFBZ0IsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFDekQsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELEVBQUUsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlDLENBQUM7SUFDSCxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0MsQ0FBQztJQUNILENBQUM7SUFFRCxJQUFJLE1BQU0sR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO0lBQzlCLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7QUFDM0IsQ0FBQztBQUVEO0lBQ0UsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMzRCxJQUFJLENBQUMsQ0FBQztJQUNOLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFCLENBQUMsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLENBQUMsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBQ0QsRUFBRSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQUVELHFCQUFxQixFQUFFLENBQUM7QUFDeEIsWUFBWSxFQUFFLENBQUM7QUFDZixPQUFPLEVBQUUsQ0FBQztBQUNWLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuQixLQUFLLEVBQUUsQ0FBQztBQUNSLFlBQVksRUFBRSxDQUFDOzs7O0FDNW1DZixJQUFZLEVBQUUsV0FBTSxNQUFNLENBQUMsQ0FBQTtBQUMzQixJQUFZLE9BQU8sV0FBTSxXQUFXLENBQUMsQ0FBQTtBQUdyQyxJQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQztBQUd2QixtQkFBVyxHQUEyQztJQUMvRCxNQUFNLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJO0lBQzNCLE1BQU0sRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUk7SUFDM0IsU0FBUyxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTztJQUNqQyxRQUFRLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNO0NBQ2hDLENBQUM7QUFHUyx1QkFBZSxHQUErQztJQUN2RSxNQUFNLEVBQUUsSUFBSTtJQUNaLElBQUksRUFBRSxFQUFFLENBQUMsc0JBQXNCLENBQUMsRUFBRTtJQUNsQyxJQUFJLEVBQUUsRUFBRSxDQUFDLHNCQUFzQixDQUFDLEVBQUU7Q0FDbkMsQ0FBQztBQUdTLGdCQUFRLEdBQTJDO0lBQzVELFFBQVEsRUFBRSxPQUFPLENBQUMsa0JBQWtCO0lBQ3BDLEtBQUssRUFBRSxPQUFPLENBQUMsZUFBZTtJQUM5QixPQUFPLEVBQUUsT0FBTyxDQUFDLG9CQUFvQjtJQUNyQyxRQUFRLEVBQUUsT0FBTyxDQUFDLGtCQUFrQjtJQUNwQyxNQUFNLEVBQUUsT0FBTyxDQUFDLGdCQUFnQjtDQUNqQyxDQUFDO0FBR1MsbUJBQVcsR0FBMkM7SUFDL0QsV0FBVyxFQUFFLE9BQU8sQ0FBQyxZQUFZO0lBQ2pDLFdBQVcsRUFBRSxPQUFPLENBQUMsZUFBZTtJQUNwQyxVQUFVLEVBQUUsT0FBTyxDQUFDLGdCQUFnQjtDQUNyQyxDQUFDO0FBRUYseUJBQWdDLEdBQVEsRUFBRSxLQUFVO0lBQ2xELEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDcEIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDdkIsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNiLENBQUM7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBUGUsdUJBQWUsa0JBTzlCLENBQUE7QUFFRCxrQkFBa0IsQ0FBUyxFQUFFLE1BQWM7SUFDekMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssTUFBTSxDQUFDO0FBQzdDLENBQUM7QUFFRCxzQkFBc0IsR0FBUTtJQUM1QixJQUFJLE1BQU0sR0FBYSxFQUFFLENBQUM7SUFDMUIsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNyQixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsQ0FBQztJQUNILENBQUM7SUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFNRCxXQUFZLElBQUk7SUFDZCxtQ0FBTSxDQUFBO0lBQ04sbUNBQU0sQ0FBQTtJQUNOLCtDQUFZLENBQUE7SUFDWiwrQ0FBWSxDQUFBO0lBQ1oscUNBQU8sQ0FBQTtJQUNQLG1DQUFNLENBQUE7QUFDUixDQUFDLEVBUFcsWUFBSSxLQUFKLFlBQUksUUFPZjtBQVBELElBQVksSUFBSSxHQUFKLFlBT1gsQ0FBQTtBQUVELFdBQVksT0FBTztJQUNqQix5REFBYyxDQUFBO0lBQ2QsaURBQVUsQ0FBQTtBQUNaLENBQUMsRUFIVyxlQUFPLEtBQVAsZUFBTyxRQUdsQjtBQUhELElBQVksT0FBTyxHQUFQLGVBR1gsQ0FBQTtBQUVVLGdCQUFRLEdBQUc7SUFDcEIsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLGNBQWM7SUFDeEMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxVQUFVO0NBQ2pDLENBQUM7QUFNRCxDQUFDO0FBR0Y7SUFBQTtRQWdDRSxpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQix1QkFBa0IsR0FBRyxDQUFDLENBQUM7UUFDdkIsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFDckIsVUFBSyxHQUFHLENBQUMsQ0FBQztRQUNWLGNBQVMsR0FBRyxFQUFFLENBQUM7UUFDZixlQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ25CLGFBQVEsR0FBVyxJQUFJLENBQUM7UUFDeEIsa0JBQWEsR0FBRyxFQUFFLENBQUM7UUFDbkIsZUFBVSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO1FBQ2pDLG1CQUFjLEdBQThCLElBQUksQ0FBQztRQUNqRCxZQUFPLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQztRQUNqQyxhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLG9CQUFlLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLHdCQUFtQixHQUFVLEVBQUUsQ0FBQztRQUNoQyxpQkFBWSxHQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE1BQUMsR0FBRyxJQUFJLENBQUM7UUFDVCxNQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ1QsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUNoQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsU0FBSSxHQUFHLEtBQUssQ0FBQztRQUNiLFNBQUksR0FBRyxLQUFLLENBQUM7UUFDYixTQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2IsU0FBSSxHQUFHLEtBQUssQ0FBQztRQUNiLFlBQU8sR0FBMEIsT0FBTyxDQUFDLGtCQUFrQixDQUFDO1FBQzVELGVBQVUsR0FBMEIsT0FBTyxDQUFDLFlBQVksQ0FBQztJQXNIM0QsQ0FBQztJQWhIUSxzQkFBZ0IsR0FBdkI7UUFDRSxJQUFJLEdBQUcsR0FBNEIsRUFBRSxDQUFDO1FBQ3RDLEdBQUcsQ0FBQyxDQUFpQixVQUF3QyxFQUF4QyxLQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQXhDLGNBQXdDLEVBQXhDLElBQXdDLENBQUM7WUFBekQsSUFBSSxRQUFRLFNBQUE7WUFDZixJQUFBLHdCQUF1QyxFQUFsQyxjQUFJLEVBQUUsYUFBSyxDQUF3QjtZQUN4QyxHQUFHLENBQUMsTUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO1NBQ25CO1FBQ0QsSUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUV4QixnQkFBZ0IsSUFBWTtZQUMxQixNQUFNLENBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7UUFDckUsQ0FBQztRQUVELG9CQUFvQixLQUFhO1lBQy9CLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JELENBQUM7UUFHRCxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEVBQW9CO2dCQUFuQixjQUFJLEVBQUUsY0FBSSxFQUFFLGtCQUFNO1lBQ3RDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsS0FBSyxJQUFJLENBQUMsTUFBTTtvQkFDZCxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDbkIsTUFBTSxLQUFLLENBQUMsNkNBQTZDOzRCQUNyRCwwQkFBMEIsQ0FBQyxDQUFDO29CQUNsQyxDQUFDO29CQUNELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDeEMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDbEMsQ0FBQztvQkFDRCxLQUFLLENBQUM7Z0JBQ1IsS0FBSyxJQUFJLENBQUMsTUFBTTtvQkFDZCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUVqQixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzNCLENBQUM7b0JBQ0QsS0FBSyxDQUFDO2dCQUNSLEtBQUssSUFBSSxDQUFDLE1BQU07b0JBQ2QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDakIsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDMUIsQ0FBQztvQkFDRCxLQUFLLENBQUM7Z0JBQ1IsS0FBSyxJQUFJLENBQUMsT0FBTztvQkFDZixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNqQixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssT0FBTyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQztvQkFDdkQsQ0FBQztvQkFDRCxLQUFLLENBQUM7Z0JBQ1IsS0FBSyxJQUFJLENBQUMsWUFBWTtvQkFDcEIsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ2hCLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNsRCxDQUFDO29CQUNELEtBQUssQ0FBQztnQkFDUixLQUFLLElBQUksQ0FBQyxZQUFZO29CQUNwQixFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDaEIsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDdEMsQ0FBQztvQkFDRCxLQUFLLENBQUM7Z0JBQ1I7b0JBQ0UsTUFBTSxLQUFLLENBQUMsa0RBQWtELENBQUMsQ0FBQztZQUNwRSxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFHSCxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtZQUM1QixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssTUFBTSxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUN0RCxDQUFDLENBQUMsQ0FBQztRQUNILEtBQUssQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7UUFDbEQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxDQUFDO1FBQ0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNmLENBQUM7SUFLRCx5QkFBUyxHQUFUO1FBQUEsaUJBc0JDO1FBcEJDLElBQUksS0FBSyxHQUFhLEVBQUUsQ0FBQztRQUN6QixLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEVBQW9CO2dCQUFuQixjQUFJLEVBQUUsY0FBSSxFQUFFLGtCQUFNO1lBQ3RDLElBQUksS0FBSyxHQUFHLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV2QixFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbEIsTUFBTSxDQUFDO1lBQ1QsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDekIsS0FBSyxHQUFHLGVBQWUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDekMsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLFlBQVk7Z0JBQ2pDLElBQUksS0FBSyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDL0IsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDMUIsQ0FBQztZQUNELEtBQUssQ0FBQyxJQUFJLENBQUksSUFBSSxTQUFJLEtBQU8sQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO1FBRUgsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7WUFDN0IsS0FBSyxDQUFDLElBQUksQ0FBSSxJQUFJLFNBQUksS0FBSSxDQUFDLElBQUksQ0FBRyxDQUFDLENBQUM7UUFDdEMsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFHRCw4QkFBYyxHQUFkO1FBQ0UsSUFBSSxNQUFNLEdBQWEsRUFBRSxDQUFDO1FBQzFCLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdEIsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxpQkFBaUIsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNuRCxDQUFDO1FBQ0gsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELCtCQUFlLEdBQWYsVUFBZ0IsSUFBWSxFQUFFLE1BQWU7UUFDM0MsSUFBSSxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUMxQyxDQUFDO0lBN0tjLFdBQUssR0FBZTtRQUNqQyxFQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLG1CQUFXLEVBQUM7UUFDNUQsRUFBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLHVCQUFlLEVBQUM7UUFDcEUsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO1FBQ3RDLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsZ0JBQVEsRUFBQztRQUN0RCxFQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLG1CQUFXLEVBQUM7UUFDNUQsRUFBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO1FBQ3pDLEVBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO1FBQy9DLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztRQUNsQyxFQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUM7UUFDL0MsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO1FBQ2pDLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztRQUMxQyxFQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUM7UUFDeEMsRUFBQyxJQUFJLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO1FBQzFDLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztRQUMvQixFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUM7UUFDL0IsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDO1FBQ3JDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztRQUN0QyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUM7UUFDdEMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDO1FBQ2xDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztRQUNsQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUM7UUFDbEMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDO1FBQ2xDLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztRQUMxQyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7UUFDckMsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxnQkFBUSxFQUFDO1FBQ3RELEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztLQUN2QyxDQUFDO0lBbUpKLFlBQUM7QUFBRCxDQWhMQSxBQWdMQyxJQUFBO0FBaExZLGFBQUssUUFnTGpCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbnlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4vKipcbiAqIEEgdHdvIGRpbWVuc2lvbmFsIGV4YW1wbGU6IHggYW5kIHkgY29vcmRpbmF0ZXMgd2l0aCB0aGUgbGFiZWwuXG4gKi9cbmV4cG9ydCB0eXBlIEV4YW1wbGUyRCA9IHtcbiAgeDogbnVtYmVyLFxuICB5OiBudW1iZXIsXG4gIGxhYmVsOiBudW1iZXJcbn07XG5cbnR5cGUgUG9pbnQgPSB7XG4gIHg6IG51bWJlcixcbiAgeTogbnVtYmVyXG59O1xuXG4vKipcbiAqIFNodWZmbGVzIHRoZSBhcnJheSB1c2luZyBGaXNoZXItWWF0ZXMgYWxnb3JpdGhtLiBVc2VzIHRoZSBzZWVkcmFuZG9tXG4gKiBsaWJyYXJ5IGFzIHRoZSByYW5kb20gZ2VuZXJhdG9yLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2h1ZmZsZShhcnJheTogYW55W10pOiB2b2lkIHtcbiAgbGV0IGNvdW50ZXIgPSBhcnJheS5sZW5ndGg7XG4gIGxldCB0ZW1wID0gMDtcbiAgbGV0IGluZGV4ID0gMDtcbiAgLy8gV2hpbGUgdGhlcmUgYXJlIGVsZW1lbnRzIGluIHRoZSBhcnJheVxuICB3aGlsZSAoY291bnRlciA+IDApIHtcbiAgICAvLyBQaWNrIGEgcmFuZG9tIGluZGV4XG4gICAgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb3VudGVyKTtcbiAgICAvLyBEZWNyZWFzZSBjb3VudGVyIGJ5IDFcbiAgICBjb3VudGVyLS07XG4gICAgLy8gQW5kIHN3YXAgdGhlIGxhc3QgZWxlbWVudCB3aXRoIGl0XG4gICAgdGVtcCA9IGFycmF5W2NvdW50ZXJdO1xuICAgIGFycmF5W2NvdW50ZXJdID0gYXJyYXlbaW5kZXhdO1xuICAgIGFycmF5W2luZGV4XSA9IHRlbXA7XG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgRGF0YUdlbmVyYXRvciA9IChudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpID0+IEV4YW1wbGUyRFtdO1xuXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NpZnlUd29HYXVzc0RhdGEobnVtU2FtcGxlczogbnVtYmVyLCBub2lzZTogbnVtYmVyKTpcbiAgICBFeGFtcGxlMkRbXSB7XG4gIGxldCBwb2ludHM6IEV4YW1wbGUyRFtdID0gW107XG5cbiAgbGV0IHZhcmlhbmNlU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIC41XSkucmFuZ2UoWzAuNSwgNF0pO1xuICBsZXQgdmFyaWFuY2UgPSB2YXJpYW5jZVNjYWxlKG5vaXNlKTtcblxuICBmdW5jdGlvbiBnZW5HYXVzcyhjeDogbnVtYmVyLCBjeTogbnVtYmVyLCBsYWJlbDogbnVtYmVyKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1TYW1wbGVzIC8gMjsgaSsrKSB7XG4gICAgICBsZXQgeCA9IG5vcm1hbFJhbmRvbShjeCwgdmFyaWFuY2UpO1xuICAgICAgbGV0IHkgPSBub3JtYWxSYW5kb20oY3ksIHZhcmlhbmNlKTtcbiAgICAgIHBvaW50cy5wdXNoKHt4OiB4LCB5OiB5LCBsYWJlbDogbGFiZWx9KTtcbiAgICB9XG4gIH1cblxuICBnZW5HYXVzcygyLCAyLCAxKTsgLy8gR2F1c3NpYW4gd2l0aCBwb3NpdGl2ZSBleGFtcGxlcy5cbiAgZ2VuR2F1c3MoLTIsIC0yLCAtMSk7IC8vIEdhdXNzaWFuIHdpdGggbmVnYXRpdmUgZXhhbXBsZXMuXG4gIHJldHVybiBwb2ludHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdyZXNzUGxhbmUobnVtU2FtcGxlczogbnVtYmVyLCBub2lzZTogbnVtYmVyKTpcbiAgRXhhbXBsZTJEW10ge1xuICBsZXQgcmFkaXVzID0gNjtcbiAgbGV0IGxhYmVsU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuICAgIC5kb21haW4oWy0xMCwgMTBdKVxuICAgIC5yYW5nZShbLTEsIDFdKTtcbiAgbGV0IGdldExhYmVsID0gKHgsIHkpID0+IGxhYmVsU2NhbGUoeCArIHkpO1xuXG4gIGxldCBwb2ludHM6IEV4YW1wbGUyRFtdID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtU2FtcGxlczsgaSsrKSB7XG4gICAgbGV0IHggPSByYW5kVW5pZm9ybSgtcmFkaXVzLCByYWRpdXMpO1xuICAgIGxldCB5ID0gcmFuZFVuaWZvcm0oLXJhZGl1cywgcmFkaXVzKTtcbiAgICBsZXQgbm9pc2VYID0gcmFuZFVuaWZvcm0oLXJhZGl1cywgcmFkaXVzKSAqIG5vaXNlO1xuICAgIGxldCBub2lzZVkgPSByYW5kVW5pZm9ybSgtcmFkaXVzLCByYWRpdXMpICogbm9pc2U7XG4gICAgbGV0IGxhYmVsID0gZ2V0TGFiZWwoeCArIG5vaXNlWCwgeSArIG5vaXNlWSk7XG4gICAgcG9pbnRzLnB1c2goe3g6IHgsIHk6IHksIGxhYmVsOiBsYWJlbH0pO1xuICB9XG4gIHJldHVybiBwb2ludHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdyZXNzR2F1c3NpYW4obnVtU2FtcGxlczogbnVtYmVyLCBub2lzZTogbnVtYmVyKTpcbiAgRXhhbXBsZTJEW10ge1xuICBsZXQgcG9pbnRzOiBFeGFtcGxlMkRbXSA9IFtdO1xuXG4gIGxldCBsYWJlbFNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcbiAgICAuZG9tYWluKFswLCAyXSlcbiAgICAucmFuZ2UoWzEsIDBdKVxuICAgIC5jbGFtcCh0cnVlKTtcblxuICBsZXQgZ2F1c3NpYW5zID0gW1xuICAgIFstNCwgMi41LCAxXSxcbiAgICBbMCwgMi41LCAtMV0sXG4gICAgWzQsIDIuNSwgMV0sXG4gICAgWy00LCAtMi41LCAtMV0sXG4gICAgWzAsIC0yLjUsIDFdLFxuICAgIFs0LCAtMi41LCAtMV1cbiAgXTtcblxuICBmdW5jdGlvbiBnZXRMYWJlbCh4LCB5KSB7XG4gICAgLy8gQ2hvb3NlIHRoZSBvbmUgdGhhdCBpcyBtYXhpbXVtIGluIGFicyB2YWx1ZS5cbiAgICBsZXQgbGFiZWwgPSAwO1xuICAgIGdhdXNzaWFucy5mb3JFYWNoKChbY3gsIGN5LCBzaWduXSkgPT4ge1xuICAgICAgbGV0IG5ld0xhYmVsID0gc2lnbiAqIGxhYmVsU2NhbGUoZGlzdCh7eDogeCwgeTogeX0sIHt4OiBjeCwgeTogY3l9KSk7XG4gICAgICBpZiAoTWF0aC5hYnMobmV3TGFiZWwpID4gTWF0aC5hYnMobGFiZWwpKSB7XG4gICAgICAgIGxhYmVsID0gbmV3TGFiZWw7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGxhYmVsO1xuICB9XG4gIGxldCByYWRpdXMgPSA2O1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVNhbXBsZXM7IGkrKykge1xuICAgIGxldCB4ID0gcmFuZFVuaWZvcm0oLXJhZGl1cywgcmFkaXVzKTtcbiAgICBsZXQgeSA9IHJhbmRVbmlmb3JtKC1yYWRpdXMsIHJhZGl1cyk7XG4gICAgbGV0IG5vaXNlWCA9IHJhbmRVbmlmb3JtKC1yYWRpdXMsIHJhZGl1cykgKiBub2lzZTtcbiAgICBsZXQgbm9pc2VZID0gcmFuZFVuaWZvcm0oLXJhZGl1cywgcmFkaXVzKSAqIG5vaXNlO1xuICAgIGxldCBsYWJlbCA9IGdldExhYmVsKHggKyBub2lzZVgsIHkgKyBub2lzZVkpO1xuICAgIHBvaW50cy5wdXNoKHt4OiB4LCB5OiB5LCBsYWJlbDogbGFiZWx9KTtcbiAgfTtcbiAgcmV0dXJuIHBvaW50cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsYXNzaWZ5U3BpcmFsRGF0YShudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpOlxuICAgIEV4YW1wbGUyRFtdIHtcbiAgbGV0IHBvaW50czogRXhhbXBsZTJEW10gPSBbXTtcbiAgbGV0IG4gPSBudW1TYW1wbGVzIC8gMjtcblxuICBmdW5jdGlvbiBnZW5TcGlyYWwoZGVsdGFUOiBudW1iZXIsIGxhYmVsOiBudW1iZXIpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgbGV0IHIgPSBpIC8gbiAqIDU7XG4gICAgICBsZXQgdCA9IDEuNzUgKiBpIC8gbiAqIDIgKiBNYXRoLlBJICsgZGVsdGFUO1xuICAgICAgbGV0IHggPSByICogTWF0aC5zaW4odCkgKyByYW5kVW5pZm9ybSgtMSwgMSkgKiBub2lzZTtcbiAgICAgIGxldCB5ID0gciAqIE1hdGguY29zKHQpICsgcmFuZFVuaWZvcm0oLTEsIDEpICogbm9pc2U7XG4gICAgICBwb2ludHMucHVzaCh7eDogeCwgeTogeSwgbGFiZWw6IGxhYmVsfSk7XG4gICAgfVxuICB9XG5cbiAgZ2VuU3BpcmFsKDAsIDEpOyAvLyBQb3NpdGl2ZSBleGFtcGxlcy5cbiAgZ2VuU3BpcmFsKE1hdGguUEksIC0xKTsgLy8gTmVnYXRpdmUgZXhhbXBsZXMuXG4gIHJldHVybiBwb2ludHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGFzc2lmeUNpcmNsZURhdGEobnVtU2FtcGxlczogbnVtYmVyLCBub2lzZTogbnVtYmVyKTpcbiAgICBFeGFtcGxlMkRbXSB7XG4gIGxldCBwb2ludHM6IEV4YW1wbGUyRFtdID0gW107XG4gIGxldCByYWRpdXMgPSA1O1xuICBmdW5jdGlvbiBnZXRDaXJjbGVMYWJlbChwOiBQb2ludCwgY2VudGVyOiBQb2ludCkge1xuICAgIHJldHVybiAoZGlzdChwLCBjZW50ZXIpIDwgKHJhZGl1cyAqIDAuNSkpID8gMSA6IC0xO1xuICB9XG5cbiAgLy8gR2VuZXJhdGUgcG9zaXRpdmUgcG9pbnRzIGluc2lkZSB0aGUgY2lyY2xlLlxuICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVNhbXBsZXMgLyAyOyBpKyspIHtcbiAgICBsZXQgciA9IHJhbmRVbmlmb3JtKDAsIHJhZGl1cyAqIDAuNSk7XG4gICAgbGV0IGFuZ2xlID0gcmFuZFVuaWZvcm0oMCwgMiAqIE1hdGguUEkpO1xuICAgIGxldCB4ID0gciAqIE1hdGguc2luKGFuZ2xlKTtcbiAgICBsZXQgeSA9IHIgKiBNYXRoLmNvcyhhbmdsZSk7XG4gICAgbGV0IG5vaXNlWCA9IHJhbmRVbmlmb3JtKC1yYWRpdXMsIHJhZGl1cykgKiBub2lzZTtcbiAgICBsZXQgbm9pc2VZID0gcmFuZFVuaWZvcm0oLXJhZGl1cywgcmFkaXVzKSAqIG5vaXNlO1xuICAgIGxldCBsYWJlbCA9IGdldENpcmNsZUxhYmVsKHt4OiB4ICsgbm9pc2VYLCB5OiB5ICsgbm9pc2VZfSwge3g6IDAsIHk6IDB9KTtcbiAgICBwb2ludHMucHVzaCh7eDogeCwgeTogeSwgbGFiZWw6IGxhYmVsfSk7XG4gIH1cblxuICAvLyBHZW5lcmF0ZSBuZWdhdGl2ZSBwb2ludHMgb3V0c2lkZSB0aGUgY2lyY2xlLlxuICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVNhbXBsZXMgLyAyOyBpKyspIHtcbiAgICBsZXQgciA9IHJhbmRVbmlmb3JtKHJhZGl1cyAqIDAuNywgcmFkaXVzKTtcbiAgICBsZXQgYW5nbGUgPSByYW5kVW5pZm9ybSgwLCAyICogTWF0aC5QSSk7XG4gICAgbGV0IHggPSByICogTWF0aC5zaW4oYW5nbGUpO1xuICAgIGxldCB5ID0gciAqIE1hdGguY29zKGFuZ2xlKTtcbiAgICBsZXQgbm9pc2VYID0gcmFuZFVuaWZvcm0oLXJhZGl1cywgcmFkaXVzKSAqIG5vaXNlO1xuICAgIGxldCBub2lzZVkgPSByYW5kVW5pZm9ybSgtcmFkaXVzLCByYWRpdXMpICogbm9pc2U7XG4gICAgbGV0IGxhYmVsID0gZ2V0Q2lyY2xlTGFiZWwoe3g6IHggKyBub2lzZVgsIHk6IHkgKyBub2lzZVl9LCB7eDogMCwgeTogMH0pO1xuICAgIHBvaW50cy5wdXNoKHt4OiB4LCB5OiB5LCBsYWJlbDogbGFiZWx9KTtcbiAgfVxuICByZXR1cm4gcG9pbnRzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NpZnlYT1JEYXRhKG51bVNhbXBsZXM6IG51bWJlciwgbm9pc2U6IG51bWJlcik6XG4gICAgRXhhbXBsZTJEW10ge1xuICBmdW5jdGlvbiBnZXRYT1JMYWJlbChwOiBQb2ludCkgeyByZXR1cm4gcC54ICogcC55ID49IDAgPyAxIDogLTE7IH1cblxuICBsZXQgcG9pbnRzOiBFeGFtcGxlMkRbXSA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVNhbXBsZXM7IGkrKykge1xuICAgIGxldCB4ID0gcmFuZFVuaWZvcm0oLTUsIDUpO1xuICAgIGxldCBwYWRkaW5nID0gMC4zO1xuICAgIHggKz0geCA+IDAgPyBwYWRkaW5nIDogLXBhZGRpbmc7ICAvLyBQYWRkaW5nLlxuICAgIGxldCB5ID0gcmFuZFVuaWZvcm0oLTUsIDUpO1xuICAgIHkgKz0geSA+IDAgPyBwYWRkaW5nIDogLXBhZGRpbmc7XG4gICAgbGV0IG5vaXNlWCA9IHJhbmRVbmlmb3JtKC01LCA1KSAqIG5vaXNlO1xuICAgIGxldCBub2lzZVkgPSByYW5kVW5pZm9ybSgtNSwgNSkgKiBub2lzZTtcbiAgICBsZXQgbGFiZWwgPSBnZXRYT1JMYWJlbCh7eDogeCArIG5vaXNlWCwgeTogeSArIG5vaXNlWX0pO1xuICAgIHBvaW50cy5wdXNoKHt4OiB4LCB5OiB5LCBsYWJlbDogbGFiZWx9KTtcbiAgfVxuICByZXR1cm4gcG9pbnRzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NpZnlVc2VyRGF0YShudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpOlxuICBFeGFtcGxlMkRbXSB7XG5cbiAgcmV0dXJuIGNsYXNzaWZ5VHdvR2F1c3NEYXRhKG51bVNhbXBsZXMsIG5vaXNlKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgc2FtcGxlIGZyb20gYSB1bmlmb3JtIFthLCBiXSBkaXN0cmlidXRpb24uXG4gKiBVc2VzIHRoZSBzZWVkcmFuZG9tIGxpYnJhcnkgYXMgdGhlIHJhbmRvbSBnZW5lcmF0b3IuXG4gKi9cbmZ1bmN0aW9uIHJhbmRVbmlmb3JtKGE6IG51bWJlciwgYjogbnVtYmVyKSB7XG4gIHJldHVybiBNYXRoLnJhbmRvbSgpICogKGIgLSBhKSArIGE7XG59XG5cbi8qKlxuICogU2FtcGxlcyBmcm9tIGEgbm9ybWFsIGRpc3RyaWJ1dGlvbi4gVXNlcyB0aGUgc2VlZHJhbmRvbSBsaWJyYXJ5IGFzIHRoZVxuICogcmFuZG9tIGdlbmVyYXRvci5cbiAqXG4gKiBAcGFyYW0gbWVhbiBUaGUgbWVhbi4gRGVmYXVsdCBpcyAwLlxuICogQHBhcmFtIHZhcmlhbmNlIFRoZSB2YXJpYW5jZS4gRGVmYXVsdCBpcyAxLlxuICovXG5mdW5jdGlvbiBub3JtYWxSYW5kb20obWVhbiA9IDAsIHZhcmlhbmNlID0gMSk6IG51bWJlciB7XG4gIGxldCB2MTogbnVtYmVyLCB2MjogbnVtYmVyLCBzOiBudW1iZXI7XG4gIGRvIHtcbiAgICB2MSA9IDIgKiBNYXRoLnJhbmRvbSgpIC0gMTtcbiAgICB2MiA9IDIgKiBNYXRoLnJhbmRvbSgpIC0gMTtcbiAgICBzID0gdjEgKiB2MSArIHYyICogdjI7XG4gIH0gd2hpbGUgKHMgPiAxKTtcblxuICBsZXQgcmVzdWx0ID0gTWF0aC5zcXJ0KC0yICogTWF0aC5sb2cocykgLyBzKSAqIHYxO1xuICByZXR1cm4gbWVhbiArIE1hdGguc3FydCh2YXJpYW5jZSkgKiByZXN1bHQ7XG59XG5cbi8qKiBSZXR1cm5zIHRoZSBldWNsZWRpYW4gZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzIGluIHNwYWNlLiAqL1xuZnVuY3Rpb24gZGlzdChhOiBQb2ludCwgYjogUG9pbnQpOiBudW1iZXIge1xuICBsZXQgZHggPSBhLnggLSBiLng7XG4gIGxldCBkeSA9IGEueSAtIGIueTtcbiAgcmV0dXJuIE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG59XG4iLCIvKiBDb3B5cmlnaHQgMjAxNiBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xueW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbmltcG9ydCB7RXhhbXBsZTJEfSBmcm9tIFwiLi9kYXRhc2V0XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSGVhdE1hcFNldHRpbmdzIHtcbiAgW2tleTogc3RyaW5nXTogYW55O1xuICBzaG93QXhlcz86IGJvb2xlYW47XG4gIG5vU3ZnPzogYm9vbGVhbjtcbn1cblxuLyoqIE51bWJlciBvZiBkaWZmZXJlbnQgc2hhZGVzIChjb2xvcnMpIHdoZW4gZHJhd2luZyBhIGdyYWRpZW50IGhlYXRtYXAgKi9cbmNvbnN0IE5VTV9TSEFERVMgPSAzMDtcblxuLyoqXG4gKiBEcmF3cyBhIGhlYXRtYXAgdXNpbmcgY2FudmFzLiBVc2VkIGZvciBzaG93aW5nIHRoZSBsZWFybmVkIGRlY2lzaW9uXG4gKiBib3VuZGFyeSBvZiB0aGUgY2xhc3NpZmljYXRpb24gYWxnb3JpdGhtLiBDYW4gYWxzbyBkcmF3IGRhdGEgcG9pbnRzXG4gKiB1c2luZyBhbiBzdmcgb3ZlcmxheWVkIG9uIHRvcCBvZiB0aGUgY2FudmFzIGhlYXRtYXAuXG4gKi9cbmV4cG9ydCBjbGFzcyBIZWF0TWFwIHtcbiAgcHJpdmF0ZSBzZXR0aW5nczogSGVhdE1hcFNldHRpbmdzID0ge1xuICAgIHNob3dBeGVzOiBmYWxzZSxcbiAgICBub1N2ZzogZmFsc2VcbiAgfTtcbiAgcHJpdmF0ZSB4U2NhbGU6IGQzLnNjYWxlLkxpbmVhcjxudW1iZXIsIG51bWJlcj47XG4gIHByaXZhdGUgeVNjYWxlOiBkMy5zY2FsZS5MaW5lYXI8bnVtYmVyLCBudW1iZXI+O1xuICBwcml2YXRlIG51bVNhbXBsZXM6IG51bWJlcjtcbiAgcHJpdmF0ZSBjb2xvcjogZDMuc2NhbGUuUXVhbnRpemU8c3RyaW5nPjtcbiAgcHJpdmF0ZSBjYW52YXM6IGQzLlNlbGVjdGlvbjxhbnk+O1xuICBwcml2YXRlIHN2ZzogZDMuU2VsZWN0aW9uPGFueT47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICB3aWR0aDogbnVtYmVyLCBudW1TYW1wbGVzOiBudW1iZXIsIHhEb21haW46IFtudW1iZXIsIG51bWJlcl0sXG4gICAgICB5RG9tYWluOiBbbnVtYmVyLCBudW1iZXJdLCBjb250YWluZXI6IGQzLlNlbGVjdGlvbjxhbnk+LFxuICAgICAgdXNlclNldHRpbmdzPzogSGVhdE1hcFNldHRpbmdzKSB7XG4gICAgdGhpcy5udW1TYW1wbGVzID0gbnVtU2FtcGxlcztcbiAgICBsZXQgaGVpZ2h0ID0gd2lkdGg7XG4gICAgbGV0IHBhZGRpbmcgPSB1c2VyU2V0dGluZ3Muc2hvd0F4ZXMgPyAyMCA6IDA7XG5cbiAgICBpZiAodXNlclNldHRpbmdzICE9IG51bGwpIHtcbiAgICAgIC8vIG92ZXJ3cml0ZSB0aGUgZGVmYXVsdHMgd2l0aCB0aGUgdXNlci1zcGVjaWZpZWQgc2V0dGluZ3MuXG4gICAgICBmb3IgKGxldCBwcm9wIGluIHVzZXJTZXR0aW5ncykge1xuICAgICAgICB0aGlzLnNldHRpbmdzW3Byb3BdID0gdXNlclNldHRpbmdzW3Byb3BdO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMueFNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcbiAgICAgIC5kb21haW4oeERvbWFpbilcbiAgICAgIC5yYW5nZShbMCwgd2lkdGggLSAyICogcGFkZGluZ10pO1xuXG4gICAgdGhpcy55U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuICAgICAgLmRvbWFpbih5RG9tYWluKVxuICAgICAgLnJhbmdlKFtoZWlnaHQgLSAyICogcGFkZGluZywgMF0pO1xuXG4gICAgLy8gR2V0IGEgcmFuZ2Ugb2YgY29sb3JzLlxuICAgIGxldCB0bXBTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcjxzdHJpbmcsIHN0cmluZz4oKVxuICAgICAgICAuZG9tYWluKFswLCAuNSwgMV0pXG4gICAgICAgIC5yYW5nZShbXCIjZjU5MzIyXCIsIFwiI2U4ZWFlYlwiLCBcIiMwODc3YmRcIl0pXG4gICAgICAgIC5jbGFtcCh0cnVlKTtcbiAgICAvLyBEdWUgdG8gbnVtZXJpY2FsIGVycm9yLCB3ZSBuZWVkIHRvIHNwZWNpZnlcbiAgICAvLyBkMy5yYW5nZSgwLCBlbmQgKyBzbWFsbF9lcHNpbG9uLCBzdGVwKVxuICAgIC8vIGluIG9yZGVyIHRvIGd1YXJhbnRlZSB0aGF0IHdlIHdpbGwgaGF2ZSBlbmQvc3RlcCBlbnRyaWVzIHdpdGhcbiAgICAvLyB0aGUgbGFzdCBlbGVtZW50IGJlaW5nIGVxdWFsIHRvIGVuZC5cbiAgICBsZXQgY29sb3JzID0gZDMucmFuZ2UoMCwgMSArIDFFLTksIDEgLyBOVU1fU0hBREVTKS5tYXAoYSA9PiB7XG4gICAgICByZXR1cm4gdG1wU2NhbGUoYSk7XG4gICAgfSk7XG4gICAgdGhpcy5jb2xvciA9IGQzLnNjYWxlLnF1YW50aXplPHN0cmluZz4oKVxuICAgICAgICAgICAgICAgICAgICAgLmRvbWFpbihbLTEsIDFdKVxuICAgICAgICAgICAgICAgICAgICAgLnJhbmdlKGNvbG9ycyk7XG5cbiAgICBjb250YWluZXIgPSBjb250YWluZXIuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAuc3R5bGUoe1xuICAgICAgICB3aWR0aDogYCR7d2lkdGh9cHhgLFxuICAgICAgICBoZWlnaHQ6IGAke2hlaWdodH1weGAsXG4gICAgICAgIHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsXG4gICAgICAgIHRvcDogYC0ke3BhZGRpbmd9cHhgLFxuICAgICAgICBsZWZ0OiBgLSR7cGFkZGluZ31weGBcbiAgICAgIH0pO1xuICAgIHRoaXMuY2FudmFzID0gY29udGFpbmVyLmFwcGVuZChcImNhbnZhc1wiKVxuICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBudW1TYW1wbGVzKVxuICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgbnVtU2FtcGxlcylcbiAgICAgIC5zdHlsZShcIndpZHRoXCIsICh3aWR0aCAtIDIgKiBwYWRkaW5nKSArIFwicHhcIilcbiAgICAgIC5zdHlsZShcImhlaWdodFwiLCAoaGVpZ2h0IC0gMiAqIHBhZGRpbmcpICsgXCJweFwiKVxuICAgICAgLnN0eWxlKFwicG9zaXRpb25cIiwgXCJhYnNvbHV0ZVwiKVxuICAgICAgLnN0eWxlKFwidG9wXCIsIGAke3BhZGRpbmd9cHhgKVxuICAgICAgLnN0eWxlKFwibGVmdFwiLCBgJHtwYWRkaW5nfXB4YCk7XG5cbiAgICBpZiAoIXRoaXMuc2V0dGluZ3Mubm9TdmcpIHtcbiAgICAgIHRoaXMuc3ZnID0gY29udGFpbmVyLmFwcGVuZChcInN2Z1wiKS5hdHRyKHtcbiAgICAgICAgICBcIndpZHRoXCI6IHdpZHRoLFxuICAgICAgICAgIFwiaGVpZ2h0XCI6IGhlaWdodFxuICAgICAgfSkuc3R5bGUoe1xuICAgICAgICAvLyBPdmVybGF5IHRoZSBzdmcgb24gdG9wIG9mIHRoZSBjYW52YXMuXG4gICAgICAgIFwicG9zaXRpb25cIjogXCJhYnNvbHV0ZVwiLFxuICAgICAgICBcImxlZnRcIjogXCIwXCIsXG4gICAgICAgIFwidG9wXCI6IFwiMFwiXG4gICAgICB9KS5hcHBlbmQoXCJnXCIpXG4gICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoJHtwYWRkaW5nfSwke3BhZGRpbmd9KWApO1xuXG4gICAgICB0aGlzLnN2Zy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJjbGFzc1wiLCBcInRyYWluXCIpO1xuICAgICAgdGhpcy5zdmcuYXBwZW5kKFwiZ1wiKS5hdHRyKFwiY2xhc3NcIiwgXCJ0ZXN0XCIpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLnNob3dBeGVzKSB7XG4gICAgICBsZXQgeEF4aXMgPSBkMy5zdmcuYXhpcygpXG4gICAgICAgIC5zY2FsZSh0aGlzLnhTY2FsZSlcbiAgICAgICAgLm9yaWVudChcImJvdHRvbVwiKTtcblxuICAgICAgbGV0IHlBeGlzID0gZDMuc3ZnLmF4aXMoKVxuICAgICAgICAuc2NhbGUodGhpcy55U2NhbGUpXG4gICAgICAgIC5vcmllbnQoXCJyaWdodFwiKTtcblxuICAgICAgdGhpcy5zdmcuYXBwZW5kKFwiZ1wiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwieCBheGlzXCIpXG4gICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoMCwke2hlaWdodCAtIDIgKiBwYWRkaW5nfSlgKVxuICAgICAgICAuY2FsbCh4QXhpcyk7XG5cbiAgICAgIHRoaXMuc3ZnLmFwcGVuZChcImdcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInkgYXhpc1wiKVxuICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICh3aWR0aCAtIDIgKiBwYWRkaW5nKSArIFwiLDApXCIpXG4gICAgICAgIC5jYWxsKHlBeGlzKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVUZXN0UG9pbnRzKHBvaW50czogRXhhbXBsZTJEW10pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5ub1N2Zykge1xuICAgICAgdGhyb3cgRXJyb3IoXCJDYW4ndCBhZGQgcG9pbnRzIHNpbmNlIG5vU3ZnPXRydWVcIik7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlQ2lyY2xlcyh0aGlzLnN2Zy5zZWxlY3QoXCJnLnRlc3RcIiksIHBvaW50cyk7XG4gIH1cblxuICB1cGRhdGVQb2ludHMocG9pbnRzOiBFeGFtcGxlMkRbXSk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNldHRpbmdzLm5vU3ZnKSB7XG4gICAgICB0aHJvdyBFcnJvcihcIkNhbid0IGFkZCBwb2ludHMgc2luY2Ugbm9Tdmc9dHJ1ZVwiKTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVDaXJjbGVzKHRoaXMuc3ZnLnNlbGVjdChcImcudHJhaW5cIiksIHBvaW50cyk7XG4gIH1cblxuICB1cGRhdGVCYWNrZ3JvdW5kKGRhdGE6IG51bWJlcltdW10sIGRpc2NyZXRpemU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBsZXQgZHggPSBkYXRhWzBdLmxlbmd0aDtcbiAgICBsZXQgZHkgPSBkYXRhLmxlbmd0aDtcblxuICAgIGlmIChkeCAhPT0gdGhpcy5udW1TYW1wbGVzIHx8IGR5ICE9PSB0aGlzLm51bVNhbXBsZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBcIlRoZSBwcm92aWRlZCBkYXRhIG1hdHJpeCBtdXN0IGJlIG9mIHNpemUgXCIgK1xuICAgICAgICAgIFwibnVtU2FtcGxlcyBYIG51bVNhbXBsZXNcIik7XG4gICAgfVxuXG4gICAgLy8gQ29tcHV0ZSB0aGUgcGl4ZWwgY29sb3JzOyBzY2FsZWQgYnkgQ1NTLlxuICAgIGxldCBjb250ZXh0ID0gKDxIVE1MQ2FudmFzRWxlbWVudD50aGlzLmNhbnZhcy5ub2RlKCkpLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICBsZXQgaW1hZ2UgPSBjb250ZXh0LmNyZWF0ZUltYWdlRGF0YShkeCwgZHkpO1xuXG4gICAgZm9yIChsZXQgeSA9IDAsIHAgPSAtMTsgeSA8IGR5OyArK3kpIHtcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgZHg7ICsreCkge1xuICAgICAgICBsZXQgdmFsdWUgPSBkYXRhW3hdW3ldO1xuICAgICAgICBpZiAoZGlzY3JldGl6ZSkge1xuICAgICAgICAgIHZhbHVlID0gKHZhbHVlID49IDAgPyAxIDogLTEpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjID0gZDMucmdiKHRoaXMuY29sb3IodmFsdWUpKTtcbiAgICAgICAgaW1hZ2UuZGF0YVsrK3BdID0gYy5yO1xuICAgICAgICBpbWFnZS5kYXRhWysrcF0gPSBjLmc7XG4gICAgICAgIGltYWdlLmRhdGFbKytwXSA9IGMuYjtcbiAgICAgICAgaW1hZ2UuZGF0YVsrK3BdID0gMTYwO1xuICAgICAgfVxuICAgIH1cbiAgICBjb250ZXh0LnB1dEltYWdlRGF0YShpbWFnZSwgMCwgMCk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUNpcmNsZXMoY29udGFpbmVyOiBkMy5TZWxlY3Rpb248YW55PiwgcG9pbnRzOiBFeGFtcGxlMkRbXSkge1xuICAgIC8vIEtlZXAgb25seSBwb2ludHMgdGhhdCBhcmUgaW5zaWRlIHRoZSBib3VuZHMuXG4gICAgbGV0IHhEb21haW4gPSB0aGlzLnhTY2FsZS5kb21haW4oKTtcbiAgICBsZXQgeURvbWFpbiA9IHRoaXMueVNjYWxlLmRvbWFpbigpO1xuICAgIHBvaW50cyA9IHBvaW50cy5maWx0ZXIocCA9PiB7XG4gICAgICByZXR1cm4gcC54ID49IHhEb21haW5bMF0gJiYgcC54IDw9IHhEb21haW5bMV1cbiAgICAgICAgJiYgcC55ID49IHlEb21haW5bMF0gJiYgcC55IDw9IHlEb21haW5bMV07XG4gICAgfSk7XG5cbiAgICAvLyBBdHRhY2ggZGF0YSB0byBpbml0aWFsbHkgZW1wdHkgc2VsZWN0aW9uLlxuICAgIGxldCBzZWxlY3Rpb24gPSBjb250YWluZXIuc2VsZWN0QWxsKFwiY2lyY2xlXCIpLmRhdGEocG9pbnRzKTtcblxuICAgIC8vIEluc2VydCBlbGVtZW50cyB0byBtYXRjaCBsZW5ndGggb2YgcG9pbnRzIGFycmF5LlxuICAgIHNlbGVjdGlvbi5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKS5hdHRyKFwiclwiLCAzKTtcblxuICAgIC8vIFVwZGF0ZSBwb2ludHMgdG8gYmUgaW4gdGhlIGNvcnJlY3QgcG9zaXRpb24uXG4gICAgc2VsZWN0aW9uXG4gICAgICAuYXR0cih7XG4gICAgICAgIGN4OiAoZDogRXhhbXBsZTJEKSA9PiB0aGlzLnhTY2FsZShkLngpLFxuICAgICAgICBjeTogKGQ6IEV4YW1wbGUyRCkgPT4gdGhpcy55U2NhbGUoZC55KSxcbiAgICAgIH0pXG4gICAgICAuc3R5bGUoXCJmaWxsXCIsIGQgPT4gdGhpcy5jb2xvcihkLmxhYmVsKSk7XG5cbiAgICAvLyBSZW1vdmUgcG9pbnRzIGlmIHRoZSBsZW5ndGggaGFzIGdvbmUgZG93bi5cbiAgICBzZWxlY3Rpb24uZXhpdCgpLnJlbW92ZSgpO1xuICB9XG59ICAvLyBDbG9zZSBjbGFzcyBIZWF0TWFwLlxuXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlTWF0cml4KG1hdHJpeDogbnVtYmVyW11bXSwgZmFjdG9yOiBudW1iZXIpOiBudW1iZXJbXVtdIHtcbiAgaWYgKG1hdHJpeC5sZW5ndGggIT09IG1hdHJpeFswXS5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgcHJvdmlkZWQgbWF0cml4IG11c3QgYmUgYSBzcXVhcmUgbWF0cml4XCIpO1xuICB9XG4gIGlmIChtYXRyaXgubGVuZ3RoICUgZmFjdG9yICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHdpZHRoL2hlaWdodCBvZiB0aGUgbWF0cml4IG11c3QgYmUgZGl2aXNpYmxlIGJ5IFwiICtcbiAgICAgICAgXCJ0aGUgcmVkdWN0aW9uIGZhY3RvclwiKTtcbiAgfVxuICBsZXQgcmVzdWx0OiBudW1iZXJbXVtdID0gbmV3IEFycmF5KG1hdHJpeC5sZW5ndGggLyBmYWN0b3IpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdHJpeC5sZW5ndGg7IGkgKz0gZmFjdG9yKSB7XG4gICAgcmVzdWx0W2kgLyBmYWN0b3JdID0gbmV3IEFycmF5KG1hdHJpeC5sZW5ndGggLyBmYWN0b3IpO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWF0cml4Lmxlbmd0aDsgaiArPSBmYWN0b3IpIHtcbiAgICAgIGxldCBhdmcgPSAwO1xuICAgICAgLy8gU3VtIGFsbCB0aGUgdmFsdWVzIGluIHRoZSBuZWlnaGJvcmhvb2QuXG4gICAgICBmb3IgKGxldCBrID0gMDsgayA8IGZhY3RvcjsgaysrKSB7XG4gICAgICAgIGZvciAobGV0IGwgPSAwOyBsIDwgZmFjdG9yOyBsKyspIHtcbiAgICAgICAgICBhdmcgKz0gbWF0cml4W2kgKyBrXVtqICsgbF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGF2ZyAvPSAoZmFjdG9yICogZmFjdG9yKTtcbiAgICAgIHJlc3VsdFtpIC8gZmFjdG9yXVtqIC8gZmFjdG9yXSA9IGF2ZztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsIi8qIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbnR5cGUgRGF0YVBvaW50ID0ge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcltdO1xufVxuXG4vKipcbiAqIEEgbXVsdGktc2VyaWVzIGxpbmUgY2hhcnQgdGhhdCBhbGxvd3MgeW91IHRvIGFwcGVuZCBuZXcgZGF0YSBwb2ludHNcbiAqIGFzIGRhdGEgYmVjb21lcyBhdmFpbGFibGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBBcHBlbmRpbmdMaW5lQ2hhcnQge1xuICBwcml2YXRlIG51bUxpbmVzOiBudW1iZXI7XG4gIHByaXZhdGUgZGF0YTogRGF0YVBvaW50W10gPSBbXTtcbiAgcHJpdmF0ZSBzdmc6IGQzLlNlbGVjdGlvbjxhbnk+O1xuICBwcml2YXRlIHhTY2FsZTogZDMuc2NhbGUuTGluZWFyPG51bWJlciwgbnVtYmVyPjtcbiAgcHJpdmF0ZSB5U2NhbGU6IGQzLnNjYWxlLkxpbmVhcjxudW1iZXIsIG51bWJlcj47XG4gIHByaXZhdGUgcGF0aHM6IGQzLlNlbGVjdGlvbjxhbnk+W107XG4gIHByaXZhdGUgbGluZUNvbG9yczogc3RyaW5nW107XG5cbiAgcHJpdmF0ZSBtaW5ZID0gTnVtYmVyLk1BWF9WQUxVRTtcbiAgcHJpdmF0ZSBtYXhZID0gTnVtYmVyLk1JTl9WQUxVRTtcblxuICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IGQzLlNlbGVjdGlvbjxhbnk+LCBsaW5lQ29sb3JzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMubGluZUNvbG9ycyA9IGxpbmVDb2xvcnM7XG4gICAgdGhpcy5udW1MaW5lcyA9IGxpbmVDb2xvcnMubGVuZ3RoO1xuICAgIGxldCBub2RlID0gPEhUTUxFbGVtZW50PmNvbnRhaW5lci5ub2RlKCk7XG4gICAgbGV0IHRvdGFsV2lkdGggPSBub2RlLm9mZnNldFdpZHRoO1xuICAgIGxldCB0b3RhbEhlaWdodCA9IG5vZGUub2Zmc2V0SGVpZ2h0O1xuICAgIGxldCBtYXJnaW4gPSB7dG9wOiAyLCByaWdodDogMCwgYm90dG9tOiAyLCBsZWZ0OiAyfTtcbiAgICBsZXQgd2lkdGggPSB0b3RhbFdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XG4gICAgbGV0IGhlaWdodCA9IHRvdGFsSGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG5cbiAgICB0aGlzLnhTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG4gICAgICAuZG9tYWluKFswLCAwXSlcbiAgICAgIC5yYW5nZShbMCwgd2lkdGhdKTtcblxuICAgIHRoaXMueVNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcbiAgICAgIC5kb21haW4oWzAsIDBdKVxuICAgICAgLnJhbmdlKFtoZWlnaHQsIDBdKTtcblxuICAgIHRoaXMuc3ZnID0gY29udGFpbmVyLmFwcGVuZChcInN2Z1wiKVxuICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0KVxuICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0ICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b20pXG4gICAgICAuYXBwZW5kKFwiZ1wiKVxuICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7bWFyZ2luLmxlZnR9LCR7bWFyZ2luLnRvcH0pYCk7XG5cbiAgICB0aGlzLnBhdGhzID0gbmV3IEFycmF5KHRoaXMubnVtTGluZXMpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1MaW5lczsgaSsrKSB7XG4gICAgICB0aGlzLnBhdGhzW2ldID0gdGhpcy5zdmcuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibGluZVwiKVxuICAgICAgICAuc3R5bGUoe1xuICAgICAgICAgIFwiZmlsbFwiOiBcIm5vbmVcIixcbiAgICAgICAgICBcInN0cm9rZVwiOiBsaW5lQ29sb3JzW2ldLFxuICAgICAgICAgIFwic3Ryb2tlLXdpZHRoXCI6IFwiMS41cHhcIlxuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICB0aGlzLnJlZHJhdygpO1xuICAgIHRoaXMubWluWSA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgdGhpcy5tYXhZID0gTnVtYmVyLk1JTl9WQUxVRTtcbiAgfVxuXG4gIGFkZERhdGFQb2ludChkYXRhUG9pbnQ6IG51bWJlcltdKSB7XG4gICAgaWYgKGRhdGFQb2ludC5sZW5ndGggIT09IHRoaXMubnVtTGluZXMpIHtcbiAgICAgIHRocm93IEVycm9yKFwiTGVuZ3RoIG9mIGRhdGFQb2ludCBtdXN0IGVxdWFsIG51bWJlciBvZiBsaW5lc1wiKTtcbiAgICB9XG4gICAgZGF0YVBvaW50LmZvckVhY2goeSA9PiB7XG4gICAgICB0aGlzLm1pblkgPSBNYXRoLm1pbih0aGlzLm1pblksIHkpO1xuICAgICAgdGhpcy5tYXhZID0gTWF0aC5tYXgodGhpcy5tYXhZLCB5KTtcbiAgICB9KTtcblxuICAgIHRoaXMuZGF0YS5wdXNoKHt4OiB0aGlzLmRhdGEubGVuZ3RoICsgMSwgeTogZGF0YVBvaW50fSk7XG4gICAgdGhpcy5yZWRyYXcoKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVkcmF3KCkge1xuICAgIC8vIEFkanVzdCB0aGUgeCBhbmQgeSBkb21haW4uXG4gICAgdGhpcy54U2NhbGUuZG9tYWluKFsxLCB0aGlzLmRhdGEubGVuZ3RoXSk7XG4gICAgdGhpcy55U2NhbGUuZG9tYWluKFt0aGlzLm1pblksIHRoaXMubWF4WV0pO1xuICAgIC8vIEFkanVzdCBhbGwgdGhlIDxwYXRoPiBlbGVtZW50cyAobGluZXMpLlxuICAgIGxldCBnZXRQYXRoTWFwID0gKGxpbmVJbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICByZXR1cm4gZDMuc3ZnLmxpbmU8RGF0YVBvaW50PigpXG4gICAgICAueChkID0+IHRoaXMueFNjYWxlKGQueCkpXG4gICAgICAueShkID0+IHRoaXMueVNjYWxlKGQueVtsaW5lSW5kZXhdKSk7XG4gICAgfTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubnVtTGluZXM7IGkrKykge1xuICAgICAgdGhpcy5wYXRoc1tpXS5kYXR1bSh0aGlzLmRhdGEpLmF0dHIoXCJkXCIsIGdldFBhdGhNYXAoaSkpO1xuICAgIH1cbiAgfVxufSIsIi8qIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuLyoqXG4gKiBBIG5vZGUgaW4gYSBuZXVyYWwgbmV0d29yay4gRWFjaCBub2RlIGhhcyBhIHN0YXRlXG4gKiAodG90YWwgaW5wdXQsIG91dHB1dCwgYW5kIHRoZWlyIHJlc3BlY3RpdmVseSBkZXJpdmF0aXZlcykgd2hpY2ggY2hhbmdlc1xuICogYWZ0ZXIgZXZlcnkgZm9yd2FyZCBhbmQgYmFjayBwcm9wYWdhdGlvbiBydW4uXG4gKi9cbmV4cG9ydCBjbGFzcyBOb2RlIHtcbiAgaWQ6IHN0cmluZztcbiAgLyoqIExpc3Qgb2YgaW5wdXQgbGlua3MuICovXG4gIGlucHV0TGlua3M6IExpbmtbXSA9IFtdO1xuICBiaWFzID0gMC4xO1xuICAvKiogTGlzdCBvZiBvdXRwdXQgbGlua3MuICovXG4gIG91dHB1dHM6IExpbmtbXSA9IFtdO1xuICB0b3RhbElucHV0OiBudW1iZXI7XG4gIG91dHB1dDogbnVtYmVyO1xuICAvKiogRXJyb3IgZGVyaXZhdGl2ZSB3aXRoIHJlc3BlY3QgdG8gdGhpcyBub2RlJ3Mgb3V0cHV0LiAqL1xuICBvdXRwdXREZXIgPSAwO1xuICAvKiogRXJyb3IgZGVyaXZhdGl2ZSB3aXRoIHJlc3BlY3QgdG8gdGhpcyBub2RlJ3MgdG90YWwgaW5wdXQuICovXG4gIGlucHV0RGVyID0gMDtcbiAgLyoqXG4gICAqIEFjY3VtdWxhdGVkIGVycm9yIGRlcml2YXRpdmUgd2l0aCByZXNwZWN0IHRvIHRoaXMgbm9kZSdzIHRvdGFsIGlucHV0IHNpbmNlXG4gICAqIHRoZSBsYXN0IHVwZGF0ZS4gVGhpcyBkZXJpdmF0aXZlIGVxdWFscyBkRS9kYiB3aGVyZSBiIGlzIHRoZSBub2RlJ3NcbiAgICogYmlhcyB0ZXJtLlxuICAgKi9cbiAgYWNjSW5wdXREZXIgPSAwO1xuICAvKipcbiAgICogTnVtYmVyIG9mIGFjY3VtdWxhdGVkIGVyci4gZGVyaXZhdGl2ZXMgd2l0aCByZXNwZWN0IHRvIHRoZSB0b3RhbCBpbnB1dFxuICAgKiBzaW5jZSB0aGUgbGFzdCB1cGRhdGUuXG4gICAqL1xuICBudW1BY2N1bXVsYXRlZERlcnMgPSAwO1xuICAvKiogQWN0aXZhdGlvbiBmdW5jdGlvbiB0aGF0IHRha2VzIHRvdGFsIGlucHV0IGFuZCByZXR1cm5zIG5vZGUncyBvdXRwdXQgKi9cbiAgYWN0aXZhdGlvbjogQWN0aXZhdGlvbkZ1bmN0aW9uO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IG5vZGUgd2l0aCB0aGUgcHJvdmlkZWQgaWQgYW5kIGFjdGl2YXRpb24gZnVuY3Rpb24uXG4gICAqL1xuICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBhY3RpdmF0aW9uOiBBY3RpdmF0aW9uRnVuY3Rpb24sIGluaXRaZXJvPzogYm9vbGVhbikge1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLmFjdGl2YXRpb24gPSBhY3RpdmF0aW9uO1xuICAgIGlmIChpbml0WmVybykge1xuICAgICAgdGhpcy5iaWFzID0gMDtcbiAgICB9XG4gIH1cblxuICAvKiogUmVjb21wdXRlcyB0aGUgbm9kZSdzIG91dHB1dCBhbmQgcmV0dXJucyBpdC4gKi9cbiAgdXBkYXRlT3V0cHV0KCk6IG51bWJlciB7XG4gICAgLy8gU3RvcmVzIHRvdGFsIGlucHV0IGludG8gdGhlIG5vZGUuXG4gICAgdGhpcy50b3RhbElucHV0ID0gdGhpcy5iaWFzO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5pbnB1dExpbmtzLmxlbmd0aDsgaisrKSB7XG4gICAgICBsZXQgbGluayA9IHRoaXMuaW5wdXRMaW5rc1tqXTtcbiAgICAgIHRoaXMudG90YWxJbnB1dCArPSBsaW5rLndlaWdodCAqIGxpbmsuc291cmNlLm91dHB1dDtcbiAgICB9XG4gICAgdGhpcy5vdXRwdXQgPSB0aGlzLmFjdGl2YXRpb24ub3V0cHV0KHRoaXMudG90YWxJbnB1dCk7XG4gICAgcmV0dXJuIHRoaXMub3V0cHV0O1xuICB9XG59XG5cbi8qKlxuICogQW4gZXJyb3IgZnVuY3Rpb24gYW5kIGl0cyBkZXJpdmF0aXZlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVycm9yRnVuY3Rpb24ge1xuICBlcnJvcjogKG91dHB1dDogbnVtYmVyLCB0YXJnZXQ6IG51bWJlcikgPT4gbnVtYmVyO1xuICBkZXI6IChvdXRwdXQ6IG51bWJlciwgdGFyZ2V0OiBudW1iZXIpID0+IG51bWJlcjtcbn1cblxuLyoqIEEgbm9kZSdzIGFjdGl2YXRpb24gZnVuY3Rpb24gYW5kIGl0cyBkZXJpdmF0aXZlLiAqL1xuZXhwb3J0IGludGVyZmFjZSBBY3RpdmF0aW9uRnVuY3Rpb24ge1xuICBvdXRwdXQ6IChpbnB1dDogbnVtYmVyKSA9PiBudW1iZXI7XG4gIGRlcjogKGlucHV0OiBudW1iZXIpID0+IG51bWJlcjtcbn1cblxuLyoqIEZ1bmN0aW9uIHRoYXQgY29tcHV0ZXMgYSBwZW5hbHR5IGNvc3QgZm9yIGEgZ2l2ZW4gd2VpZ2h0IGluIHRoZSBuZXR3b3JrLiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZWd1bGFyaXphdGlvbkZ1bmN0aW9uIHtcbiAgb3V0cHV0OiAod2VpZ2h0OiBudW1iZXIpID0+IG51bWJlcjtcbiAgZGVyOiAod2VpZ2h0OiBudW1iZXIpID0+IG51bWJlcjtcbn1cblxuLyoqIEJ1aWx0LWluIGVycm9yIGZ1bmN0aW9ucyAqL1xuZXhwb3J0IGNsYXNzIEVycm9ycyB7XG4gIHB1YmxpYyBzdGF0aWMgU1FVQVJFOiBFcnJvckZ1bmN0aW9uID0ge1xuICAgIGVycm9yOiAob3V0cHV0OiBudW1iZXIsIHRhcmdldDogbnVtYmVyKSA9PlxuICAgICAgICAgICAgICAgMC41ICogTWF0aC5wb3cob3V0cHV0IC0gdGFyZ2V0LCAyKSxcbiAgICBkZXI6IChvdXRwdXQ6IG51bWJlciwgdGFyZ2V0OiBudW1iZXIpID0+IG91dHB1dCAtIHRhcmdldFxuICB9O1xufVxuXG4vKiogUG9seWZpbGwgZm9yIFRBTkggKi9cbig8YW55Pk1hdGgpLnRhbmggPSAoPGFueT5NYXRoKS50YW5oIHx8IGZ1bmN0aW9uKHgpIHtcbiAgaWYgKHggPT09IEluZmluaXR5KSB7XG4gICAgcmV0dXJuIDE7XG4gIH0gZWxzZSBpZiAoeCA9PT0gLUluZmluaXR5KSB7XG4gICAgcmV0dXJuIC0xO1xuICB9IGVsc2Uge1xuICAgIGxldCBlMnggPSBNYXRoLmV4cCgyICogeCk7XG4gICAgcmV0dXJuIChlMnggLSAxKSAvIChlMnggKyAxKTtcbiAgfVxufTtcblxuLyoqIEJ1aWx0LWluIGFjdGl2YXRpb24gZnVuY3Rpb25zICovXG5leHBvcnQgY2xhc3MgQWN0aXZhdGlvbnMge1xuICBwdWJsaWMgc3RhdGljIFRBTkg6IEFjdGl2YXRpb25GdW5jdGlvbiA9IHtcbiAgICBvdXRwdXQ6IHggPT4gKDxhbnk+TWF0aCkudGFuaCh4KSxcbiAgICBkZXI6IHggPT4ge1xuICAgICAgbGV0IG91dHB1dCA9IEFjdGl2YXRpb25zLlRBTkgub3V0cHV0KHgpO1xuICAgICAgcmV0dXJuIDEgLSBvdXRwdXQgKiBvdXRwdXQ7XG4gICAgfVxuICB9O1xuICBwdWJsaWMgc3RhdGljIFJFTFU6IEFjdGl2YXRpb25GdW5jdGlvbiA9IHtcbiAgICBvdXRwdXQ6IHggPT4gTWF0aC5tYXgoMCwgeCksXG4gICAgZGVyOiB4ID0+IHggPD0gMCA/IDAgOiAxXG4gIH07XG4gIHB1YmxpYyBzdGF0aWMgU0lHTU9JRDogQWN0aXZhdGlvbkZ1bmN0aW9uID0ge1xuICAgIG91dHB1dDogeCA9PiAxIC8gKDEgKyBNYXRoLmV4cCgteCkpLFxuICAgIGRlcjogeCA9PiB7XG4gICAgICBsZXQgb3V0cHV0ID0gQWN0aXZhdGlvbnMuU0lHTU9JRC5vdXRwdXQoeCk7XG4gICAgICByZXR1cm4gb3V0cHV0ICogKDEgLSBvdXRwdXQpO1xuICAgIH1cbiAgfTtcbiAgcHVibGljIHN0YXRpYyBMSU5FQVI6IEFjdGl2YXRpb25GdW5jdGlvbiA9IHtcbiAgICBvdXRwdXQ6IHggPT4geCxcbiAgICBkZXI6IHggPT4gMVxuICB9O1xufVxuXG4vKiogQnVpbGQtaW4gcmVndWxhcml6YXRpb24gZnVuY3Rpb25zICovXG5leHBvcnQgY2xhc3MgUmVndWxhcml6YXRpb25GdW5jdGlvbiB7XG4gIHB1YmxpYyBzdGF0aWMgTDE6IFJlZ3VsYXJpemF0aW9uRnVuY3Rpb24gPSB7XG4gICAgb3V0cHV0OiB3ID0+IE1hdGguYWJzKHcpLFxuICAgIGRlcjogdyA9PiB3IDwgMCA/IC0xIDogMVxuICB9O1xuICBwdWJsaWMgc3RhdGljIEwyOiBSZWd1bGFyaXphdGlvbkZ1bmN0aW9uID0ge1xuICAgIG91dHB1dDogdyA9PiAwLjUgKiB3ICogdyxcbiAgICBkZXI6IHcgPT4gd1xuICB9O1xufVxuXG4vKipcbiAqIEEgbGluayBpbiBhIG5ldXJhbCBuZXR3b3JrLiBFYWNoIGxpbmsgaGFzIGEgd2VpZ2h0IGFuZCBhIHNvdXJjZSBhbmRcbiAqIGRlc3RpbmF0aW9uIG5vZGUuIEFsc28gaXQgaGFzIGFuIGludGVybmFsIHN0YXRlIChlcnJvciBkZXJpdmF0aXZlXG4gKiB3aXRoIHJlc3BlY3QgdG8gYSBwYXJ0aWN1bGFyIGlucHV0KSB3aGljaCBnZXRzIHVwZGF0ZWQgYWZ0ZXJcbiAqIGEgcnVuIG9mIGJhY2sgcHJvcGFnYXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBMaW5rIHtcbiAgaWQ6IHN0cmluZztcbiAgc291cmNlOiBOb2RlO1xuICBkZXN0OiBOb2RlO1xuICB3ZWlnaHQgPSBNYXRoLnJhbmRvbSgpIC0gMC41O1xuICAvKiogRXJyb3IgZGVyaXZhdGl2ZSB3aXRoIHJlc3BlY3QgdG8gdGhpcyB3ZWlnaHQuICovXG4gIGVycm9yRGVyID0gMDtcbiAgLyoqIEFjY3VtdWxhdGVkIGVycm9yIGRlcml2YXRpdmUgc2luY2UgdGhlIGxhc3QgdXBkYXRlLiAqL1xuICBhY2NFcnJvckRlciA9IDA7XG4gIC8qKiBOdW1iZXIgb2YgYWNjdW11bGF0ZWQgZGVyaXZhdGl2ZXMgc2luY2UgdGhlIGxhc3QgdXBkYXRlLiAqL1xuICBudW1BY2N1bXVsYXRlZERlcnMgPSAwO1xuICByZWd1bGFyaXphdGlvbjogUmVndWxhcml6YXRpb25GdW5jdGlvbjtcblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIGxpbmsgaW4gdGhlIG5ldXJhbCBuZXR3b3JrIGluaXRpYWxpemVkIHdpdGggcmFuZG9tIHdlaWdodC5cbiAgICpcbiAgICogQHBhcmFtIHNvdXJjZSBUaGUgc291cmNlIG5vZGUuXG4gICAqIEBwYXJhbSBkZXN0IFRoZSBkZXN0aW5hdGlvbiBub2RlLlxuICAgKiBAcGFyYW0gcmVndWxhcml6YXRpb24gVGhlIHJlZ3VsYXJpemF0aW9uIGZ1bmN0aW9uIHRoYXQgY29tcHV0ZXMgdGhlXG4gICAqICAgICBwZW5hbHR5IGZvciB0aGlzIHdlaWdodC4gSWYgbnVsbCwgdGhlcmUgd2lsbCBiZSBubyByZWd1bGFyaXphdGlvbi5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHNvdXJjZTogTm9kZSwgZGVzdDogTm9kZSxcbiAgICAgIHJlZ3VsYXJpemF0aW9uOiBSZWd1bGFyaXphdGlvbkZ1bmN0aW9uLCBpbml0WmVybz86IGJvb2xlYW4pIHtcbiAgICB0aGlzLmlkID0gc291cmNlLmlkICsgXCItXCIgKyBkZXN0LmlkO1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIHRoaXMuZGVzdCA9IGRlc3Q7XG4gICAgdGhpcy5yZWd1bGFyaXphdGlvbiA9IHJlZ3VsYXJpemF0aW9uO1xuICAgIGlmIChpbml0WmVybykge1xuICAgICAgdGhpcy53ZWlnaHQgPSAwO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEJ1aWxkcyBhIG5ldXJhbCBuZXR3b3JrLlxuICpcbiAqIEBwYXJhbSBuZXR3b3JrU2hhcGUgVGhlIHNoYXBlIG9mIHRoZSBuZXR3b3JrLiBFLmcuIFsxLCAyLCAzLCAxXSBtZWFuc1xuICogICB0aGUgbmV0d29yayB3aWxsIGhhdmUgb25lIGlucHV0IG5vZGUsIDIgbm9kZXMgaW4gZmlyc3QgaGlkZGVuIGxheWVyLFxuICogICAzIG5vZGVzIGluIHNlY29uZCBoaWRkZW4gbGF5ZXIgYW5kIDEgb3V0cHV0IG5vZGUuXG4gKiBAcGFyYW0gYWN0aXZhdGlvbiBUaGUgYWN0aXZhdGlvbiBmdW5jdGlvbiBvZiBldmVyeSBoaWRkZW4gbm9kZS5cbiAqIEBwYXJhbSBvdXRwdXRBY3RpdmF0aW9uIFRoZSBhY3RpdmF0aW9uIGZ1bmN0aW9uIGZvciB0aGUgb3V0cHV0IG5vZGVzLlxuICogQHBhcmFtIHJlZ3VsYXJpemF0aW9uIFRoZSByZWd1bGFyaXphdGlvbiBmdW5jdGlvbiB0aGF0IGNvbXB1dGVzIGEgcGVuYWx0eVxuICogICAgIGZvciBhIGdpdmVuIHdlaWdodCAocGFyYW1ldGVyKSBpbiB0aGUgbmV0d29yay4gSWYgbnVsbCwgdGhlcmUgd2lsbCBiZVxuICogICAgIG5vIHJlZ3VsYXJpemF0aW9uLlxuICogQHBhcmFtIGlucHV0SWRzIExpc3Qgb2YgaWRzIGZvciB0aGUgaW5wdXQgbm9kZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZE5ldHdvcmsoXG4gICAgbmV0d29ya1NoYXBlOiBudW1iZXJbXSwgYWN0aXZhdGlvbjogQWN0aXZhdGlvbkZ1bmN0aW9uLFxuICAgIG91dHB1dEFjdGl2YXRpb246IEFjdGl2YXRpb25GdW5jdGlvbixcbiAgICByZWd1bGFyaXphdGlvbjogUmVndWxhcml6YXRpb25GdW5jdGlvbixcbiAgICBpbnB1dElkczogc3RyaW5nW10sIGluaXRaZXJvPzogYm9vbGVhbik6IE5vZGVbXVtdIHtcbiAgbGV0IG51bUxheWVycyA9IG5ldHdvcmtTaGFwZS5sZW5ndGg7XG4gIGxldCBpZCA9IDE7XG4gIC8qKiBMaXN0IG9mIGxheWVycywgd2l0aCBlYWNoIGxheWVyIGJlaW5nIGEgbGlzdCBvZiBub2Rlcy4gKi9cbiAgbGV0IG5ldHdvcms6IE5vZGVbXVtdID0gW107XG4gIGZvciAobGV0IGxheWVySWR4ID0gMDsgbGF5ZXJJZHggPCBudW1MYXllcnM7IGxheWVySWR4KyspIHtcbiAgICBsZXQgaXNPdXRwdXRMYXllciA9IGxheWVySWR4ID09PSBudW1MYXllcnMgLSAxO1xuICAgIGxldCBpc0lucHV0TGF5ZXIgPSBsYXllcklkeCA9PT0gMDtcbiAgICBsZXQgY3VycmVudExheWVyOiBOb2RlW10gPSBbXTtcbiAgICBuZXR3b3JrLnB1c2goY3VycmVudExheWVyKTtcbiAgICBsZXQgbnVtTm9kZXMgPSBuZXR3b3JrU2hhcGVbbGF5ZXJJZHhdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtTm9kZXM7IGkrKykge1xuICAgICAgbGV0IG5vZGVJZCA9IGlkLnRvU3RyaW5nKCk7XG4gICAgICBpZiAoaXNJbnB1dExheWVyKSB7XG4gICAgICAgIG5vZGVJZCA9IGlucHV0SWRzW2ldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWQrKztcbiAgICAgIH1cbiAgICAgIGxldCBub2RlID0gbmV3IE5vZGUobm9kZUlkLFxuICAgICAgICAgIGlzT3V0cHV0TGF5ZXIgPyBvdXRwdXRBY3RpdmF0aW9uIDogYWN0aXZhdGlvbiwgaW5pdFplcm8pO1xuICAgICAgY3VycmVudExheWVyLnB1c2gobm9kZSk7XG4gICAgICBpZiAobGF5ZXJJZHggPj0gMSkge1xuICAgICAgICAvLyBBZGQgbGlua3MgZnJvbSBub2RlcyBpbiB0aGUgcHJldmlvdXMgbGF5ZXIgdG8gdGhpcyBub2RlLlxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG5ldHdvcmtbbGF5ZXJJZHggLSAxXS5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGxldCBwcmV2Tm9kZSA9IG5ldHdvcmtbbGF5ZXJJZHggLSAxXVtqXTtcbiAgICAgICAgICBsZXQgbGluayA9IG5ldyBMaW5rKHByZXZOb2RlLCBub2RlLCByZWd1bGFyaXphdGlvbiwgaW5pdFplcm8pO1xuICAgICAgICAgIHByZXZOb2RlLm91dHB1dHMucHVzaChsaW5rKTtcbiAgICAgICAgICBub2RlLmlucHV0TGlua3MucHVzaChsaW5rKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gbmV0d29yaztcbn1cblxuLyoqXG4gKiBSdW5zIGEgZm9yd2FyZCBwcm9wYWdhdGlvbiBvZiB0aGUgcHJvdmlkZWQgaW5wdXQgdGhyb3VnaCB0aGUgcHJvdmlkZWRcbiAqIG5ldHdvcmsuIFRoaXMgbWV0aG9kIG1vZGlmaWVzIHRoZSBpbnRlcm5hbCBzdGF0ZSBvZiB0aGUgbmV0d29yayAtIHRoZVxuICogdG90YWwgaW5wdXQgYW5kIG91dHB1dCBvZiBlYWNoIG5vZGUgaW4gdGhlIG5ldHdvcmsuXG4gKlxuICogQHBhcmFtIG5ldHdvcmsgVGhlIG5ldXJhbCBuZXR3b3JrLlxuICogQHBhcmFtIGlucHV0cyBUaGUgaW5wdXQgYXJyYXkuIEl0cyBsZW5ndGggc2hvdWxkIG1hdGNoIHRoZSBudW1iZXIgb2YgaW5wdXRcbiAqICAgICBub2RlcyBpbiB0aGUgbmV0d29yay5cbiAqIEByZXR1cm4gVGhlIGZpbmFsIG91dHB1dCBvZiB0aGUgbmV0d29yay5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmRQcm9wKG5ldHdvcms6IE5vZGVbXVtdLCBpbnB1dHM6IG51bWJlcltdKTogbnVtYmVyIHtcbiAgbGV0IGlucHV0TGF5ZXIgPSBuZXR3b3JrWzBdO1xuICBpZiAoaW5wdXRzLmxlbmd0aCAhPT0gaW5wdXRMYXllci5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgbnVtYmVyIG9mIGlucHV0cyBtdXN0IG1hdGNoIHRoZSBudW1iZXIgb2Ygbm9kZXMgaW5cIiArXG4gICAgICAgIFwiIHRoZSBpbnB1dCBsYXllclwiKTtcbiAgfVxuICAvLyBVcGRhdGUgdGhlIGlucHV0IGxheWVyLlxuICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0TGF5ZXIubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgbm9kZSA9IGlucHV0TGF5ZXJbaV07XG4gICAgbm9kZS5vdXRwdXQgPSBpbnB1dHNbaV07XG4gIH1cbiAgZm9yIChsZXQgbGF5ZXJJZHggPSAxOyBsYXllcklkeCA8IG5ldHdvcmsubGVuZ3RoOyBsYXllcklkeCsrKSB7XG4gICAgbGV0IGN1cnJlbnRMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHhdO1xuICAgIC8vIFVwZGF0ZSBhbGwgdGhlIG5vZGVzIGluIHRoaXMgbGF5ZXIuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBub2RlID0gY3VycmVudExheWVyW2ldO1xuICAgICAgbm9kZS51cGRhdGVPdXRwdXQoKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5ldHdvcmtbbmV0d29yay5sZW5ndGggLSAxXVswXS5vdXRwdXQ7XG59XG5cbi8qKlxuICogUnVucyBhIGJhY2t3YXJkIHByb3BhZ2F0aW9uIHVzaW5nIHRoZSBwcm92aWRlZCB0YXJnZXQgYW5kIHRoZVxuICogY29tcHV0ZWQgb3V0cHV0IG9mIHRoZSBwcmV2aW91cyBjYWxsIHRvIGZvcndhcmQgcHJvcGFnYXRpb24uXG4gKiBUaGlzIG1ldGhvZCBtb2RpZmllcyB0aGUgaW50ZXJuYWwgc3RhdGUgb2YgdGhlIG5ldHdvcmsgLSB0aGUgZXJyb3JcbiAqIGRlcml2YXRpdmVzIHdpdGggcmVzcGVjdCB0byBlYWNoIG5vZGUsIGFuZCBlYWNoIHdlaWdodFxuICogaW4gdGhlIG5ldHdvcmsuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiYWNrUHJvcChuZXR3b3JrOiBOb2RlW11bXSwgdGFyZ2V0OiBudW1iZXIsXG4gICAgZXJyb3JGdW5jOiBFcnJvckZ1bmN0aW9uKTogdm9pZCB7XG4gIC8vIFRoZSBvdXRwdXQgbm9kZSBpcyBhIHNwZWNpYWwgY2FzZS4gV2UgdXNlIHRoZSB1c2VyLWRlZmluZWQgZXJyb3JcbiAgLy8gZnVuY3Rpb24gZm9yIHRoZSBkZXJpdmF0aXZlLlxuICBsZXQgb3V0cHV0Tm9kZSA9IG5ldHdvcmtbbmV0d29yay5sZW5ndGggLSAxXVswXTtcbiAgb3V0cHV0Tm9kZS5vdXRwdXREZXIgPSBlcnJvckZ1bmMuZGVyKG91dHB1dE5vZGUub3V0cHV0LCB0YXJnZXQpO1xuXG4gIC8vIEdvIHRocm91Z2ggdGhlIGxheWVycyBiYWNrd2FyZHMuXG4gIGZvciAobGV0IGxheWVySWR4ID0gbmV0d29yay5sZW5ndGggLSAxOyBsYXllcklkeCA+PSAxOyBsYXllcklkeC0tKSB7XG4gICAgbGV0IGN1cnJlbnRMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHhdO1xuICAgIC8vIENvbXB1dGUgdGhlIGVycm9yIGRlcml2YXRpdmUgb2YgZWFjaCBub2RlIHdpdGggcmVzcGVjdCB0bzpcbiAgICAvLyAxKSBpdHMgdG90YWwgaW5wdXRcbiAgICAvLyAyKSBlYWNoIG9mIGl0cyBpbnB1dCB3ZWlnaHRzLlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExheWVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgbm9kZSA9IGN1cnJlbnRMYXllcltpXTtcbiAgICAgIG5vZGUuaW5wdXREZXIgPSBub2RlLm91dHB1dERlciAqIG5vZGUuYWN0aXZhdGlvbi5kZXIobm9kZS50b3RhbElucHV0KTtcbiAgICAgIG5vZGUuYWNjSW5wdXREZXIgKz0gbm9kZS5pbnB1dERlcjtcbiAgICAgIG5vZGUubnVtQWNjdW11bGF0ZWREZXJzKys7XG4gICAgfVxuXG4gICAgLy8gRXJyb3IgZGVyaXZhdGl2ZSB3aXRoIHJlc3BlY3QgdG8gZWFjaCB3ZWlnaHQgY29taW5nIGludG8gdGhlIG5vZGUuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBub2RlID0gY3VycmVudExheWVyW2ldO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBub2RlLmlucHV0TGlua3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgbGV0IGxpbmsgPSBub2RlLmlucHV0TGlua3Nbal07XG4gICAgICAgIGxpbmsuZXJyb3JEZXIgPSBub2RlLmlucHV0RGVyICogbGluay5zb3VyY2Uub3V0cHV0O1xuICAgICAgICBsaW5rLmFjY0Vycm9yRGVyICs9IGxpbmsuZXJyb3JEZXI7XG4gICAgICAgIGxpbmsubnVtQWNjdW11bGF0ZWREZXJzKys7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChsYXllcklkeCA9PT0gMSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGxldCBwcmV2TGF5ZXIgPSBuZXR3b3JrW2xheWVySWR4IC0gMV07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmV2TGF5ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBub2RlID0gcHJldkxheWVyW2ldO1xuICAgICAgLy8gQ29tcHV0ZSB0aGUgZXJyb3IgZGVyaXZhdGl2ZSB3aXRoIHJlc3BlY3QgdG8gZWFjaCBub2RlJ3Mgb3V0cHV0LlxuICAgICAgbm9kZS5vdXRwdXREZXIgPSAwO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBub2RlLm91dHB1dHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgbGV0IG91dHB1dCA9IG5vZGUub3V0cHV0c1tqXTtcbiAgICAgICAgbm9kZS5vdXRwdXREZXIgKz0gb3V0cHV0LndlaWdodCAqIG91dHB1dC5kZXN0LmlucHV0RGVyO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFVwZGF0ZXMgdGhlIHdlaWdodHMgb2YgdGhlIG5ldHdvcmsgdXNpbmcgdGhlIHByZXZpb3VzbHkgYWNjdW11bGF0ZWQgZXJyb3JcbiAqIGRlcml2YXRpdmVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlV2VpZ2h0cyhuZXR3b3JrOiBOb2RlW11bXSwgbGVhcm5pbmdSYXRlOiBudW1iZXIsXG4gICAgcmVndWxhcml6YXRpb25SYXRlOiBudW1iZXIpIHtcbiAgZm9yIChsZXQgbGF5ZXJJZHggPSAxOyBsYXllcklkeCA8IG5ldHdvcmsubGVuZ3RoOyBsYXllcklkeCsrKSB7XG4gICAgbGV0IGN1cnJlbnRMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHhdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExheWVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgbm9kZSA9IGN1cnJlbnRMYXllcltpXTtcbiAgICAgIC8vIFVwZGF0ZSB0aGUgbm9kZSdzIGJpYXMuXG4gICAgICBpZiAobm9kZS5udW1BY2N1bXVsYXRlZERlcnMgPiAwKSB7XG4gICAgICAgIG5vZGUuYmlhcyAtPSBsZWFybmluZ1JhdGUgKiBub2RlLmFjY0lucHV0RGVyIC8gbm9kZS5udW1BY2N1bXVsYXRlZERlcnM7XG4gICAgICAgIG5vZGUuYWNjSW5wdXREZXIgPSAwO1xuICAgICAgICBub2RlLm51bUFjY3VtdWxhdGVkRGVycyA9IDA7XG4gICAgICB9XG4gICAgICAvLyBVcGRhdGUgdGhlIHdlaWdodHMgY29taW5nIGludG8gdGhpcyBub2RlLlxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBub2RlLmlucHV0TGlua3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgbGV0IGxpbmsgPSBub2RlLmlucHV0TGlua3Nbal07XG4gICAgICAgIGxldCByZWd1bERlciA9IGxpbmsucmVndWxhcml6YXRpb24gP1xuICAgICAgICAgICAgbGluay5yZWd1bGFyaXphdGlvbi5kZXIobGluay53ZWlnaHQpIDogMDtcbiAgICAgICAgaWYgKGxpbmsubnVtQWNjdW11bGF0ZWREZXJzID4gMCkge1xuICAgICAgICAgIGxpbmsud2VpZ2h0IC09IChsZWFybmluZ1JhdGUgLyBsaW5rLm51bUFjY3VtdWxhdGVkRGVycykgKlxuICAgICAgICAgICAgKGxpbmsuYWNjRXJyb3JEZXIgKyByZWd1bGFyaXphdGlvblJhdGUgKiByZWd1bERlcik7XG4gICAgICAgICAgbGluay5hY2NFcnJvckRlciA9IDA7XG4gICAgICAgICAgbGluay5udW1BY2N1bXVsYXRlZERlcnMgPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKiBJdGVyYXRlcyBvdmVyIGV2ZXJ5IG5vZGUgaW4gdGhlIG5ldHdvcmsvICovXG5leHBvcnQgZnVuY3Rpb24gZm9yRWFjaE5vZGUobmV0d29yazogTm9kZVtdW10sIGlnbm9yZUlucHV0czogYm9vbGVhbixcbiAgICBhY2Nlc3NvcjogKG5vZGU6IE5vZGUpID0+IGFueSkge1xuICBmb3IgKGxldCBsYXllcklkeCA9IGlnbm9yZUlucHV0cyA/IDEgOiAwO1xuICAgICAgbGF5ZXJJZHggPCBuZXR3b3JrLmxlbmd0aDtcbiAgICAgIGxheWVySWR4KyspIHtcbiAgICBsZXQgY3VycmVudExheWVyID0gbmV0d29ya1tsYXllcklkeF07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBub2RlID0gY3VycmVudExheWVyW2ldO1xuICAgICAgYWNjZXNzb3Iobm9kZSk7XG4gICAgfVxuICB9XG59XG5cbi8qKiBSZXR1cm5zIHRoZSBvdXRwdXQgbm9kZSBpbiB0aGUgbmV0d29yay4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRPdXRwdXROb2RlKG5ldHdvcms6IE5vZGVbXVtdKSB7XG4gIHJldHVybiBuZXR3b3JrW25ldHdvcmsubGVuZ3RoIC0gMV1bMF07XG59XG4iLCIvKiBDb3B5cmlnaHQgMjAxNiBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xueW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0eXBpbmdzL2Jyb3dzZXIuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwic2VlZHJhbmRvbS5kLnRzXCIgLz5cblxuaW1wb3J0ICogYXMgbm4gZnJvbSBcIi4vbm5cIjtcbmltcG9ydCB7SGVhdE1hcCwgcmVkdWNlTWF0cml4fSBmcm9tIFwiLi9oZWF0bWFwXCI7XG5pbXBvcnQge1xuICBTdGF0ZSxcbiAgZGF0YXNldHMsXG4gIHJlZ0RhdGFzZXRzLFxuICBhY3RpdmF0aW9ucyxcbiAgcHJvYmxlbXMsXG4gIHJlZ3VsYXJpemF0aW9ucyxcbiAgZ2V0S2V5RnJvbVZhbHVlLFxuICBQcm9ibGVtXG59IGZyb20gXCIuL3N0YXRlXCI7XG5pbXBvcnQge0V4YW1wbGUyRCwgc2h1ZmZsZX0gZnJvbSBcIi4vZGF0YXNldFwiO1xuaW1wb3J0IHtBcHBlbmRpbmdMaW5lQ2hhcnR9IGZyb20gXCIuL2xpbmVjaGFydFwiO1xuXG5sZXQgbWFpbldpZHRoO1xuXG4vLyBNb3JlIHNjcm9sbGluZ1xuZDMuc2VsZWN0KFwiLm1vcmUgYnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gIGxldCBwb3NpdGlvbiA9IDgwMDtcbiAgZDMudHJhbnNpdGlvbigpXG4gICAgLmR1cmF0aW9uKDEwMDApXG4gICAgLnR3ZWVuKFwic2Nyb2xsXCIsIHNjcm9sbFR3ZWVuKHBvc2l0aW9uKSk7XG59KTtcblxuZnVuY3Rpb24gc2Nyb2xsVHdlZW4ob2Zmc2V0KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBsZXQgaSA9IGQzLmludGVycG9sYXRlTnVtYmVyKHdpbmRvdy5wYWdlWU9mZnNldCB8fFxuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wLCBvZmZzZXQpO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7IHNjcm9sbFRvKDAsIGkodCkpOyB9O1xuICB9O1xufVxuXG5jb25zdCBSRUNUX1NJWkUgPSAzMDtcbmNvbnN0IEJJQVNfU0laRSA9IDU7XG5jb25zdCBOVU1fU0FNUExFU19DTEFTU0lGWSA9IDUwMDtcbmNvbnN0IE5VTV9TQU1QTEVTX1JFR1JFU1MgPSAxMjAwO1xuY29uc3QgREVOU0lUWSA9IDEwMDtcblxuZW51bSBIb3ZlclR5cGUge1xuICBCSUFTLCBXRUlHSFRcbn1cblxuaW50ZXJmYWNlIElucHV0RmVhdHVyZSB7XG4gIGY6ICh4OiBudW1iZXIsIHk6IG51bWJlcikgPT4gbnVtYmVyO1xuICBsYWJlbD86IHN0cmluZztcbn1cblxubGV0IElOUFVUUzoge1tuYW1lOiBzdHJpbmddOiBJbnB1dEZlYXR1cmV9ID0ge1xuICBcInhcIjoge2Y6ICh4LCB5KSA9PiB4LCBsYWJlbDogXCJYXzFcIn0sXG4gIFwieVwiOiB7ZjogKHgsIHkpID0+IHksIGxhYmVsOiBcIlhfMlwifSxcbiAgXCJ4U3F1YXJlZFwiOiB7ZjogKHgsIHkpID0+IHggKiB4LCBsYWJlbDogXCJYXzFeMlwifSxcbiAgXCJ5U3F1YXJlZFwiOiB7ZjogKHgsIHkpID0+IHkgKiB5LCAgbGFiZWw6IFwiWF8yXjJcIn0sXG4gIFwieFRpbWVzWVwiOiB7ZjogKHgsIHkpID0+IHggKiB5LCBsYWJlbDogXCJYXzFYXzJcIn0sXG4gIFwic2luWFwiOiB7ZjogKHgsIHkpID0+IE1hdGguc2luKHgpLCBsYWJlbDogXCJzaW4oWF8xKVwifSxcbiAgXCJzaW5ZXCI6IHtmOiAoeCwgeSkgPT4gTWF0aC5zaW4oeSksIGxhYmVsOiBcInNpbihYXzIpXCJ9LFxufTtcblxubGV0IEhJREFCTEVfQ09OVFJPTFMgPSBbXG4gIFtcIlNob3cgdGVzdCBkYXRhXCIsIFwic2hvd1Rlc3REYXRhXCJdLFxuICBbXCJEaXNjcmV0aXplIG91dHB1dFwiLCBcImRpc2NyZXRpemVcIl0sXG4gIFtcIlBsYXkgYnV0dG9uXCIsIFwicGxheUJ1dHRvblwiXSxcbiAgW1wiU3RlcCBidXR0b25cIiwgXCJzdGVwQnV0dG9uXCJdLFxuICBbXCJSZXNldCBidXR0b25cIiwgXCJyZXNldEJ1dHRvblwiXSxcbiAgW1wiTGVhcm5pbmcgcmF0ZVwiLCBcImxlYXJuaW5nUmF0ZVwiXSxcbiAgW1wiQWN0aXZhdGlvblwiLCBcImFjdGl2YXRpb25cIl0sXG4gIFtcIlJlZ3VsYXJpemF0aW9uXCIsIFwicmVndWxhcml6YXRpb25cIl0sXG4gIFtcIlJlZ3VsYXJpemF0aW9uIHJhdGVcIiwgXCJyZWd1bGFyaXphdGlvblJhdGVcIl0sXG4gIFtcIlByb2JsZW0gdHlwZVwiLCBcInByb2JsZW1cIl0sXG4gIFtcIldoaWNoIGRhdGFzZXRcIiwgXCJkYXRhc2V0XCJdLFxuICBbXCJSYXRpbyB0cmFpbiBkYXRhXCIsIFwicGVyY1RyYWluRGF0YVwiXSxcbiAgW1wiTm9pc2UgbGV2ZWxcIiwgXCJub2lzZVwiXSxcbiAgW1wiQmF0Y2ggc2l6ZVwiLCBcImJhdGNoU2l6ZVwiXSxcbiAgW1wiIyBvZiBoaWRkZW4gbGF5ZXJzXCIsIFwibnVtSGlkZGVuTGF5ZXJzXCJdLFxuXTtcblxuY2xhc3MgUGxheWVyIHtcbiAgcHJpdmF0ZSB0aW1lckluZGV4ID0gMDtcbiAgcHJpdmF0ZSBpc1BsYXlpbmcgPSBmYWxzZTtcbiAgcHJpdmF0ZSBjYWxsYmFjazogKGlzUGxheWluZzogYm9vbGVhbikgPT4gdm9pZCA9IG51bGw7XG5cbiAgLyoqIFBsYXlzL3BhdXNlcyB0aGUgcGxheWVyLiAqL1xuICBwbGF5T3JQYXVzZSgpIHtcbiAgICBpZiAodGhpcy5pc1BsYXlpbmcpIHtcbiAgICAgIHRoaXMuaXNQbGF5aW5nID0gZmFsc2U7XG4gICAgICB0aGlzLnBhdXNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaXNQbGF5aW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMucGxheSgpO1xuICAgIH1cbiAgfVxuXG4gIG9uUGxheVBhdXNlKGNhbGxiYWNrOiAoaXNQbGF5aW5nOiBib29sZWFuKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICB9XG5cbiAgcGxheSgpIHtcbiAgICB0aGlzLnBhdXNlKCk7XG4gICAgdGhpcy5pc1BsYXlpbmcgPSB0cnVlO1xuICAgIGlmICh0aGlzLmNhbGxiYWNrKSB7XG4gICAgICB0aGlzLmNhbGxiYWNrKHRoaXMuaXNQbGF5aW5nKTtcbiAgICB9XG4gICAgdGhpcy5zdGFydCh0aGlzLnRpbWVySW5kZXgpO1xuICB9XG5cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy50aW1lckluZGV4Kys7XG4gICAgdGhpcy5pc1BsYXlpbmcgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5jYWxsYmFjaykge1xuICAgICAgdGhpcy5jYWxsYmFjayh0aGlzLmlzUGxheWluZyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdGFydChsb2NhbFRpbWVySW5kZXg6IG51bWJlcikge1xuICAgIGQzLnRpbWVyKCgpID0+IHtcbiAgICAgIGlmIChsb2NhbFRpbWVySW5kZXggPCB0aGlzLnRpbWVySW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7ICAvLyBEb25lLlxuICAgICAgfVxuICAgICAgb25lU3RlcCgpO1xuICAgICAgcmV0dXJuIGZhbHNlOyAgLy8gTm90IGRvbmUuXG4gICAgfSwgMCk7XG4gIH1cbn1cblxubGV0IHN0YXRlID0gU3RhdGUuZGVzZXJpYWxpemVTdGF0ZSgpO1xuXG4vLyBGaWx0ZXIgb3V0IGlucHV0cyB0aGF0IGFyZSBoaWRkZW4uXG5zdGF0ZS5nZXRIaWRkZW5Qcm9wcygpLmZvckVhY2gocHJvcCA9PiB7XG4gIGlmIChwcm9wIGluIElOUFVUUykge1xuICAgIGRlbGV0ZSBJTlBVVFNbcHJvcF07XG4gIH1cbn0pO1xuXG5sZXQgYm91bmRhcnk6IHtbaWQ6IHN0cmluZ106IG51bWJlcltdW119ID0ge307XG5sZXQgc2VsZWN0ZWROb2RlSWQ6IHN0cmluZyA9IG51bGw7XG4vLyBQbG90IHRoZSBoZWF0bWFwLlxubGV0IHhEb21haW46IFtudW1iZXIsIG51bWJlcl0gPSBbLTYsIDZdO1xubGV0IHlEb21haW46IFtudW1iZXIsIG51bWJlcl0gPSBbLTYsIDZdO1xubGV0IGhlYXRNYXAgPVxuICAgIG5ldyBIZWF0TWFwKDMwMCwgREVOU0lUWSwgeERvbWFpbiwgeURvbWFpbiwgZDMuc2VsZWN0KFwiI2hlYXRtYXBcIiksXG4gICAgICAgIHtzaG93QXhlczogdHJ1ZX0pO1xubGV0IGxpbmtXaWR0aFNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcbiAgLmRvbWFpbihbMCwgNV0pXG4gIC5yYW5nZShbMSwgMTBdKVxuICAuY2xhbXAodHJ1ZSk7XG5sZXQgY29sb3JTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcjxzdHJpbmc+KClcbiAgICAgICAgICAgICAgICAgICAgIC5kb21haW4oWy0xLCAwLCAxXSlcbiAgICAgICAgICAgICAgICAgICAgIC5yYW5nZShbXCIjZjU5MzIyXCIsIFwiI2U4ZWFlYlwiLCBcIiMwODc3YmRcIl0pXG4gICAgICAgICAgICAgICAgICAgICAuY2xhbXAodHJ1ZSk7XG5sZXQgaXRlciA9IDA7XG5sZXQgdHJhaW5EYXRhOiBFeGFtcGxlMkRbXSA9IFtdO1xubGV0IHRlc3REYXRhOiBFeGFtcGxlMkRbXSA9IFtdO1xubGV0IG5ldHdvcms6IG5uLk5vZGVbXVtdID0gbnVsbDtcbmxldCBsb3NzVHJhaW4gPSAwO1xubGV0IGxvc3NUZXN0ID0gMDtcbmxldCBwbGF5ZXIgPSBuZXcgUGxheWVyKCk7XG5sZXQgbGluZUNoYXJ0ID0gbmV3IEFwcGVuZGluZ0xpbmVDaGFydChkMy5zZWxlY3QoXCIjbGluZWNoYXJ0XCIpLFxuICAgIFtcIiM3NzdcIiwgXCJibGFja1wiXSk7XG5cbmZ1bmN0aW9uIG1ha2VHVUkoKSB7XG4gIGQzLnNlbGVjdChcIiNyZXNldC1idXR0b25cIikub24oXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgcmVzZXQoKTtcbiAgICBkMy5zZWxlY3QoXCIjcGxheS1wYXVzZS1idXR0b25cIik7XG4gIH0pO1xuXG4gIGQzLnNlbGVjdChcIiNwbGF5LXBhdXNlLWJ1dHRvblwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAvLyBDaGFuZ2UgdGhlIGJ1dHRvbidzIGNvbnRlbnQuXG4gICAgcGxheWVyLnBsYXlPclBhdXNlKCk7XG4gIH0pO1xuXG4gIHBsYXllci5vblBsYXlQYXVzZShpc1BsYXlpbmcgPT4ge1xuICAgIGQzLnNlbGVjdChcIiNwbGF5LXBhdXNlLWJ1dHRvblwiKS5jbGFzc2VkKFwicGxheWluZ1wiLCBpc1BsYXlpbmcpO1xuICB9KTtcblxuICBkMy5zZWxlY3QoXCIjbmV4dC1zdGVwLWJ1dHRvblwiKS5vbihcImNsaWNrXCIsICgpID0+IHtcbiAgICBwbGF5ZXIucGF1c2UoKTtcbiAgICBvbmVTdGVwKCk7XG4gIH0pO1xuXG4gIGQzLnNlbGVjdChcIiNkYXRhLXJlZ2VuLWJ1dHRvblwiKS5vbihcImNsaWNrXCIsICgpID0+IHtcbiAgICBnZW5lcmF0ZURhdGEoKTtcbiAgfSk7XG5cbiAgZDMuc2VsZWN0KFwiI2RhdGEtbG9hZC1idXR0b25cIikub24oXCJjaGFuZ2VcIiwgaGFuZGxlTG9hZERhdGEsIGZhbHNlKTtcbiAgZDMuc2VsZWN0KFwiI2RhdGEtY29sdW1uXCIpLm9uKFwiZHJhZ292ZXJcIiwgaGFuZGxlRHJhZ092ZXIsIGZhbHNlKTtcbiAgZDMuc2VsZWN0KFwiI2RhdGEtY29sdW1uXCIpLm9uKFwiZHJvcFwiLCBoYW5kbGVMb2FkRGF0YSwgZmFsc2UpO1xuXG4gIGxldCBkYXRhVGh1bWJuYWlscyA9IGQzLnNlbGVjdEFsbChcImNhbnZhc1tkYXRhLWRhdGFzZXRdXCIpO1xuICBkYXRhVGh1bWJuYWlscy5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgIGxldCBuZXdEYXRhc2V0ID0gZGF0YXNldHNbdGhpcy5kYXRhc2V0LmRhdGFzZXRdO1xuICAgIGlmIChuZXdEYXRhc2V0ID09PSBzdGF0ZS5kYXRhc2V0KSB7XG4gICAgICByZXR1cm47IC8vIE5vLW9wLlxuICAgIH1cbiAgICBzdGF0ZS5kYXRhc2V0ID0gIG5ld0RhdGFzZXQ7XG4gICAgZGF0YVRodW1ibmFpbHMuY2xhc3NlZChcInNlbGVjdGVkXCIsIGZhbHNlKTtcbiAgICBkMy5zZWxlY3QodGhpcykuY2xhc3NlZChcInNlbGVjdGVkXCIsIHRydWUpO1xuICAgIGdlbmVyYXRlRGF0YSgpO1xuICAgIHJlc2V0KCk7XG4gIH0pO1xuXG4gIGxldCBkYXRhc2V0S2V5ID0gZ2V0S2V5RnJvbVZhbHVlKGRhdGFzZXRzLCBzdGF0ZS5kYXRhc2V0KTtcbiAgLy8gU2VsZWN0IHRoZSBkYXRhc2V0IGFjY29yZGluZyB0byB0aGUgY3VycmVudCBzdGF0ZS5cbiAgZDMuc2VsZWN0KGBjYW52YXNbZGF0YS1kYXRhc2V0PSR7ZGF0YXNldEtleX1dYClcbiAgICAuY2xhc3NlZChcInNlbGVjdGVkXCIsIHRydWUpO1xuXG4gIGxldCByZWdEYXRhVGh1bWJuYWlscyA9IGQzLnNlbGVjdEFsbChcImNhbnZhc1tkYXRhLXJlZ0RhdGFzZXRdXCIpO1xuICByZWdEYXRhVGh1bWJuYWlscy5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgIGxldCBuZXdEYXRhc2V0ID0gcmVnRGF0YXNldHNbdGhpcy5kYXRhc2V0LnJlZ2RhdGFzZXRdO1xuICAgIGlmIChuZXdEYXRhc2V0ID09PSBzdGF0ZS5yZWdEYXRhc2V0KSB7XG4gICAgICByZXR1cm47IC8vIE5vLW9wLlxuICAgIH1cbiAgICBzdGF0ZS5yZWdEYXRhc2V0ID0gIG5ld0RhdGFzZXQ7XG4gICAgcmVnRGF0YVRodW1ibmFpbHMuY2xhc3NlZChcInNlbGVjdGVkXCIsIGZhbHNlKTtcbiAgICBkMy5zZWxlY3QodGhpcykuY2xhc3NlZChcInNlbGVjdGVkXCIsIHRydWUpO1xuICAgIGdlbmVyYXRlRGF0YSgpO1xuICAgIHJlc2V0KCk7XG4gIH0pO1xuXG4gIGxldCByZWdEYXRhc2V0S2V5ID0gZ2V0S2V5RnJvbVZhbHVlKHJlZ0RhdGFzZXRzLCBzdGF0ZS5yZWdEYXRhc2V0KTtcbiAgLy8gU2VsZWN0IHRoZSBkYXRhc2V0IGFjY29yZGluZyB0byB0aGUgY3VycmVudCBzdGF0ZS5cbiAgZDMuc2VsZWN0KGBjYW52YXNbZGF0YS1yZWdEYXRhc2V0PSR7cmVnRGF0YXNldEtleX1dYClcbiAgICAuY2xhc3NlZChcInNlbGVjdGVkXCIsIHRydWUpO1xuXG4gIGQzLnNlbGVjdChcIiNhZGQtbGF5ZXJzXCIpLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGlmIChzdGF0ZS5udW1IaWRkZW5MYXllcnMgPj0gNikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzdGF0ZS5uZXR3b3JrU2hhcGVbc3RhdGUubnVtSGlkZGVuTGF5ZXJzXSA9IDI7XG4gICAgc3RhdGUubnVtSGlkZGVuTGF5ZXJzKys7XG4gICAgcmVzZXQoKTtcbiAgfSk7XG5cbiAgZDMuc2VsZWN0KFwiI3JlbW92ZS1sYXllcnNcIikub24oXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgaWYgKHN0YXRlLm51bUhpZGRlbkxheWVycyA8PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHN0YXRlLm51bUhpZGRlbkxheWVycy0tO1xuICAgIHN0YXRlLm5ldHdvcmtTaGFwZS5zcGxpY2Uoc3RhdGUubnVtSGlkZGVuTGF5ZXJzKTtcbiAgICByZXNldCgpO1xuICB9KTtcblxuICBsZXQgc2hvd1Rlc3REYXRhID0gZDMuc2VsZWN0KFwiI3Nob3ctdGVzdC1kYXRhXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuICAgIHN0YXRlLnNob3dUZXN0RGF0YSA9IHRoaXMuY2hlY2tlZDtcbiAgICBzdGF0ZS5zZXJpYWxpemUoKTtcbiAgICBoZWF0TWFwLnVwZGF0ZVRlc3RQb2ludHMoc3RhdGUuc2hvd1Rlc3REYXRhID8gdGVzdERhdGEgOiBbXSk7XG4gIH0pO1xuICAvLyBDaGVjay91bmNoZWNrIHRoZSBjaGVja2JveCBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgc3RhdGUuXG4gIHNob3dUZXN0RGF0YS5wcm9wZXJ0eShcImNoZWNrZWRcIiwgc3RhdGUuc2hvd1Rlc3REYXRhKTtcblxuICBsZXQgZGlzY3JldGl6ZSA9IGQzLnNlbGVjdChcIiNkaXNjcmV0aXplXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuICAgIHN0YXRlLmRpc2NyZXRpemUgPSB0aGlzLmNoZWNrZWQ7XG4gICAgc3RhdGUuc2VyaWFsaXplKCk7XG4gICAgdXBkYXRlVUkoKTtcbiAgfSk7XG4gIC8vIENoZWNrL3VuY2hlY2sgdGhlIGNoZWNib3ggYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHN0YXRlLlxuICBkaXNjcmV0aXplLnByb3BlcnR5KFwiY2hlY2tlZFwiLCBzdGF0ZS5kaXNjcmV0aXplKTtcblxuICBsZXQgcGVyY1RyYWluID0gZDMuc2VsZWN0KFwiI3BlcmNUcmFpbkRhdGFcIikub24oXCJpbnB1dFwiLCBmdW5jdGlvbigpIHtcbiAgICBzdGF0ZS5wZXJjVHJhaW5EYXRhID0gdGhpcy52YWx1ZTtcbiAgICBkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J3BlcmNUcmFpbkRhdGEnXSAudmFsdWVcIikudGV4dCh0aGlzLnZhbHVlKTtcbiAgICBnZW5lcmF0ZURhdGEoKTtcbiAgICByZXNldCgpO1xuICB9KTtcbiAgcGVyY1RyYWluLnByb3BlcnR5KFwidmFsdWVcIiwgc3RhdGUucGVyY1RyYWluRGF0YSk7XG4gIGQzLnNlbGVjdChcImxhYmVsW2Zvcj0ncGVyY1RyYWluRGF0YSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLnBlcmNUcmFpbkRhdGEpO1xuXG4gIGxldCBub2lzZSA9IGQzLnNlbGVjdChcIiNub2lzZVwiKS5vbihcImlucHV0XCIsIGZ1bmN0aW9uKCkge1xuICAgIHN0YXRlLm5vaXNlID0gdGhpcy52YWx1ZTtcbiAgICBkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J25vaXNlJ10gLnZhbHVlXCIpLnRleHQodGhpcy52YWx1ZSk7XG4gICAgZ2VuZXJhdGVEYXRhKCk7XG4gICAgcmVzZXQoKTtcbiAgfSk7XG4gIG5vaXNlLnByb3BlcnR5KFwidmFsdWVcIiwgc3RhdGUubm9pc2UpO1xuICBkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J25vaXNlJ10gLnZhbHVlXCIpLnRleHQoc3RhdGUubm9pc2UpO1xuXG4gIGxldCBiYXRjaFNpemUgPSBkMy5zZWxlY3QoXCIjYmF0Y2hTaXplXCIpLm9uKFwiaW5wdXRcIiwgZnVuY3Rpb24oKSB7XG4gICAgc3RhdGUuYmF0Y2hTaXplID0gdGhpcy52YWx1ZTtcbiAgICBkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2JhdGNoU2l6ZSddIC52YWx1ZVwiKS50ZXh0KHRoaXMudmFsdWUpO1xuICAgIHJlc2V0KCk7XG4gIH0pO1xuICBiYXRjaFNpemUucHJvcGVydHkoXCJ2YWx1ZVwiLCBzdGF0ZS5iYXRjaFNpemUpO1xuICBkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2JhdGNoU2l6ZSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLmJhdGNoU2l6ZSk7XG5cbiAgbGV0IGFjdGl2YXRpb25Ecm9wZG93biA9IGQzLnNlbGVjdChcIiNhY3RpdmF0aW9uc1wiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpIHtcbiAgICBzdGF0ZS5hY3RpdmF0aW9uID0gYWN0aXZhdGlvbnNbdGhpcy52YWx1ZV07XG4gICAgcmVzZXQoKTtcbiAgfSk7XG4gIGFjdGl2YXRpb25Ecm9wZG93bi5wcm9wZXJ0eShcInZhbHVlXCIsXG4gICAgICBnZXRLZXlGcm9tVmFsdWUoYWN0aXZhdGlvbnMsIHN0YXRlLmFjdGl2YXRpb24pKTtcblxuICBsZXQgbGVhcm5pbmdSYXRlID0gZDMuc2VsZWN0KFwiI2xlYXJuaW5nUmF0ZVwiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpIHtcbiAgICBzdGF0ZS5sZWFybmluZ1JhdGUgPSArdGhpcy52YWx1ZTtcbiAgfSk7XG4gIGxlYXJuaW5nUmF0ZS5wcm9wZXJ0eShcInZhbHVlXCIsIHN0YXRlLmxlYXJuaW5nUmF0ZSk7XG5cbiAgbGV0IHJlZ3VsYXJEcm9wZG93biA9IGQzLnNlbGVjdChcIiNyZWd1bGFyaXphdGlvbnNcIikub24oXCJjaGFuZ2VcIixcbiAgICAgIGZ1bmN0aW9uKCkge1xuICAgIHN0YXRlLnJlZ3VsYXJpemF0aW9uID0gcmVndWxhcml6YXRpb25zW3RoaXMudmFsdWVdO1xuICAgIHJlc2V0KCk7XG4gIH0pO1xuICByZWd1bGFyRHJvcGRvd24ucHJvcGVydHkoXCJ2YWx1ZVwiLFxuICAgICAgZ2V0S2V5RnJvbVZhbHVlKHJlZ3VsYXJpemF0aW9ucywgc3RhdGUucmVndWxhcml6YXRpb24pKTtcblxuICBsZXQgcmVndWxhclJhdGUgPSBkMy5zZWxlY3QoXCIjcmVndWxhclJhdGVcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XG4gICAgc3RhdGUucmVndWxhcml6YXRpb25SYXRlID0gK3RoaXMudmFsdWU7XG4gICAgcmVzZXQoKTtcbiAgfSk7XG4gIHJlZ3VsYXJSYXRlLnByb3BlcnR5KFwidmFsdWVcIiwgc3RhdGUucmVndWxhcml6YXRpb25SYXRlKTtcblxuICBsZXQgcHJvYmxlbSA9IGQzLnNlbGVjdChcIiNwcm9ibGVtXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuICAgIHN0YXRlLnByb2JsZW0gPSBwcm9ibGVtc1t0aGlzLnZhbHVlXTtcbiAgICBnZW5lcmF0ZURhdGEoKTtcbiAgICBkcmF3RGF0YXNldFRodW1ibmFpbHMoKTtcbiAgICByZXNldCgpO1xuICB9KTtcbiAgcHJvYmxlbS5wcm9wZXJ0eShcInZhbHVlXCIsIGdldEtleUZyb21WYWx1ZShwcm9ibGVtcywgc3RhdGUucHJvYmxlbSkpO1xuXG4gIC8vIEFkZCBzY2FsZSB0byB0aGUgZ3JhZGllbnQgY29sb3IgbWFwLlxuICBsZXQgeCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbLTEsIDFdKS5yYW5nZShbMCwgMTQ0XSk7XG4gIGxldCB4QXhpcyA9IGQzLnN2Zy5heGlzKClcbiAgICAuc2NhbGUoeClcbiAgICAub3JpZW50KFwiYm90dG9tXCIpXG4gICAgLnRpY2tWYWx1ZXMoWy0xLCAwLCAxXSlcbiAgICAudGlja0Zvcm1hdChkMy5mb3JtYXQoXCJkXCIpKTtcbiAgZDMuc2VsZWN0KFwiI2NvbG9ybWFwIGcuY29yZVwiKS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBcInggYXhpc1wiKVxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsMTApXCIpXG4gICAgLmNhbGwoeEF4aXMpO1xuXG4gIC8vIExpc3RlbiBmb3IgY3NzLXJlc3BvbnNpdmUgY2hhbmdlcyBhbmQgcmVkcmF3IHRoZSBzdmcgbmV0d29yay5cblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCAoKSA9PiB7XG4gICAgbGV0IG5ld1dpZHRoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluLXBhcnRcIilcbiAgICAgICAgLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgIGlmIChuZXdXaWR0aCAhPT0gbWFpbldpZHRoKSB7XG4gICAgICBtYWluV2lkdGggPSBuZXdXaWR0aDtcbiAgICAgIGRyYXdOZXR3b3JrKG5ldHdvcmspO1xuICAgICAgdXBkYXRlVUkodHJ1ZSk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQmlhc2VzVUkobmV0d29yazogbm4uTm9kZVtdW10pIHtcbiAgbm4uZm9yRWFjaE5vZGUobmV0d29yaywgdHJ1ZSwgbm9kZSA9PiB7XG4gICAgZDMuc2VsZWN0KGByZWN0I2JpYXMtJHtub2RlLmlkfWApLnN0eWxlKFwiZmlsbFwiLCBjb2xvclNjYWxlKG5vZGUuYmlhcykpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlV2VpZ2h0c1VJKG5ldHdvcms6IG5uLk5vZGVbXVtdLCBjb250YWluZXI6IGQzLlNlbGVjdGlvbjxhbnk+KSB7XG4gIGZvciAobGV0IGxheWVySWR4ID0gMTsgbGF5ZXJJZHggPCBuZXR3b3JrLmxlbmd0aDsgbGF5ZXJJZHgrKykge1xuICAgIGxldCBjdXJyZW50TGF5ZXIgPSBuZXR3b3JrW2xheWVySWR4XTtcbiAgICAvLyBVcGRhdGUgYWxsIHRoZSBub2RlcyBpbiB0aGlzIGxheWVyLlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExheWVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgbm9kZSA9IGN1cnJlbnRMYXllcltpXTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbm9kZS5pbnB1dExpbmtzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGxldCBsaW5rID0gbm9kZS5pbnB1dExpbmtzW2pdO1xuICAgICAgICBjb250YWluZXIuc2VsZWN0KGAjbGluayR7bGluay5zb3VyY2UuaWR9LSR7bGluay5kZXN0LmlkfWApXG4gICAgICAgICAgICAuc3R5bGUoe1xuICAgICAgICAgICAgICBcInN0cm9rZS1kYXNob2Zmc2V0XCI6IC1pdGVyIC8gMyxcbiAgICAgICAgICAgICAgXCJzdHJva2Utd2lkdGhcIjogbGlua1dpZHRoU2NhbGUoTWF0aC5hYnMobGluay53ZWlnaHQpKSxcbiAgICAgICAgICAgICAgXCJzdHJva2VcIjogY29sb3JTY2FsZShsaW5rLndlaWdodClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZGF0dW0obGluayk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRyYXdOb2RlKGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIG5vZGVJZDogc3RyaW5nLCBpc0lucHV0OiBib29sZWFuLFxuICAgIGNvbnRhaW5lcjogZDMuU2VsZWN0aW9uPGFueT4sIG5vZGU/OiBubi5Ob2RlKSB7XG4gIGxldCB4ID0gY3ggLSBSRUNUX1NJWkUgLyAyO1xuICBsZXQgeSA9IGN5IC0gUkVDVF9TSVpFIC8gMjtcblxuICBsZXQgbm9kZUdyb3VwID0gY29udGFpbmVyLmFwcGVuZChcImdcIilcbiAgICAuYXR0cih7XG4gICAgICBcImNsYXNzXCI6IFwibm9kZVwiLFxuICAgICAgXCJpZFwiOiBgbm9kZSR7bm9kZUlkfWAsXG4gICAgICBcInRyYW5zZm9ybVwiOiBgdHJhbnNsYXRlKCR7eH0sJHt5fSlgXG4gICAgfSk7XG5cbiAgLy8gRHJhdyB0aGUgbWFpbiByZWN0YW5nbGUuXG4gIG5vZGVHcm91cC5hcHBlbmQoXCJyZWN0XCIpXG4gICAgLmF0dHIoe1xuICAgICAgeDogMCxcbiAgICAgIHk6IDAsXG4gICAgICB3aWR0aDogUkVDVF9TSVpFLFxuICAgICAgaGVpZ2h0OiBSRUNUX1NJWkUsXG4gICAgfSk7XG4gIGxldCBhY3RpdmVPck5vdENsYXNzID0gc3RhdGVbbm9kZUlkXSA/IFwiYWN0aXZlXCIgOiBcImluYWN0aXZlXCI7XG4gIGlmIChpc0lucHV0KSB7XG4gICAgbGV0IGxhYmVsID0gSU5QVVRTW25vZGVJZF0ubGFiZWwgIT0gbnVsbCA/XG4gICAgICAgIElOUFVUU1tub2RlSWRdLmxhYmVsIDogbm9kZUlkO1xuICAgIC8vIERyYXcgdGhlIGlucHV0IGxhYmVsLlxuICAgIGxldCB0ZXh0ID0gbm9kZUdyb3VwLmFwcGVuZChcInRleHRcIikuYXR0cih7XG4gICAgICBjbGFzczogXCJtYWluLWxhYmVsXCIsXG4gICAgICB4OiAtMTAsXG4gICAgICB5OiBSRUNUX1NJWkUgLyAyLCBcInRleHQtYW5jaG9yXCI6IFwiZW5kXCJcbiAgICB9KTtcbiAgICBpZiAoL1tfXl0vLnRlc3QobGFiZWwpKSB7XG4gICAgICBsZXQgbXlSZSA9IC8oLio/KShbX15dKSguKS9nO1xuICAgICAgbGV0IG15QXJyYXk7XG4gICAgICBsZXQgbGFzdEluZGV4O1xuICAgICAgd2hpbGUgKChteUFycmF5ID0gbXlSZS5leGVjKGxhYmVsKSkgIT09IG51bGwpIHtcbiAgICAgICAgbGFzdEluZGV4ID0gbXlSZS5sYXN0SW5kZXg7XG4gICAgICAgIGxldCBwcmVmaXggPSBteUFycmF5WzFdO1xuICAgICAgICBsZXQgc2VwID0gbXlBcnJheVsyXTtcbiAgICAgICAgbGV0IHN1ZmZpeCA9IG15QXJyYXlbM107XG4gICAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICB0ZXh0LmFwcGVuZChcInRzcGFuXCIpLnRleHQocHJlZml4KTtcbiAgICAgICAgfVxuICAgICAgICB0ZXh0LmFwcGVuZChcInRzcGFuXCIpXG4gICAgICAgIC5hdHRyKFwiYmFzZWxpbmUtc2hpZnRcIiwgc2VwID09IFwiX1wiID8gXCJzdWJcIiA6IFwic3VwZXJcIilcbiAgICAgICAgLnN0eWxlKFwiZm9udC1zaXplXCIsIFwiOXB4XCIpXG4gICAgICAgIC50ZXh0KHN1ZmZpeCk7XG4gICAgICB9XG4gICAgICBpZiAobGFiZWwuc3Vic3RyaW5nKGxhc3RJbmRleCkpIHtcbiAgICAgICAgdGV4dC5hcHBlbmQoXCJ0c3BhblwiKS50ZXh0KGxhYmVsLnN1YnN0cmluZyhsYXN0SW5kZXgpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGV4dC5hcHBlbmQoXCJ0c3BhblwiKS50ZXh0KGxhYmVsKTtcbiAgICB9XG4gICAgbm9kZUdyb3VwLmNsYXNzZWQoYWN0aXZlT3JOb3RDbGFzcywgdHJ1ZSk7XG4gIH1cbiAgaWYgKCFpc0lucHV0KSB7XG4gICAgLy8gRHJhdyB0aGUgbm9kZSdzIGJpYXMuXG4gICAgbm9kZUdyb3VwLmFwcGVuZChcInJlY3RcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgaWQ6IGBiaWFzLSR7bm9kZUlkfWAsXG4gICAgICAgIHg6IC1CSUFTX1NJWkUgLSAyLFxuICAgICAgICB5OiBSRUNUX1NJWkUgLSBCSUFTX1NJWkUgKyAzLFxuICAgICAgICB3aWR0aDogQklBU19TSVpFLFxuICAgICAgICBoZWlnaHQ6IEJJQVNfU0laRSxcbiAgICAgIH0pLm9uKFwibW91c2VlbnRlclwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdXBkYXRlSG92ZXJDYXJkKEhvdmVyVHlwZS5CSUFTLCBub2RlLCBkMy5tb3VzZShjb250YWluZXIubm9kZSgpKSk7XG4gICAgICB9KS5vbihcIm1vdXNlbGVhdmVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHVwZGF0ZUhvdmVyQ2FyZChudWxsKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLy8gRHJhdyB0aGUgbm9kZSdzIGNhbnZhcy5cbiAgbGV0IGRpdiA9IGQzLnNlbGVjdChcIiNuZXR3b3JrXCIpLmluc2VydChcImRpdlwiLCBcIjpmaXJzdC1jaGlsZFwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiaWRcIjogYGNhbnZhcy0ke25vZGVJZH1gLFxuICAgICAgXCJjbGFzc1wiOiBcImNhbnZhc1wiXG4gICAgfSlcbiAgICAuc3R5bGUoe1xuICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIixcbiAgICAgIGxlZnQ6IGAke3ggKyAzfXB4YCxcbiAgICAgIHRvcDogYCR7eSArIDN9cHhgXG4gICAgfSlcbiAgICAub24oXCJtb3VzZWVudGVyXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgc2VsZWN0ZWROb2RlSWQgPSBub2RlSWQ7XG4gICAgICBkaXYuY2xhc3NlZChcImhvdmVyZWRcIiwgdHJ1ZSk7XG4gICAgICBub2RlR3JvdXAuY2xhc3NlZChcImhvdmVyZWRcIiwgdHJ1ZSk7XG4gICAgICB1cGRhdGVEZWNpc2lvbkJvdW5kYXJ5KG5ldHdvcmssIGZhbHNlKTtcbiAgICAgIGhlYXRNYXAudXBkYXRlQmFja2dyb3VuZChib3VuZGFyeVtub2RlSWRdLCBzdGF0ZS5kaXNjcmV0aXplKTtcbiAgICB9KVxuICAgIC5vbihcIm1vdXNlbGVhdmVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBzZWxlY3RlZE5vZGVJZCA9IG51bGw7XG4gICAgICBkaXYuY2xhc3NlZChcImhvdmVyZWRcIiwgZmFsc2UpO1xuICAgICAgbm9kZUdyb3VwLmNsYXNzZWQoXCJob3ZlcmVkXCIsIGZhbHNlKTtcbiAgICAgIHVwZGF0ZURlY2lzaW9uQm91bmRhcnkobmV0d29yaywgZmFsc2UpO1xuICAgICAgaGVhdE1hcC51cGRhdGVCYWNrZ3JvdW5kKGJvdW5kYXJ5W25uLmdldE91dHB1dE5vZGUobmV0d29yaykuaWRdLFxuICAgICAgICAgIHN0YXRlLmRpc2NyZXRpemUpO1xuICAgIH0pO1xuICBpZiAoaXNJbnB1dCkge1xuICAgIGRpdi5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgc3RhdGVbbm9kZUlkXSA9ICFzdGF0ZVtub2RlSWRdO1xuICAgICAgcmVzZXQoKTtcbiAgICB9KTtcbiAgICBkaXYuc3R5bGUoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpO1xuICB9XG4gIGlmIChpc0lucHV0KSB7XG4gICAgZGl2LmNsYXNzZWQoYWN0aXZlT3JOb3RDbGFzcywgdHJ1ZSk7XG4gIH1cbiAgbGV0IG5vZGVIZWF0TWFwID0gbmV3IEhlYXRNYXAoUkVDVF9TSVpFLCBERU5TSVRZIC8gMTAsIHhEb21haW4sXG4gICAgICB4RG9tYWluLCBkaXYsIHtub1N2ZzogdHJ1ZX0pO1xuICBkaXYuZGF0dW0oe2hlYXRtYXA6IG5vZGVIZWF0TWFwLCBpZDogbm9kZUlkfSk7XG5cbn1cblxuLy8gRHJhdyBuZXR3b3JrXG5mdW5jdGlvbiBkcmF3TmV0d29yayhuZXR3b3JrOiBubi5Ob2RlW11bXSk6IHZvaWQge1xuICBsZXQgc3ZnID0gZDMuc2VsZWN0KFwiI3N2Z1wiKTtcbiAgLy8gUmVtb3ZlIGFsbCBzdmcgZWxlbWVudHMuXG4gIHN2Zy5zZWxlY3QoXCJnLmNvcmVcIikucmVtb3ZlKCk7XG4gIC8vIFJlbW92ZSBhbGwgZGl2IGVsZW1lbnRzLlxuICBkMy5zZWxlY3QoXCIjbmV0d29ya1wiKS5zZWxlY3RBbGwoXCJkaXYuY2FudmFzXCIpLnJlbW92ZSgpO1xuICBkMy5zZWxlY3QoXCIjbmV0d29ya1wiKS5zZWxlY3RBbGwoXCJkaXYucGx1cy1taW51cy1uZXVyb25zXCIpLnJlbW92ZSgpO1xuXG4gIC8vIEdldCB0aGUgd2lkdGggb2YgdGhlIHN2ZyBjb250YWluZXIuXG4gIGxldCBwYWRkaW5nID0gMztcbiAgbGV0IGNvID0gPEhUTUxEaXZFbGVtZW50PiBkMy5zZWxlY3QoXCIuY29sdW1uLm91dHB1dFwiKS5ub2RlKCk7XG4gIGxldCBjZiA9IDxIVE1MRGl2RWxlbWVudD4gZDMuc2VsZWN0KFwiLmNvbHVtbi5mZWF0dXJlc1wiKS5ub2RlKCk7XG4gIGxldCB3aWR0aCA9IGNvLm9mZnNldExlZnQgLSBjZi5vZmZzZXRMZWZ0O1xuICBzdmcuYXR0cihcIndpZHRoXCIsIHdpZHRoKTtcblxuICAvLyBNYXAgb2YgYWxsIG5vZGUgY29vcmRpbmF0ZXMuXG4gIGxldCBub2RlMmNvb3JkOiB7W2lkOiBzdHJpbmddOiB7Y3g6IG51bWJlciwgY3k6IG51bWJlcn19ID0ge307XG4gIGxldCBjb250YWluZXIgPSBzdmcuYXBwZW5kKFwiZ1wiKVxuICAgIC5jbGFzc2VkKFwiY29yZVwiLCB0cnVlKVxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoJHtwYWRkaW5nfSwke3BhZGRpbmd9KWApO1xuICAvLyBEcmF3IHRoZSBuZXR3b3JrIGxheWVyIGJ5IGxheWVyLlxuICBsZXQgbnVtTGF5ZXJzID0gbmV0d29yay5sZW5ndGg7XG4gIGxldCBmZWF0dXJlV2lkdGggPSAxMTg7XG4gIGxldCBsYXllclNjYWxlID0gZDMuc2NhbGUub3JkaW5hbDxudW1iZXIsIG51bWJlcj4oKVxuICAgICAgLmRvbWFpbihkMy5yYW5nZSgxLCBudW1MYXllcnMgLSAxKSlcbiAgICAgIC5yYW5nZVBvaW50cyhbZmVhdHVyZVdpZHRoLCB3aWR0aCAtIFJFQ1RfU0laRV0sIDAuNyk7XG4gIGxldCBub2RlSW5kZXhTY2FsZSA9IChub2RlSW5kZXg6IG51bWJlcikgPT4gbm9kZUluZGV4ICogKFJFQ1RfU0laRSArIDI1KTtcblxuXG4gIGxldCBjYWxsb3V0VGh1bWIgPSBkMy5zZWxlY3QoXCIuY2FsbG91dC50aHVtYm5haWxcIikuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcbiAgbGV0IGNhbGxvdXRXZWlnaHRzID0gZDMuc2VsZWN0KFwiLmNhbGxvdXQud2VpZ2h0c1wiKS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuICBsZXQgaWRXaXRoQ2FsbG91dCA9IG51bGw7XG4gIGxldCB0YXJnZXRJZFdpdGhDYWxsb3V0ID0gbnVsbDtcblxuICAvLyBEcmF3IHRoZSBpbnB1dCBsYXllciBzZXBhcmF0ZWx5LlxuICBsZXQgY3ggPSBSRUNUX1NJWkUgLyAyICsgNTA7XG4gIGxldCBub2RlSWRzID0gT2JqZWN0LmtleXMoSU5QVVRTKTtcbiAgbGV0IG1heFkgPSBub2RlSW5kZXhTY2FsZShub2RlSWRzLmxlbmd0aCk7XG4gIG5vZGVJZHMuZm9yRWFjaCgobm9kZUlkLCBpKSA9PiB7XG4gICAgbGV0IGN5ID0gbm9kZUluZGV4U2NhbGUoaSkgKyBSRUNUX1NJWkUgLyAyO1xuICAgIG5vZGUyY29vcmRbbm9kZUlkXSA9IHtjeDogY3gsIGN5OiBjeX07XG4gICAgZHJhd05vZGUoY3gsIGN5LCBub2RlSWQsIHRydWUsIGNvbnRhaW5lcik7XG4gIH0pO1xuXG4gIC8vIERyYXcgdGhlIGludGVybWVkaWF0ZSBsYXllcnMuXG4gIGZvciAobGV0IGxheWVySWR4ID0gMTsgbGF5ZXJJZHggPCBudW1MYXllcnMgLSAxOyBsYXllcklkeCsrKSB7XG4gICAgbGV0IG51bU5vZGVzID0gbmV0d29ya1tsYXllcklkeF0ubGVuZ3RoO1xuICAgIGxldCBjeCA9IGxheWVyU2NhbGUobGF5ZXJJZHgpICsgUkVDVF9TSVpFIC8gMjtcbiAgICBtYXhZID0gTWF0aC5tYXgobWF4WSwgbm9kZUluZGV4U2NhbGUobnVtTm9kZXMpKTtcbiAgICBhZGRQbHVzTWludXNDb250cm9sKGxheWVyU2NhbGUobGF5ZXJJZHgpLCBsYXllcklkeCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1Ob2RlczsgaSsrKSB7XG4gICAgICBsZXQgbm9kZSA9IG5ldHdvcmtbbGF5ZXJJZHhdW2ldO1xuICAgICAgbGV0IGN5ID0gbm9kZUluZGV4U2NhbGUoaSkgKyBSRUNUX1NJWkUgLyAyO1xuICAgICAgbm9kZTJjb29yZFtub2RlLmlkXSA9IHtjeDogY3gsIGN5OiBjeX07XG4gICAgICBkcmF3Tm9kZShjeCwgY3ksIG5vZGUuaWQsIGZhbHNlLCBjb250YWluZXIsIG5vZGUpO1xuXG4gICAgICAvLyBTaG93IGNhbGxvdXQgdG8gdGh1bWJuYWlscy5cbiAgICAgIGxldCBudW1Ob2RlcyA9IG5ldHdvcmtbbGF5ZXJJZHhdLmxlbmd0aDtcbiAgICAgIGxldCBuZXh0TnVtTm9kZXMgPSBuZXR3b3JrW2xheWVySWR4ICsgMV0ubGVuZ3RoO1xuICAgICAgaWYgKGlkV2l0aENhbGxvdXQgPT0gbnVsbCAmJlxuICAgICAgICAgIGkgPT09IG51bU5vZGVzIC0gMSAmJlxuICAgICAgICAgIG5leHROdW1Ob2RlcyA8PSBudW1Ob2Rlcykge1xuICAgICAgICBjYWxsb3V0VGh1bWIuc3R5bGUoe1xuICAgICAgICAgIGRpc3BsYXk6IG51bGwsXG4gICAgICAgICAgdG9wOiBgJHsyMCArIDMgKyBjeX1weGAsXG4gICAgICAgICAgbGVmdDogYCR7Y3h9cHhgXG4gICAgICAgIH0pO1xuICAgICAgICBpZFdpdGhDYWxsb3V0ID0gbm9kZS5pZDtcbiAgICAgIH1cblxuICAgICAgLy8gRHJhdyBsaW5rcy5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbm9kZS5pbnB1dExpbmtzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGxldCBsaW5rID0gbm9kZS5pbnB1dExpbmtzW2pdO1xuICAgICAgICBsZXQgcGF0aDogU1ZHUGF0aEVsZW1lbnQgPSA8YW55PiBkcmF3TGluayhsaW5rLCBub2RlMmNvb3JkLCBuZXR3b3JrLFxuICAgICAgICAgICAgY29udGFpbmVyLCBqID09PSAwLCBqLCBub2RlLmlucHV0TGlua3MubGVuZ3RoKS5ub2RlKCk7XG4gICAgICAgIC8vIFNob3cgY2FsbG91dCB0byB3ZWlnaHRzLlxuICAgICAgICBsZXQgcHJldkxheWVyID0gbmV0d29ya1tsYXllcklkeCAtIDFdO1xuICAgICAgICBsZXQgbGFzdE5vZGVQcmV2TGF5ZXIgPSBwcmV2TGF5ZXJbcHJldkxheWVyLmxlbmd0aCAtIDFdO1xuICAgICAgICBpZiAodGFyZ2V0SWRXaXRoQ2FsbG91dCA9PSBudWxsICYmXG4gICAgICAgICAgICBpID09PSBudW1Ob2RlcyAtIDEgJiZcbiAgICAgICAgICAgIGxpbmsuc291cmNlLmlkID09PSBsYXN0Tm9kZVByZXZMYXllci5pZCAmJlxuICAgICAgICAgICAgKGxpbmsuc291cmNlLmlkICE9PSBpZFdpdGhDYWxsb3V0IHx8IG51bUxheWVycyA8PSA1KSAmJlxuICAgICAgICAgICAgbGluay5kZXN0LmlkICE9PSBpZFdpdGhDYWxsb3V0ICYmXG4gICAgICAgICAgICBwcmV2TGF5ZXIubGVuZ3RoID49IG51bU5vZGVzKSB7XG4gICAgICAgICAgbGV0IG1pZFBvaW50ID0gcGF0aC5nZXRQb2ludEF0TGVuZ3RoKHBhdGguZ2V0VG90YWxMZW5ndGgoKSAqIDAuNyk7XG4gICAgICAgICAgY2FsbG91dFdlaWdodHMuc3R5bGUoe1xuICAgICAgICAgICAgZGlzcGxheTogbnVsbCxcbiAgICAgICAgICAgIHRvcDogYCR7bWlkUG9pbnQueSArIDV9cHhgLFxuICAgICAgICAgICAgbGVmdDogYCR7bWlkUG9pbnQueCArIDN9cHhgXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGFyZ2V0SWRXaXRoQ2FsbG91dCA9IGxpbmsuZGVzdC5pZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIERyYXcgdGhlIG91dHB1dCBub2RlIHNlcGFyYXRlbHkuXG4gIGN4ID0gd2lkdGggKyBSRUNUX1NJWkUgLyAyO1xuICBsZXQgbm9kZSA9IG5ldHdvcmtbbnVtTGF5ZXJzIC0gMV1bMF07XG4gIGxldCBjeSA9IG5vZGVJbmRleFNjYWxlKDApICsgUkVDVF9TSVpFIC8gMjtcbiAgbm9kZTJjb29yZFtub2RlLmlkXSA9IHtjeDogY3gsIGN5OiBjeX07XG4gIC8vIERyYXcgbGlua3MuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5pbnB1dExpbmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGxpbmsgPSBub2RlLmlucHV0TGlua3NbaV07XG4gICAgZHJhd0xpbmsobGluaywgbm9kZTJjb29yZCwgbmV0d29yaywgY29udGFpbmVyLCBpID09PSAwLCBpLFxuICAgICAgICBub2RlLmlucHV0TGlua3MubGVuZ3RoKTtcbiAgfVxuICAvLyBBZGp1c3QgdGhlIGhlaWdodCBvZiB0aGUgc3ZnLlxuICBzdmcuYXR0cihcImhlaWdodFwiLCBtYXhZKTtcblxuICAvLyBBZGp1c3QgdGhlIGhlaWdodCBvZiB0aGUgZmVhdHVyZXMgY29sdW1uLlxuICBsZXQgaGVpZ2h0ID0gTWF0aC5tYXgoXG4gICAgZ2V0UmVsYXRpdmVIZWlnaHQoY2FsbG91dFRodW1iKSxcbiAgICBnZXRSZWxhdGl2ZUhlaWdodChjYWxsb3V0V2VpZ2h0cyksXG4gICAgZ2V0UmVsYXRpdmVIZWlnaHQoZDMuc2VsZWN0KFwiI25ldHdvcmtcIikpXG4gICk7XG4gIGQzLnNlbGVjdChcIi5jb2x1bW4uZmVhdHVyZXNcIikuc3R5bGUoXCJoZWlnaHRcIiwgaGVpZ2h0ICsgXCJweFwiKTtcbn1cblxuZnVuY3Rpb24gZ2V0UmVsYXRpdmVIZWlnaHQoc2VsZWN0aW9uOiBkMy5TZWxlY3Rpb248YW55Pikge1xuICBsZXQgbm9kZSA9IDxIVE1MQW5jaG9yRWxlbWVudD4gc2VsZWN0aW9uLm5vZGUoKTtcbiAgcmV0dXJuIG5vZGUub2Zmc2V0SGVpZ2h0ICsgbm9kZS5vZmZzZXRUb3A7XG59XG5cbmZ1bmN0aW9uIGFkZFBsdXNNaW51c0NvbnRyb2woeDogbnVtYmVyLCBsYXllcklkeDogbnVtYmVyKSB7XG4gIGxldCBkaXYgPSBkMy5zZWxlY3QoXCIjbmV0d29ya1wiKS5hcHBlbmQoXCJkaXZcIilcbiAgICAuY2xhc3NlZChcInBsdXMtbWludXMtbmV1cm9uc1wiLCB0cnVlKVxuICAgIC5zdHlsZShcImxlZnRcIiwgYCR7eCAtIDEwfXB4YCk7XG5cbiAgbGV0IGkgPSBsYXllcklkeCAtIDE7XG4gIGxldCBmaXJzdFJvdyA9IGRpdi5hcHBlbmQoXCJkaXZcIikuYXR0cihcImNsYXNzXCIsIGB1aS1udW1Ob2RlcyR7bGF5ZXJJZHh9YCk7XG4gIGZpcnN0Um93LmFwcGVuZChcImJ1dHRvblwiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm1kbC1idXR0b24gbWRsLWpzLWJ1dHRvbiBtZGwtYnV0dG9uLS1pY29uXCIpXG4gICAgICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGxldCBudW1OZXVyb25zID0gc3RhdGUubmV0d29ya1NoYXBlW2ldO1xuICAgICAgICBpZiAobnVtTmV1cm9ucyA+PSA4KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRlLm5ldHdvcmtTaGFwZVtpXSsrO1xuICAgICAgICByZXNldCgpO1xuICAgICAgfSlcbiAgICAuYXBwZW5kKFwiaVwiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm1hdGVyaWFsLWljb25zXCIpXG4gICAgICAudGV4dChcImFkZFwiKTtcblxuICBmaXJzdFJvdy5hcHBlbmQoXCJidXR0b25cIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJtZGwtYnV0dG9uIG1kbC1qcy1idXR0b24gbWRsLWJ1dHRvbi0taWNvblwiKVxuICAgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBsZXQgbnVtTmV1cm9ucyA9IHN0YXRlLm5ldHdvcmtTaGFwZVtpXTtcbiAgICAgICAgaWYgKG51bU5ldXJvbnMgPD0gMSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzdGF0ZS5uZXR3b3JrU2hhcGVbaV0tLTtcbiAgICAgICAgcmVzZXQoKTtcbiAgICAgIH0pXG4gICAgLmFwcGVuZChcImlcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJtYXRlcmlhbC1pY29uc1wiKVxuICAgICAgLnRleHQoXCJyZW1vdmVcIik7XG5cbiAgbGV0IHN1ZmZpeCA9IHN0YXRlLm5ldHdvcmtTaGFwZVtpXSA+IDEgPyBcInNcIiA6IFwiXCI7XG4gIGRpdi5hcHBlbmQoXCJkaXZcIikudGV4dChcbiAgICBzdGF0ZS5uZXR3b3JrU2hhcGVbaV0gKyBcIiBuZXVyb25cIiArIHN1ZmZpeFxuICApO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVIb3ZlckNhcmQodHlwZTogSG92ZXJUeXBlLCBub2RlT3JMaW5rPzogbm4uTm9kZSB8IG5uLkxpbmssXG4gICAgY29vcmRpbmF0ZXM/OiBbbnVtYmVyLCBudW1iZXJdKSB7XG4gIGxldCBob3ZlcmNhcmQgPSBkMy5zZWxlY3QoXCIjaG92ZXJjYXJkXCIpO1xuICBpZiAodHlwZSA9PSBudWxsKSB7XG4gICAgaG92ZXJjYXJkLnN0eWxlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG4gICAgZDMuc2VsZWN0KFwiI3N2Z1wiKS5vbihcImNsaWNrXCIsIG51bGwpO1xuICAgIHJldHVybjtcbiAgfVxuICBkMy5zZWxlY3QoXCIjc3ZnXCIpLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGhvdmVyY2FyZC5zZWxlY3QoXCIudmFsdWVcIikuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcbiAgICBsZXQgaW5wdXQgPSBob3ZlcmNhcmQuc2VsZWN0KFwiaW5wdXRcIik7XG4gICAgaW5wdXQuc3R5bGUoXCJkaXNwbGF5XCIsIG51bGwpO1xuICAgIGlucHV0Lm9uKFwiaW5wdXRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy52YWx1ZSAhPSBudWxsICYmIHRoaXMudmFsdWUgIT09IFwiXCIpIHtcbiAgICAgICAgaWYgKHR5cGUgPT0gSG92ZXJUeXBlLldFSUdIVCkge1xuICAgICAgICAgICg8bm4uTGluaz5ub2RlT3JMaW5rKS53ZWlnaHQgPSArdGhpcy52YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAoPG5uLk5vZGU+bm9kZU9yTGluaykuYmlhcyA9ICt0aGlzLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHVwZGF0ZVVJKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaW5wdXQub24oXCJrZXlwcmVzc1wiLCAoKSA9PiB7XG4gICAgICBpZiAoKDxhbnk+ZDMuZXZlbnQpLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgdXBkYXRlSG92ZXJDYXJkKHR5cGUsIG5vZGVPckxpbmssIGNvb3JkaW5hdGVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+aW5wdXQubm9kZSgpKS5mb2N1cygpO1xuICB9KTtcbiAgbGV0IHZhbHVlID0gdHlwZSA9PSBIb3ZlclR5cGUuV0VJR0hUID9cbiAgICAoPG5uLkxpbms+bm9kZU9yTGluaykud2VpZ2h0IDpcbiAgICAoPG5uLk5vZGU+bm9kZU9yTGluaykuYmlhcztcbiAgbGV0IG5hbWUgPSB0eXBlID09IEhvdmVyVHlwZS5XRUlHSFQgPyBcIldlaWdodFwiIDogXCJCaWFzXCI7XG4gIGhvdmVyY2FyZC5zdHlsZSh7XG4gICAgXCJsZWZ0XCI6IGAke2Nvb3JkaW5hdGVzWzBdICsgMjB9cHhgLFxuICAgIFwidG9wXCI6IGAke2Nvb3JkaW5hdGVzWzFdfXB4YCxcbiAgICBcImRpc3BsYXlcIjogXCJibG9ja1wiXG4gIH0pO1xuICBob3ZlcmNhcmQuc2VsZWN0KFwiLnR5cGVcIikudGV4dChuYW1lKTtcbiAgaG92ZXJjYXJkLnNlbGVjdChcIi52YWx1ZVwiKVxuICAgIC5zdHlsZShcImRpc3BsYXlcIiwgbnVsbClcbiAgICAudGV4dCh2YWx1ZS50b1ByZWNpc2lvbigyKSk7XG4gIGhvdmVyY2FyZC5zZWxlY3QoXCJpbnB1dFwiKVxuICAgIC5wcm9wZXJ0eShcInZhbHVlXCIsIHZhbHVlLnRvUHJlY2lzaW9uKDIpKVxuICAgIC5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xufVxuXG5mdW5jdGlvbiBkcmF3TGluayhcbiAgICBpbnB1dDogbm4uTGluaywgbm9kZTJjb29yZDoge1tpZDogc3RyaW5nXToge2N4OiBudW1iZXIsIGN5OiBudW1iZXJ9fSxcbiAgICBuZXR3b3JrOiBubi5Ob2RlW11bXSwgY29udGFpbmVyOiBkMy5TZWxlY3Rpb248YW55PixcbiAgICBpc0ZpcnN0OiBib29sZWFuLCBpbmRleDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcikge1xuICBsZXQgbGluZSA9IGNvbnRhaW5lci5pbnNlcnQoXCJwYXRoXCIsIFwiOmZpcnN0LWNoaWxkXCIpO1xuICBsZXQgc291cmNlID0gbm9kZTJjb29yZFtpbnB1dC5zb3VyY2UuaWRdO1xuICBsZXQgZGVzdCA9IG5vZGUyY29vcmRbaW5wdXQuZGVzdC5pZF07XG4gIGxldCBkYXR1bSA9IHtcbiAgICBzb3VyY2U6IHtcbiAgICAgIHk6IHNvdXJjZS5jeCArIFJFQ1RfU0laRSAvIDIgKyAyLFxuICAgICAgeDogc291cmNlLmN5XG4gICAgfSxcbiAgICB0YXJnZXQ6IHtcbiAgICAgIHk6IGRlc3QuY3ggLSBSRUNUX1NJWkUgLyAyLFxuICAgICAgeDogZGVzdC5jeSArICgoaW5kZXggLSAobGVuZ3RoIC0gMSkgLyAyKSAvIGxlbmd0aCkgKiAxMlxuICAgIH1cbiAgfTtcbiAgbGV0IGRpYWdvbmFsID0gZDMuc3ZnLmRpYWdvbmFsKCkucHJvamVjdGlvbihkID0+IFtkLnksIGQueF0pO1xuICBsaW5lLmF0dHIoe1xuICAgIFwibWFya2VyLXN0YXJ0XCI6IFwidXJsKCNtYXJrZXJBcnJvdylcIixcbiAgICBjbGFzczogXCJsaW5rXCIsXG4gICAgaWQ6IFwibGlua1wiICsgaW5wdXQuc291cmNlLmlkICsgXCItXCIgKyBpbnB1dC5kZXN0LmlkLFxuICAgIGQ6IGRpYWdvbmFsKGRhdHVtLCAwKVxuICB9KTtcblxuICAvLyBBZGQgYW4gaW52aXNpYmxlIHRoaWNrIGxpbmsgdGhhdCB3aWxsIGJlIHVzZWQgZm9yXG4gIC8vIHNob3dpbmcgdGhlIHdlaWdodCB2YWx1ZSBvbiBob3Zlci5cbiAgY29udGFpbmVyLmFwcGVuZChcInBhdGhcIilcbiAgICAuYXR0cihcImRcIiwgZGlhZ29uYWwoZGF0dW0sIDApKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJsaW5rLWhvdmVyXCIpXG4gICAgLm9uKFwibW91c2VlbnRlclwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHVwZGF0ZUhvdmVyQ2FyZChIb3ZlclR5cGUuV0VJR0hULCBpbnB1dCwgZDMubW91c2UodGhpcykpO1xuICAgIH0pLm9uKFwibW91c2VsZWF2ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHVwZGF0ZUhvdmVyQ2FyZChudWxsKTtcbiAgICB9KTtcbiAgcmV0dXJuIGxpbmU7XG59XG5cbi8qKlxuICogR2l2ZW4gYSBuZXVyYWwgbmV0d29yaywgaXQgYXNrcyB0aGUgbmV0d29yayBmb3IgdGhlIG91dHB1dCAocHJlZGljdGlvbilcbiAqIG9mIGV2ZXJ5IG5vZGUgaW4gdGhlIG5ldHdvcmsgdXNpbmcgaW5wdXRzIHNhbXBsZWQgb24gYSBzcXVhcmUgZ3JpZC5cbiAqIEl0IHJldHVybnMgYSBtYXAgd2hlcmUgZWFjaCBrZXkgaXMgdGhlIG5vZGUgSUQgYW5kIHRoZSB2YWx1ZSBpcyBhIHNxdWFyZVxuICogbWF0cml4IG9mIHRoZSBvdXRwdXRzIG9mIHRoZSBuZXR3b3JrIGZvciBlYWNoIGlucHV0IGluIHRoZSBncmlkIHJlc3BlY3RpdmVseS5cbiAqL1xuZnVuY3Rpb24gdXBkYXRlRGVjaXNpb25Cb3VuZGFyeShuZXR3b3JrOiBubi5Ob2RlW11bXSwgZmlyc3RUaW1lOiBib29sZWFuKSB7XG4gIGlmIChmaXJzdFRpbWUpIHtcbiAgICBib3VuZGFyeSA9IHt9O1xuICAgIG5uLmZvckVhY2hOb2RlKG5ldHdvcmssIHRydWUsIG5vZGUgPT4ge1xuICAgICAgYm91bmRhcnlbbm9kZS5pZF0gPSBuZXcgQXJyYXkoREVOU0lUWSk7XG4gICAgfSk7XG4gICAgLy8gR28gdGhyb3VnaCBhbGwgcHJlZGVmaW5lZCBpbnB1dHMuXG4gICAgZm9yIChsZXQgbm9kZUlkIGluIElOUFVUUykge1xuICAgICAgYm91bmRhcnlbbm9kZUlkXSA9IG5ldyBBcnJheShERU5TSVRZKTtcbiAgICB9XG4gIH1cbiAgbGV0IHhTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgREVOU0lUWSAtIDFdKS5yYW5nZSh4RG9tYWluKTtcbiAgbGV0IHlTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbREVOU0lUWSAtIDEsIDBdKS5yYW5nZSh4RG9tYWluKTtcblxuICBsZXQgaSA9IDAsIGogPSAwO1xuICBmb3IgKGkgPSAwOyBpIDwgREVOU0lUWTsgaSsrKSB7XG4gICAgaWYgKGZpcnN0VGltZSkge1xuICAgICAgbm4uZm9yRWFjaE5vZGUobmV0d29yaywgdHJ1ZSwgbm9kZSA9PiB7XG4gICAgICAgIGJvdW5kYXJ5W25vZGUuaWRdW2ldID0gbmV3IEFycmF5KERFTlNJVFkpO1xuICAgICAgfSk7XG4gICAgICAvLyBHbyB0aHJvdWdoIGFsbCBwcmVkZWZpbmVkIGlucHV0cy5cbiAgICAgIGZvciAobGV0IG5vZGVJZCBpbiBJTlBVVFMpIHtcbiAgICAgICAgYm91bmRhcnlbbm9kZUlkXVtpXSA9IG5ldyBBcnJheShERU5TSVRZKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChqID0gMDsgaiA8IERFTlNJVFk7IGorKykge1xuICAgICAgLy8gMSBmb3IgcG9pbnRzIGluc2lkZSB0aGUgY2lyY2xlLCBhbmQgMCBmb3IgcG9pbnRzIG91dHNpZGUgdGhlIGNpcmNsZS5cbiAgICAgIGxldCB4ID0geFNjYWxlKGkpO1xuICAgICAgbGV0IHkgPSB5U2NhbGUoaik7XG4gICAgICBsZXQgaW5wdXQgPSBjb25zdHJ1Y3RJbnB1dCh4LCB5KTtcbiAgICAgIG5uLmZvcndhcmRQcm9wKG5ldHdvcmssIGlucHV0KTtcbiAgICAgIG5uLmZvckVhY2hOb2RlKG5ldHdvcmssIHRydWUsIG5vZGUgPT4ge1xuICAgICAgICBib3VuZGFyeVtub2RlLmlkXVtpXVtqXSA9IG5vZGUub3V0cHV0O1xuICAgICAgfSk7XG4gICAgICBpZiAoZmlyc3RUaW1lKSB7XG4gICAgICAgIC8vIEdvIHRocm91Z2ggYWxsIHByZWRlZmluZWQgaW5wdXRzLlxuICAgICAgICBmb3IgKGxldCBub2RlSWQgaW4gSU5QVVRTKSB7XG4gICAgICAgICAgYm91bmRhcnlbbm9kZUlkXVtpXVtqXSA9IElOUFVUU1tub2RlSWRdLmYoeCwgeSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0TG9zcyhuZXR3b3JrOiBubi5Ob2RlW11bXSwgZGF0YVBvaW50czogRXhhbXBsZTJEW10pOiBudW1iZXIge1xuICBsZXQgbG9zcyA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YVBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBkYXRhUG9pbnQgPSBkYXRhUG9pbnRzW2ldO1xuICAgIGxldCBpbnB1dCA9IGNvbnN0cnVjdElucHV0KGRhdGFQb2ludC54LCBkYXRhUG9pbnQueSk7XG4gICAgbGV0IG91dHB1dCA9IG5uLmZvcndhcmRQcm9wKG5ldHdvcmssIGlucHV0KTtcbiAgICBsb3NzICs9IG5uLkVycm9ycy5TUVVBUkUuZXJyb3Iob3V0cHV0LCBkYXRhUG9pbnQubGFiZWwpO1xuICB9XG4gIHJldHVybiBsb3NzIC8gZGF0YVBvaW50cy5sZW5ndGg7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVVJKGZpcnN0U3RlcCA9IGZhbHNlKSB7XG4gIC8vIFVwZGF0ZSB0aGUgbGlua3MgdmlzdWFsbHkuXG4gIHVwZGF0ZVdlaWdodHNVSShuZXR3b3JrLCBkMy5zZWxlY3QoXCJnLmNvcmVcIikpO1xuICAvLyBVcGRhdGUgdGhlIGJpYXMgdmFsdWVzIHZpc3VhbGx5LlxuICB1cGRhdGVCaWFzZXNVSShuZXR3b3JrKTtcbiAgLy8gR2V0IHRoZSBkZWNpc2lvbiBib3VuZGFyeSBvZiB0aGUgbmV0d29yay5cbiAgdXBkYXRlRGVjaXNpb25Cb3VuZGFyeShuZXR3b3JrLCBmaXJzdFN0ZXApO1xuICBsZXQgc2VsZWN0ZWRJZCA9IHNlbGVjdGVkTm9kZUlkICE9IG51bGwgP1xuICAgICAgc2VsZWN0ZWROb2RlSWQgOiBubi5nZXRPdXRwdXROb2RlKG5ldHdvcmspLmlkO1xuICBoZWF0TWFwLnVwZGF0ZUJhY2tncm91bmQoYm91bmRhcnlbc2VsZWN0ZWRJZF0sIHN0YXRlLmRpc2NyZXRpemUpO1xuXG4gIC8vIFVwZGF0ZSBhbGwgZGVjaXNpb24gYm91bmRhcmllcy5cbiAgZDMuc2VsZWN0KFwiI25ldHdvcmtcIikuc2VsZWN0QWxsKFwiZGl2LmNhbnZhc1wiKVxuICAgICAgLmVhY2goZnVuY3Rpb24oZGF0YToge2hlYXRtYXA6IEhlYXRNYXAsIGlkOiBzdHJpbmd9KSB7XG4gICAgZGF0YS5oZWF0bWFwLnVwZGF0ZUJhY2tncm91bmQocmVkdWNlTWF0cml4KGJvdW5kYXJ5W2RhdGEuaWRdLCAxMCksXG4gICAgICAgIHN0YXRlLmRpc2NyZXRpemUpO1xuICB9KTtcblxuICBmdW5jdGlvbiB6ZXJvUGFkKG46IG51bWJlcik6IHN0cmluZyB7XG4gICAgbGV0IHBhZCA9IFwiMDAwMDAwXCI7XG4gICAgcmV0dXJuIChwYWQgKyBuKS5zbGljZSgtcGFkLmxlbmd0aCk7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRDb21tYXMoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gcy5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCBcIixcIik7XG4gIH1cblxuICBmdW5jdGlvbiBodW1hblJlYWRhYmxlKG46IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIG4udG9GaXhlZCgzKTtcbiAgfVxuXG4gIC8vIFVwZGF0ZSBsb3NzIGFuZCBpdGVyYXRpb24gbnVtYmVyLlxuICBkMy5zZWxlY3QoXCIjbG9zcy10cmFpblwiKS50ZXh0KGh1bWFuUmVhZGFibGUobG9zc1RyYWluKSk7XG4gIGQzLnNlbGVjdChcIiNsb3NzLXRlc3RcIikudGV4dChodW1hblJlYWRhYmxlKGxvc3NUZXN0KSk7XG4gIGQzLnNlbGVjdChcIiNpdGVyLW51bWJlclwiKS50ZXh0KGFkZENvbW1hcyh6ZXJvUGFkKGl0ZXIpKSk7XG4gIGxpbmVDaGFydC5hZGREYXRhUG9pbnQoW2xvc3NUcmFpbiwgbG9zc1Rlc3RdKTtcbn1cblxuZnVuY3Rpb24gY29uc3RydWN0SW5wdXRJZHMoKTogc3RyaW5nW10ge1xuICBsZXQgcmVzdWx0OiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGxldCBpbnB1dE5hbWUgaW4gSU5QVVRTKSB7XG4gICAgaWYgKHN0YXRlW2lucHV0TmFtZV0pIHtcbiAgICAgIHJlc3VsdC5wdXNoKGlucHV0TmFtZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdElucHV0KHg6IG51bWJlciwgeTogbnVtYmVyKTogbnVtYmVyW10ge1xuICBsZXQgaW5wdXQ6IG51bWJlcltdID0gW107XG4gIGZvciAobGV0IGlucHV0TmFtZSBpbiBJTlBVVFMpIHtcbiAgICBpZiAoc3RhdGVbaW5wdXROYW1lXSkge1xuICAgICAgaW5wdXQucHVzaChJTlBVVFNbaW5wdXROYW1lXS5mKHgsIHkpKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGlucHV0O1xufVxuXG5mdW5jdGlvbiBvbmVTdGVwKCk6IHZvaWQge1xuICBpdGVyKys7XG4gIHRyYWluRGF0YS5mb3JFYWNoKChwb2ludCwgaSkgPT4ge1xuICAgIGxldCBpbnB1dCA9IGNvbnN0cnVjdElucHV0KHBvaW50LngsIHBvaW50LnkpO1xuICAgIG5uLmZvcndhcmRQcm9wKG5ldHdvcmssIGlucHV0KTtcbiAgICBubi5iYWNrUHJvcChuZXR3b3JrLCBwb2ludC5sYWJlbCwgbm4uRXJyb3JzLlNRVUFSRSk7XG4gICAgaWYgKChpICsgMSkgJSBzdGF0ZS5iYXRjaFNpemUgPT09IDApIHtcbiAgICAgIG5uLnVwZGF0ZVdlaWdodHMobmV0d29yaywgc3RhdGUubGVhcm5pbmdSYXRlLCBzdGF0ZS5yZWd1bGFyaXphdGlvblJhdGUpO1xuICAgIH1cbiAgfSk7XG4gIC8vIENvbXB1dGUgdGhlIGxvc3MuXG4gIGxvc3NUcmFpbiA9IGdldExvc3MobmV0d29yaywgdHJhaW5EYXRhKTtcbiAgbG9zc1Rlc3QgPSBnZXRMb3NzKG5ldHdvcmssIHRlc3REYXRhKTtcbiAgdXBkYXRlVUkoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE91dHB1dFdlaWdodHMobmV0d29yazogbm4uTm9kZVtdW10pOiBudW1iZXJbXSB7XG4gIGxldCB3ZWlnaHRzOiBudW1iZXJbXSA9IFtdO1xuICBmb3IgKGxldCBsYXllcklkeCA9IDA7IGxheWVySWR4IDwgbmV0d29yay5sZW5ndGggLSAxOyBsYXllcklkeCsrKSB7XG4gICAgbGV0IGN1cnJlbnRMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHhdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExheWVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgbm9kZSA9IGN1cnJlbnRMYXllcltpXTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbm9kZS5vdXRwdXRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGxldCBvdXRwdXQgPSBub2RlLm91dHB1dHNbal07XG4gICAgICAgIHdlaWdodHMucHVzaChvdXRwdXQud2VpZ2h0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHdlaWdodHM7XG59XG5cbmZ1bmN0aW9uIHJlc2V0KCkge1xuICBsaW5lQ2hhcnQucmVzZXQoKTtcbiAgc3RhdGUuc2VyaWFsaXplKCk7XG4gIHBsYXllci5wYXVzZSgpO1xuXG4gIGxldCBzdWZmaXggPSBzdGF0ZS5udW1IaWRkZW5MYXllcnMgIT09IDEgPyBcInNcIiA6IFwiXCI7XG4gIGQzLnNlbGVjdChcIiNsYXllcnMtbGFiZWxcIikudGV4dChcIkhpZGRlbiBsYXllclwiICsgc3VmZml4KTtcbiAgZDMuc2VsZWN0KFwiI251bS1sYXllcnNcIikudGV4dChzdGF0ZS5udW1IaWRkZW5MYXllcnMpO1xuXG4gIC8vIE1ha2UgYSBzaW1wbGUgbmV0d29yay5cbiAgaXRlciA9IDA7XG4gIGxldCBudW1JbnB1dHMgPSBjb25zdHJ1Y3RJbnB1dCgwICwgMCkubGVuZ3RoO1xuICBsZXQgc2hhcGUgPSBbbnVtSW5wdXRzXS5jb25jYXQoc3RhdGUubmV0d29ya1NoYXBlKS5jb25jYXQoWzFdKTtcbiAgbGV0IG91dHB1dEFjdGl2YXRpb24gPSAoc3RhdGUucHJvYmxlbSA9PSBQcm9ibGVtLlJFR1JFU1NJT04pID9cbiAgICAgIG5uLkFjdGl2YXRpb25zLkxJTkVBUiA6IG5uLkFjdGl2YXRpb25zLlRBTkg7XG4gIG5ldHdvcmsgPSBubi5idWlsZE5ldHdvcmsoc2hhcGUsIHN0YXRlLmFjdGl2YXRpb24sIG91dHB1dEFjdGl2YXRpb24sXG4gICAgICBzdGF0ZS5yZWd1bGFyaXphdGlvbiwgY29uc3RydWN0SW5wdXRJZHMoKSwgc3RhdGUuaW5pdFplcm8pO1xuICBsb3NzVHJhaW4gPSBnZXRMb3NzKG5ldHdvcmssIHRyYWluRGF0YSk7XG4gIGxvc3NUZXN0ID0gZ2V0TG9zcyhuZXR3b3JrLCB0ZXN0RGF0YSk7XG4gIGRyYXdOZXR3b3JrKG5ldHdvcmspO1xuICB1cGRhdGVVSSh0cnVlKTtcbn07XG5cbmZ1bmN0aW9uIGluaXRUdXRvcmlhbCgpIHtcbiAgaWYgKHN0YXRlLnR1dG9yaWFsID09IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gUmVtb3ZlIGFsbCBvdGhlciB0ZXh0LlxuICBkMy5zZWxlY3RBbGwoXCJhcnRpY2xlIGRpdi5sLS1ib2R5XCIpLnJlbW92ZSgpO1xuICBsZXQgdHV0b3JpYWwgPSBkMy5zZWxlY3QoXCJhcnRpY2xlXCIpLmFwcGVuZChcImRpdlwiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJsLS1ib2R5XCIpO1xuICAvLyBJbnNlcnQgdHV0b3JpYWwgdGV4dC5cbiAgZDMuaHRtbChgdHV0b3JpYWxzLyR7c3RhdGUudHV0b3JpYWx9Lmh0bWxgLCAoZXJyLCBodG1sRnJhZ21lbnQpID0+IHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfVxuICAgICg8YW55PnR1dG9yaWFsLm5vZGUoKSkuYXBwZW5kQ2hpbGQoaHRtbEZyYWdtZW50KTtcbiAgICAvLyBJZiB0aGUgdHV0b3JpYWwgaGFzIGEgPHRpdGxlPiB0YWcsIHNldCB0aGUgcGFnZSB0aXRsZSB0byB0aGF0LlxuICAgIGxldCB0aXRsZSA9IHR1dG9yaWFsLnNlbGVjdChcInRpdGxlXCIpO1xuICAgIGlmICh0aXRsZS5zaXplKCkpIHtcbiAgICAgIGQzLnNlbGVjdChcImhlYWRlciBoMVwiKS5zdHlsZSh7XG4gICAgICAgIFwibWFyZ2luLXRvcFwiOiBcIjIwcHhcIixcbiAgICAgICAgXCJtYXJnaW4tYm90dG9tXCI6IFwiMjBweFwiLFxuICAgICAgfSlcbiAgICAgIC50ZXh0KHRpdGxlLnRleHQoKSk7XG4gICAgICBkb2N1bWVudC50aXRsZSA9IHRpdGxlLnRleHQoKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkcmF3RGF0YXNldFRodW1ibmFpbHMoKSB7XG4gIGZ1bmN0aW9uIHJlbmRlclRodW1ibmFpbChjYW52YXMsIGRhdGFHZW5lcmF0b3IpIHtcbiAgICBsZXQgdyA9IDEwMDtcbiAgICBsZXQgaCA9IDEwMDtcbiAgICBjYW52YXMuc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgdyk7XG4gICAgY2FudmFzLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBoKTtcbiAgICBsZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgbGV0IGRhdGEgPSBkYXRhR2VuZXJhdG9yKDIwMCwgMCk7XG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGQpIHtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3JTY2FsZShkLmxhYmVsKTtcbiAgICAgIGNvbnRleHQuZmlsbFJlY3QodyAqIChkLnggKyA2KSAvIDEyLCBoICogKGQueSArIDYpIC8gMTIsIDQsIDQpO1xuICAgIH0pO1xuICAgIGQzLnNlbGVjdChjYW52YXMucGFyZW50Tm9kZSkuc3R5bGUoXCJkaXNwbGF5XCIsIG51bGwpO1xuICB9XG5cbiAgZDMuc2VsZWN0QWxsKFwiLmRhdGFzZXRcIikuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcblxuICBpZiAoc3RhdGUucHJvYmxlbSA9PSBQcm9ibGVtLkNMQVNTSUZJQ0FUSU9OKSB7XG4gICAgZm9yIChsZXQgZGF0YXNldCBpbiBkYXRhc2V0cykge1xuICAgICAgbGV0IGNhbnZhczogYW55ID1cbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBjYW52YXNbZGF0YS1kYXRhc2V0PSR7ZGF0YXNldH1dYCk7XG4gICAgICBsZXQgZGF0YUdlbmVyYXRvciA9IGRhdGFzZXRzW2RhdGFzZXRdO1xuICAgICAgcmVuZGVyVGh1bWJuYWlsKGNhbnZhcywgZGF0YUdlbmVyYXRvcik7XG4gICAgfVxuICB9XG4gIGlmIChzdGF0ZS5wcm9ibGVtID09IFByb2JsZW0uUkVHUkVTU0lPTikge1xuICAgIGZvciAobGV0IHJlZ0RhdGFzZXQgaW4gcmVnRGF0YXNldHMpIHtcbiAgICAgIGxldCBjYW52YXM6IGFueSA9XG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgY2FudmFzW2RhdGEtcmVnRGF0YXNldD0ke3JlZ0RhdGFzZXR9XWApO1xuICAgICAgbGV0IGRhdGFHZW5lcmF0b3IgPSByZWdEYXRhc2V0c1tyZWdEYXRhc2V0XTtcbiAgICAgIHJlbmRlclRodW1ibmFpbChjYW52YXMsIGRhdGFHZW5lcmF0b3IpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBoaWRlQ29udHJvbHMoKSB7XG4gIC8vIFNldCBkaXNwbGF5Om5vbmUgdG8gYWxsIHRoZSBVSSBlbGVtZW50cyB0aGF0IGFyZSBoaWRkZW4uXG4gIGxldCBoaWRkZW5Qcm9wcyA9IHN0YXRlLmdldEhpZGRlblByb3BzKCk7XG4gIGhpZGRlblByb3BzLmZvckVhY2gocHJvcCA9PiB7XG4gICAgbGV0IGNvbnRyb2xzID0gZDMuc2VsZWN0QWxsKGAudWktJHtwcm9wfWApO1xuICAgIGlmIChjb250cm9scy5zaXplKCkgPT0gMCkge1xuICAgICAgY29uc29sZS53YXJuKGAwIGh0bWwgZWxlbWVudHMgZm91bmQgd2l0aCBjbGFzcyAudWktJHtwcm9wfWApO1xuICAgIH1cbiAgICBjb250cm9scy5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuICB9KTtcblxuICAvLyBBbHNvIGFkZCBjaGVja2JveCBmb3IgZWFjaCBoaWRhYmxlIGNvbnRyb2wgaW4gdGhlIFwidXNlIGl0IGluIGNsYXNzcm9tXCJcbiAgLy8gc2VjdGlvbi5cbiAgbGV0IGhpZGVDb250cm9scyA9IGQzLnNlbGVjdChcIi5oaWRlLWNvbnRyb2xzXCIpO1xuICBISURBQkxFX0NPTlRST0xTLmZvckVhY2goKFt0ZXh0LCBpZF0pID0+IHtcbiAgICBsZXQgbGFiZWwgPSBoaWRlQ29udHJvbHMuYXBwZW5kKFwibGFiZWxcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJtZGwtY2hlY2tib3ggbWRsLWpzLWNoZWNrYm94IG1kbC1qcy1yaXBwbGUtZWZmZWN0XCIpO1xuICAgIGxldCBpbnB1dCA9IGxhYmVsLmFwcGVuZChcImlucHV0XCIpXG4gICAgICAuYXR0cih7XG4gICAgICAgIHR5cGU6IFwiY2hlY2tib3hcIixcbiAgICAgICAgY2xhc3M6IFwibWRsLWNoZWNrYm94X19pbnB1dFwiLFxuICAgICAgfSk7XG4gICAgaWYgKGhpZGRlblByb3BzLmluZGV4T2YoaWQpID09IC0xKSB7XG4gICAgICBpbnB1dC5hdHRyKFwiY2hlY2tlZFwiLCBcInRydWVcIik7XG4gICAgfVxuICAgIGlucHV0Lm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgc3RhdGUuc2V0SGlkZVByb3BlcnR5KGlkLCAhdGhpcy5jaGVja2VkKTtcbiAgICAgIHN0YXRlLnNlcmlhbGl6ZSgpO1xuICAgICAgZDMuc2VsZWN0KFwiLmhpZGUtY29udHJvbHMtbGlua1wiKVxuICAgICAgICAuYXR0cihcImhyZWZcIiwgd2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICAgIH0pO1xuICAgIGxhYmVsLmFwcGVuZChcInNwYW5cIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJtZGwtY2hlY2tib3hfX2xhYmVsIGxhYmVsXCIpXG4gICAgICAudGV4dCh0ZXh0KTtcbiAgfSk7XG4gIGQzLnNlbGVjdChcIi5oaWRlLWNvbnRyb2xzLWxpbmtcIilcbiAgICAuYXR0cihcImhyZWZcIiwgd2luZG93LmxvY2F0aW9uLmhyZWYpO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZURhdGEoZmlyc3RUaW1lID0gZmFsc2UpIHtcbiAgaWYgKCFmaXJzdFRpbWUpIHtcbiAgICAvLyBDaGFuZ2UgdGhlIHNlZWQuXG4gICAgc3RhdGUuc2VlZCA9IE1hdGgucmFuZG9tKCkudG9GaXhlZCg1KTtcbiAgICBzdGF0ZS5zZXJpYWxpemUoKTtcbiAgfVxuICBNYXRoLnNlZWRyYW5kb20oc3RhdGUuc2VlZCk7XG4gIGxldCBudW1TYW1wbGVzID0gKHN0YXRlLnByb2JsZW0gPT0gUHJvYmxlbS5SRUdSRVNTSU9OKSA/XG4gICAgICBOVU1fU0FNUExFU19SRUdSRVNTIDogTlVNX1NBTVBMRVNfQ0xBU1NJRlk7XG4gIGxldCBnZW5lcmF0b3IgPSBzdGF0ZS5wcm9ibGVtID09IFByb2JsZW0uQ0xBU1NJRklDQVRJT04gP1xuICAgICAgc3RhdGUuZGF0YXNldCA6IHN0YXRlLnJlZ0RhdGFzZXQ7XG4gIGxldCBkYXRhID0gZ2VuZXJhdG9yKG51bVNhbXBsZXMsIHN0YXRlLm5vaXNlIC8gMTAwKTtcbiAgLy8gU2h1ZmZsZSB0aGUgZGF0YSBpbi1wbGFjZS5cbiAgc2h1ZmZsZShkYXRhKTtcbiAgLy8gU3BsaXQgaW50byB0cmFpbiBhbmQgdGVzdCBkYXRhLlxuICBsZXQgc3BsaXRJbmRleCA9IE1hdGguZmxvb3IoZGF0YS5sZW5ndGggKiBzdGF0ZS5wZXJjVHJhaW5EYXRhIC8gMTAwKTtcbiAgdHJhaW5EYXRhID0gZGF0YS5zbGljZSgwLCBzcGxpdEluZGV4KTtcbiAgdGVzdERhdGEgPSBkYXRhLnNsaWNlKHNwbGl0SW5kZXgpO1xuICBoZWF0TWFwLnVwZGF0ZVBvaW50cyh0cmFpbkRhdGEpO1xuICBoZWF0TWFwLnVwZGF0ZVRlc3RQb2ludHMoc3RhdGUuc2hvd1Rlc3REYXRhID8gdGVzdERhdGEgOiBbXSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZURyYWdPdmVyKCkge1xuICB0aGlzLnN0b3BQcm9wYWdhdGlvbigpO1xuICB0aGlzLnByZXZlbnREZWZhdWx0KCk7XG4gIHRoaXMuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnY29weSc7XG59XG5cbmZ1bmN0aW9uIHJlYWREYXRhKCkge1xuICB2YXIgZGF0YSA9IHRoaXMucmVzdWx0LnNwbGl0KCdcXG4nKTtcbiAgbGV0IHBvaW50czogRXhhbXBsZTJEW10gPSBbXTtcbiAgdHJhaW5EYXRhID0gW107XG4gIGxldCBtaW5wb2ludDogRXhhbXBsZTJEID0ge3g6IE51bWJlci5NQVhfVkFMVUUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogTnVtYmVyLk1BWF9WQUxVRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogTnVtYmVyLk1BWF9WQUxVRX07XG4gIGxldCBtYXhwb2ludDogRXhhbXBsZTJEID0ge3g6IE51bWJlci5NSU5fVkFMVUUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogTnVtYmVyLk1JTl9WQUxVRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogTnVtYmVyLk1JTl9WQUxVRX07XG5cbiAgZm9yICh2YXIgbCBpbiBkYXRhKSB7XG4gICAgaWYgKGRhdGFbbF0gPT0gXCJcIiAmJiB0cmFpbkRhdGEubGVuZ3RoID09IDApIHtcbiAgICAgIHRyYWluRGF0YSA9IHBvaW50cztcbiAgICAgIHBvaW50cyA9IFtdO1xuICAgIH1cbiAgICB2YXIgZWxtcyA9IGRhdGFbbF0uc3BsaXQoXCIgXCIpO1xuICAgIGlmIChlbG1zLmxlbmd0aCA9PSAzKSB7XG4gICAgICBsZXQgcG9pbnQ6IEV4YW1wbGUyRCA9IHt4OiBwYXJzZUZsb2F0KGVsbXNbMF0pLCB5OiBwYXJzZUZsb2F0KGVsbXNbMV0pLCBsYWJlbDogcGFyc2VGbG9hdChlbG1zWzJdKX07XG4gICAgICBwb2ludHMucHVzaChwb2ludCk7XG5cbiAgICAgIG1pbnBvaW50LnggPSBNYXRoLm1pbihtaW5wb2ludC54LCBwb2ludC54KTtcbiAgICAgIG1pbnBvaW50LnkgPSBNYXRoLm1pbihtaW5wb2ludC55LCBwb2ludC55KTtcbiAgICAgIG1pbnBvaW50LmxhYmVsID0gTWF0aC5taW4obWlucG9pbnQubGFiZWwsIHBvaW50LmxhYmVsKTtcbiAgICAgIG1heHBvaW50LnggPSBNYXRoLm1heChtYXhwb2ludC54LCBwb2ludC54KTtcbiAgICAgIG1heHBvaW50LnkgPSBNYXRoLm1heChtYXhwb2ludC55LCBwb2ludC55KTtcbiAgICAgIG1heHBvaW50LmxhYmVsID0gTWF0aC5tYXgobWF4cG9pbnQubGFiZWwsIHBvaW50LmxhYmVsKTtcbiAgICB9XG4gIH1cbiAgdGVzdERhdGEgPSBwb2ludHM7XG4gIHhEb21haW4gPSBbTWF0aC5taW4oeERvbWFpblswXSxtaW5wb2ludC54KSwgTWF0aC5tYXgoeERvbWFpblsxXSxtYXhwb2ludC54KV07XG4gIHlEb21haW4gPSBbTWF0aC5taW4oeURvbWFpblswXSxtaW5wb2ludC55KSwgTWF0aC5tYXgoeURvbWFpblsxXSxtYXhwb2ludC55KV07XG4gIGQzLnNlbGVjdChcIiNoZWF0bWFwXCIpLnNlbGVjdChcIipcIikucmVtb3ZlKCk7XG4gIGhlYXRNYXAgPVxuICAgICAgbmV3IEhlYXRNYXAoMzAwLCBERU5TSVRZLCB4RG9tYWluLCB5RG9tYWluLCBkMy5zZWxlY3QoXCIjaGVhdG1hcFwiKSxcbiAgICAgICAgICB7c2hvd0F4ZXM6IHRydWV9KTtcbiAgaGVhdE1hcC51cGRhdGVQb2ludHModHJhaW5EYXRhKTtcbiAgaGVhdE1hcC51cGRhdGVUZXN0UG9pbnRzKHN0YXRlLnNob3dUZXN0RGF0YSA/IHRlc3REYXRhIDogW10pO1xuXG4gIGlmIChzdGF0ZS5wcm9ibGVtID09IFByb2JsZW0uQ0xBU1NJRklDQVRJT04pIHtcbiAgICBsZXQgZGF0YVRodW1ibmFpbHMgPSBkMy5zZWxlY3RBbGwoXCJjYW52YXNbZGF0YS1kYXRhc2V0XVwiKTtcbiAgICBkYXRhVGh1bWJuYWlscy5jbGFzc2VkKFwic2VsZWN0ZWRcIiwgZmFsc2UpO1xuICAgIGQzLnNlbGVjdChgY2FudmFzW2RhdGEtZGF0YXNldD11c2VyXWApLmNsYXNzZWQoXCJzZWxlY3RlZFwiLCB0cnVlKTtcbiAgICBzdGF0ZS5kYXRhc2V0ID0gZGF0YXNldHNbXCJ1c2VyXCJdO1xuICB9IGVsc2Uge1xuICAgIGxldCBkYXRhVGh1bWJuYWlscyA9IGQzLnNlbGVjdEFsbChcImNhbnZhc1tkYXRhLXJlZ0RhdGFzZXRdXCIpO1xuICAgIGRhdGFUaHVtYm5haWxzLmNsYXNzZWQoXCJzZWxlY3RlZFwiLCBmYWxzZSk7XG4gICAgZDMuc2VsZWN0KGBjYW52YXNbZGF0YS1yZWdEYXRhc2V0PXJlZy11c2VyXWApLmNsYXNzZWQoXCJzZWxlY3RlZFwiLCB0cnVlKTtcbiAgICBzdGF0ZS5yZWdEYXRhc2V0ID0gZGF0YXNldHNbXCJyZWctdXNlclwiXTtcbiAgfVxuICByZXNldCgpO1xuICB2YXIgc3RyID0gZDMuc2VsZWN0KFwiI2RhdGEtbG9hZC1idXR0b25cIikucHJvcGVydHkoXCJ2YWx1ZVwiLFwiXCIpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVMb2FkRGF0YSgpIHtcbiAgdmFyIGZpbGU7XG4gIGlmICh0aGlzLmZpbGVzKSB7XG4gICAgZmlsZSA9IHRoaXMuZmlsZXNbMF07XG4gIH0gZWxzZSB7XG4gICAgZmlsZSA9IHRoaXMuZGF0YVRyYW5zZmVyLmZpbGVzWzBdO1xuICB9XG5cbiAgY2hhbmdlSW5wdXRUZXh0KCk7XG4gIGxldCBmaWxlSW5wdXRUZXh0RGl2ID0gZDMuc2VsZWN0KFwiI2ZpbGVfaW5wdXRfdGV4dF9kaXZcIik7XG4gIGlmIChkMy5zZWxlY3QoXCIjZmlsZV9pbnB1dF90ZXh0XCIpLnRleHQoKS5sZW5ndGggIT0gMCkge1xuICAgIGlmICghZmlsZUlucHV0VGV4dERpdi5jbGFzc2VkKFwiaXMtZm9jdXNlZFwiKSkge1xuICAgICAgZmlsZUlucHV0VGV4dERpdi5jbGFzc2VkKCdpcy1mb2N1c2VkJyx0cnVlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGZpbGVJbnB1dFRleHREaXYuY2xhc3NlZChcImlzLWZvY3VzZWRcIikpIHtcbiAgICAgIGZpbGVJbnB1dFRleHREaXYuY2xhc3NlZCgnaXMtZm9jdXNlZCcsZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcbiAgcmVhZGVyLm9ubG9hZCA9IHJlYWREYXRhO1xufVxuXG5mdW5jdGlvbiBjaGFuZ2VJbnB1dFRleHQoKSB7XG4gIHZhciBzdHIgPSBkMy5zZWxlY3QoXCIjZGF0YS1sb2FkLWJ1dHRvblwiKS5wcm9wZXJ0eShcInZhbHVlXCIpO1xuICB2YXIgaTtcbiAgaWYgKHN0ci5sYXN0SW5kZXhPZignXFxcXCcpKSB7XG4gICAgaSA9IHN0ci5sYXN0SW5kZXhPZignXFxcXCcpICsgMTtcbiAgfSBlbHNlIGlmIChzdHIubGFzdEluZGV4T2YoJy8nKSkge1xuICAgIGkgPSBzdHIubGFzdEluZGV4T2YoJy8nKSArIDE7XG4gIH1cbiAgZDMuc2VsZWN0KFwiI2ZpbGVfaW5wdXRfdGV4dFwiKS5wcm9wZXJ0eShcInZhbHVlXCIsc3RyLnNsaWNlKGksIHN0ci5sZW5ndGgpKTtcbn1cblxuZHJhd0RhdGFzZXRUaHVtYm5haWxzKCk7XG5pbml0VHV0b3JpYWwoKTtcbm1ha2VHVUkoKTtcbmdlbmVyYXRlRGF0YSh0cnVlKTtcbnJlc2V0KCk7XG5oaWRlQ29udHJvbHMoKTtcbiIsIi8qIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuaW1wb3J0ICogYXMgbm4gZnJvbSBcIi4vbm5cIjtcbmltcG9ydCAqIGFzIGRhdGFzZXQgZnJvbSBcIi4vZGF0YXNldFwiO1xuXG4vKiogU3VmZml4IGFkZGVkIHRvIHRoZSBzdGF0ZSB3aGVuIHN0b3JpbmcgaWYgYSBjb250cm9sIGlzIGhpZGRlbiBvciBub3QuICovXG5jb25zdCBISURFX1NUQVRFX1NVRkZJWCA9IFwiX2hpZGVcIjtcblxuLyoqIEEgbWFwIGJldHdlZW4gbmFtZXMgYW5kIGFjdGl2YXRpb24gZnVuY3Rpb25zLiAqL1xuZXhwb3J0IGxldCBhY3RpdmF0aW9uczoge1trZXk6IHN0cmluZ106IG5uLkFjdGl2YXRpb25GdW5jdGlvbn0gPSB7XG4gIFwicmVsdVwiOiBubi5BY3RpdmF0aW9ucy5SRUxVLFxuICBcInRhbmhcIjogbm4uQWN0aXZhdGlvbnMuVEFOSCxcbiAgXCJzaWdtb2lkXCI6IG5uLkFjdGl2YXRpb25zLlNJR01PSUQsXG4gIFwibGluZWFyXCI6IG5uLkFjdGl2YXRpb25zLkxJTkVBUlxufTtcblxuLyoqIEEgbWFwIGJldHdlZW4gbmFtZXMgYW5kIHJlZ3VsYXJpemF0aW9uIGZ1bmN0aW9ucy4gKi9cbmV4cG9ydCBsZXQgcmVndWxhcml6YXRpb25zOiB7W2tleTogc3RyaW5nXTogbm4uUmVndWxhcml6YXRpb25GdW5jdGlvbn0gPSB7XG4gIFwibm9uZVwiOiBudWxsLFxuICBcIkwxXCI6IG5uLlJlZ3VsYXJpemF0aW9uRnVuY3Rpb24uTDEsXG4gIFwiTDJcIjogbm4uUmVndWxhcml6YXRpb25GdW5jdGlvbi5MMlxufTtcblxuLyoqIEEgbWFwIGJldHdlZW4gZGF0YXNldCBuYW1lcyBhbmQgZnVuY3Rpb25zIHRoYXQgZ2VuZXJhdGUgY2xhc3NpZmljYXRpb24gZGF0YS4gKi9cbmV4cG9ydCBsZXQgZGF0YXNldHM6IHtba2V5OiBzdHJpbmddOiBkYXRhc2V0LkRhdGFHZW5lcmF0b3J9ID0ge1xuICBcImNpcmNsZVwiOiBkYXRhc2V0LmNsYXNzaWZ5Q2lyY2xlRGF0YSxcbiAgXCJ4b3JcIjogZGF0YXNldC5jbGFzc2lmeVhPUkRhdGEsXG4gIFwiZ2F1c3NcIjogZGF0YXNldC5jbGFzc2lmeVR3b0dhdXNzRGF0YSxcbiAgXCJzcGlyYWxcIjogZGF0YXNldC5jbGFzc2lmeVNwaXJhbERhdGEsXG4gIFwidXNlclwiOiBkYXRhc2V0LmNsYXNzaWZ5VXNlckRhdGFcbn07XG5cbi8qKiBBIG1hcCBiZXR3ZWVuIGRhdGFzZXQgbmFtZXMgYW5kIGZ1bmN0aW9ucyB0aGF0IGdlbmVyYXRlIHJlZ3Jlc3Npb24gZGF0YS4gKi9cbmV4cG9ydCBsZXQgcmVnRGF0YXNldHM6IHtba2V5OiBzdHJpbmddOiBkYXRhc2V0LkRhdGFHZW5lcmF0b3J9ID0ge1xuICBcInJlZy1wbGFuZVwiOiBkYXRhc2V0LnJlZ3Jlc3NQbGFuZSxcbiAgXCJyZWctZ2F1c3NcIjogZGF0YXNldC5yZWdyZXNzR2F1c3NpYW4sXG4gIFwicmVnLXVzZXJcIjogZGF0YXNldC5jbGFzc2lmeVVzZXJEYXRhXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0S2V5RnJvbVZhbHVlKG9iajogYW55LCB2YWx1ZTogYW55KTogc3RyaW5nIHtcbiAgZm9yIChsZXQga2V5IGluIG9iaikge1xuICAgIGlmIChvYmpba2V5XSA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGVuZHNXaXRoKHM6IHN0cmluZywgc3VmZml4OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIHMuc3Vic3RyKC1zdWZmaXgubGVuZ3RoKSA9PT0gc3VmZml4O1xufVxuXG5mdW5jdGlvbiBnZXRIaWRlUHJvcHMob2JqOiBhbnkpOiBzdHJpbmdbXSB7XG4gIGxldCByZXN1bHQ6IHN0cmluZ1tdID0gW107XG4gIGZvciAobGV0IHByb3AgaW4gb2JqKSB7XG4gICAgaWYgKGVuZHNXaXRoKHByb3AsIEhJREVfU1RBVEVfU1VGRklYKSkge1xuICAgICAgcmVzdWx0LnB1c2gocHJvcCk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVGhlIGRhdGEgdHlwZSBvZiBhIHN0YXRlIHZhcmlhYmxlLiBVc2VkIGZvciBkZXRlcm1pbmluZyB0aGVcbiAqIChkZSlzZXJpYWxpemF0aW9uIG1ldGhvZC5cbiAqL1xuZXhwb3J0IGVudW0gVHlwZSB7XG4gIFNUUklORyxcbiAgTlVNQkVSLFxuICBBUlJBWV9OVU1CRVIsXG4gIEFSUkFZX1NUUklORyxcbiAgQk9PTEVBTixcbiAgT0JKRUNUXG59XG5cbmV4cG9ydCBlbnVtIFByb2JsZW0ge1xuICBDTEFTU0lGSUNBVElPTixcbiAgUkVHUkVTU0lPTlxufVxuXG5leHBvcnQgbGV0IHByb2JsZW1zID0ge1xuICBcImNsYXNzaWZpY2F0aW9uXCI6IFByb2JsZW0uQ0xBU1NJRklDQVRJT04sXG4gIFwicmVncmVzc2lvblwiOiBQcm9ibGVtLlJFR1JFU1NJT05cbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJvcGVydHkge1xuICBuYW1lOiBzdHJpbmc7XG4gIHR5cGU6IFR5cGU7XG4gIGtleU1hcD86IHtba2V5OiBzdHJpbmddOiBhbnl9O1xufTtcblxuLy8gQWRkIHRoZSBHVUkgc3RhdGUuXG5leHBvcnQgY2xhc3MgU3RhdGUge1xuXG4gIHByaXZhdGUgc3RhdGljIFBST1BTOiBQcm9wZXJ0eVtdID0gW1xuICAgIHtuYW1lOiBcImFjdGl2YXRpb25cIiwgdHlwZTogVHlwZS5PQkpFQ1QsIGtleU1hcDogYWN0aXZhdGlvbnN9LFxuICAgIHtuYW1lOiBcInJlZ3VsYXJpemF0aW9uXCIsIHR5cGU6IFR5cGUuT0JKRUNULCBrZXlNYXA6IHJlZ3VsYXJpemF0aW9uc30sXG4gICAge25hbWU6IFwiYmF0Y2hTaXplXCIsIHR5cGU6IFR5cGUuTlVNQkVSfSxcbiAgICB7bmFtZTogXCJkYXRhc2V0XCIsIHR5cGU6IFR5cGUuT0JKRUNULCBrZXlNYXA6IGRhdGFzZXRzfSxcbiAgICB7bmFtZTogXCJyZWdEYXRhc2V0XCIsIHR5cGU6IFR5cGUuT0JKRUNULCBrZXlNYXA6IHJlZ0RhdGFzZXRzfSxcbiAgICB7bmFtZTogXCJsZWFybmluZ1JhdGVcIiwgdHlwZTogVHlwZS5OVU1CRVJ9LFxuICAgIHtuYW1lOiBcInJlZ3VsYXJpemF0aW9uUmF0ZVwiLCB0eXBlOiBUeXBlLk5VTUJFUn0sXG4gICAge25hbWU6IFwibm9pc2VcIiwgdHlwZTogVHlwZS5OVU1CRVJ9LFxuICAgIHtuYW1lOiBcIm5ldHdvcmtTaGFwZVwiLCB0eXBlOiBUeXBlLkFSUkFZX05VTUJFUn0sXG4gICAge25hbWU6IFwic2VlZFwiLCB0eXBlOiBUeXBlLlNUUklOR30sXG4gICAge25hbWU6IFwic2hvd1Rlc3REYXRhXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG4gICAge25hbWU6IFwiZGlzY3JldGl6ZVwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuICAgIHtuYW1lOiBcInBlcmNUcmFpbkRhdGFcIiwgdHlwZTogVHlwZS5OVU1CRVJ9LFxuICAgIHtuYW1lOiBcInhcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcbiAgICB7bmFtZTogXCJ5XCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG4gICAge25hbWU6IFwieFRpbWVzWVwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuICAgIHtuYW1lOiBcInhTcXVhcmVkXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG4gICAge25hbWU6IFwieVNxdWFyZWRcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcbiAgICB7bmFtZTogXCJjb3NYXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG4gICAge25hbWU6IFwic2luWFwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxuICAgIHtuYW1lOiBcImNvc1lcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcbiAgICB7bmFtZTogXCJzaW5ZXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG4gICAge25hbWU6IFwiY29sbGVjdFN0YXRzXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG4gICAge25hbWU6IFwidHV0b3JpYWxcIiwgdHlwZTogVHlwZS5TVFJJTkd9LFxuICAgIHtuYW1lOiBcInByb2JsZW1cIiwgdHlwZTogVHlwZS5PQkpFQ1QsIGtleU1hcDogcHJvYmxlbXN9LFxuICAgIHtuYW1lOiBcImluaXRaZXJvXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXG4gIF07XG5cbiAgW2tleTogc3RyaW5nXTogYW55O1xuICBsZWFybmluZ1JhdGUgPSAwLjAzO1xuICByZWd1bGFyaXphdGlvblJhdGUgPSAwO1xuICBzaG93VGVzdERhdGEgPSBmYWxzZTtcbiAgbm9pc2UgPSAwO1xuICBiYXRjaFNpemUgPSAxMDtcbiAgZGlzY3JldGl6ZSA9IGZhbHNlO1xuICB0dXRvcmlhbDogc3RyaW5nID0gbnVsbDtcbiAgcGVyY1RyYWluRGF0YSA9IDUwO1xuICBhY3RpdmF0aW9uID0gbm4uQWN0aXZhdGlvbnMuVEFOSDtcbiAgcmVndWxhcml6YXRpb246IG5uLlJlZ3VsYXJpemF0aW9uRnVuY3Rpb24gPSBudWxsO1xuICBwcm9ibGVtID0gUHJvYmxlbS5DTEFTU0lGSUNBVElPTjtcbiAgaW5pdFplcm8gPSBmYWxzZTtcbiAgY29sbGVjdFN0YXRzID0gZmFsc2U7XG4gIG51bUhpZGRlbkxheWVycyA9IDE7XG4gIGhpZGRlbkxheWVyQ29udHJvbHM6IGFueVtdID0gW107XG4gIG5ldHdvcmtTaGFwZTogbnVtYmVyW10gPSBbNCwgMl07XG4gIHggPSB0cnVlO1xuICB5ID0gdHJ1ZTtcbiAgeFRpbWVzWSA9IGZhbHNlO1xuICB4U3F1YXJlZCA9IGZhbHNlO1xuICB5U3F1YXJlZCA9IGZhbHNlO1xuICBjb3NYID0gZmFsc2U7XG4gIHNpblggPSBmYWxzZTtcbiAgY29zWSA9IGZhbHNlO1xuICBzaW5ZID0gZmFsc2U7XG4gIGRhdGFzZXQ6IGRhdGFzZXQuRGF0YUdlbmVyYXRvciA9IGRhdGFzZXQuY2xhc3NpZnlDaXJjbGVEYXRhO1xuICByZWdEYXRhc2V0OiBkYXRhc2V0LkRhdGFHZW5lcmF0b3IgPSBkYXRhc2V0LnJlZ3Jlc3NQbGFuZTtcbiAgc2VlZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBEZXNlcmlhbGl6ZXMgdGhlIHN0YXRlIGZyb20gdGhlIHVybCBoYXNoLlxuICAgKi9cbiAgc3RhdGljIGRlc2VyaWFsaXplU3RhdGUoKTogU3RhdGUge1xuICAgIGxldCBtYXA6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG4gICAgZm9yIChsZXQga2V5dmFsdWUgb2Ygd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMSkuc3BsaXQoXCImXCIpKSB7XG4gICAgICBsZXQgW25hbWUsIHZhbHVlXSA9IGtleXZhbHVlLnNwbGl0KFwiPVwiKTtcbiAgICAgIG1hcFtuYW1lXSA9IHZhbHVlO1xuICAgIH1cbiAgICBsZXQgc3RhdGUgPSBuZXcgU3RhdGUoKTtcblxuICAgIGZ1bmN0aW9uIGhhc0tleShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiBuYW1lIGluIG1hcCAmJiBtYXBbbmFtZV0gIT0gbnVsbCAmJiBtYXBbbmFtZV0udHJpbSgpICE9PSBcIlwiO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlQXJyYXkodmFsdWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICAgIHJldHVybiB2YWx1ZS50cmltKCkgPT09IFwiXCIgPyBbXSA6IHZhbHVlLnNwbGl0KFwiLFwiKTtcbiAgICB9XG5cbiAgICAvLyBEZXNlcmlhbGl6ZSByZWd1bGFyIHByb3BlcnRpZXMuXG4gICAgU3RhdGUuUFJPUFMuZm9yRWFjaCgoe25hbWUsIHR5cGUsIGtleU1hcH0pID0+IHtcbiAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlIFR5cGUuT0JKRUNUOlxuICAgICAgICAgIGlmIChrZXlNYXAgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJBIGtleS12YWx1ZSBtYXAgbXVzdCBiZSBwcm92aWRlZCBmb3Igc3RhdGUgXCIgK1xuICAgICAgICAgICAgICAgIFwidmFyaWFibGVzIG9mIHR5cGUgT2JqZWN0XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaGFzS2V5KG5hbWUpICYmIG1hcFtuYW1lXSBpbiBrZXlNYXApIHtcbiAgICAgICAgICAgIHN0YXRlW25hbWVdID0ga2V5TWFwW21hcFtuYW1lXV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFR5cGUuTlVNQkVSOlxuICAgICAgICAgIGlmIChoYXNLZXkobmFtZSkpIHtcbiAgICAgICAgICAgIC8vIFRoZSArIG9wZXJhdG9yIGlzIGZvciBjb252ZXJ0aW5nIGEgc3RyaW5nIHRvIGEgbnVtYmVyLlxuICAgICAgICAgICAgc3RhdGVbbmFtZV0gPSArbWFwW25hbWVdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBUeXBlLlNUUklORzpcbiAgICAgICAgICBpZiAoaGFzS2V5KG5hbWUpKSB7XG4gICAgICAgICAgICBzdGF0ZVtuYW1lXSA9IG1hcFtuYW1lXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVHlwZS5CT09MRUFOOlxuICAgICAgICAgIGlmIChoYXNLZXkobmFtZSkpIHtcbiAgICAgICAgICAgIHN0YXRlW25hbWVdID0gKG1hcFtuYW1lXSA9PT0gXCJmYWxzZVwiID8gZmFsc2UgOiB0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVHlwZS5BUlJBWV9OVU1CRVI6XG4gICAgICAgICAgaWYgKG5hbWUgaW4gbWFwKSB7XG4gICAgICAgICAgICBzdGF0ZVtuYW1lXSA9IHBhcnNlQXJyYXkobWFwW25hbWVdKS5tYXAoTnVtYmVyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVHlwZS5BUlJBWV9TVFJJTkc6XG4gICAgICAgICAgaWYgKG5hbWUgaW4gbWFwKSB7XG4gICAgICAgICAgICBzdGF0ZVtuYW1lXSA9IHBhcnNlQXJyYXkobWFwW25hbWVdKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgRXJyb3IoXCJFbmNvdW50ZXJlZCBhbiB1bmtub3duIHR5cGUgZm9yIGEgc3RhdGUgdmFyaWFibGVcIik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBEZXNlcmlhbGl6ZSBzdGF0ZSBwcm9wZXJ0aWVzIHRoYXQgY29ycmVzcG9uZCB0byBoaWRpbmcgVUkgY29udHJvbHMuXG4gICAgZ2V0SGlkZVByb3BzKG1hcCkuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgIHN0YXRlW3Byb3BdID0gKG1hcFtwcm9wXSA9PT0gXCJ0cnVlXCIpID8gdHJ1ZSA6IGZhbHNlO1xuICAgIH0pO1xuICAgIHN0YXRlLm51bUhpZGRlbkxheWVycyA9IHN0YXRlLm5ldHdvcmtTaGFwZS5sZW5ndGg7XG4gICAgaWYgKHN0YXRlLnNlZWQgPT0gbnVsbCkge1xuICAgICAgc3RhdGUuc2VlZCA9IE1hdGgucmFuZG9tKCkudG9GaXhlZCg1KTtcbiAgICB9XG4gICAgTWF0aC5zZWVkcmFuZG9tKHN0YXRlLnNlZWQpO1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemVzIHRoZSBzdGF0ZSBpbnRvIHRoZSB1cmwgaGFzaC5cbiAgICovXG4gIHNlcmlhbGl6ZSgpIHtcbiAgICAvLyBTZXJpYWxpemUgcmVndWxhciBwcm9wZXJ0aWVzLlxuICAgIGxldCBwcm9wczogc3RyaW5nW10gPSBbXTtcbiAgICBTdGF0ZS5QUk9QUy5mb3JFYWNoKCh7bmFtZSwgdHlwZSwga2V5TWFwfSkgPT4ge1xuICAgICAgbGV0IHZhbHVlID0gdGhpc1tuYW1lXTtcbiAgICAgIC8vIERvbid0IHNlcmlhbGl6ZSBtaXNzaW5nIHZhbHVlcy5cbiAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlID09PSBUeXBlLk9CSkVDVCkge1xuICAgICAgICB2YWx1ZSA9IGdldEtleUZyb21WYWx1ZShrZXlNYXAsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gVHlwZS5BUlJBWV9OVU1CRVIgfHxcbiAgICAgICAgICB0eXBlID09PSBUeXBlLkFSUkFZX1NUUklORykge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLmpvaW4oXCIsXCIpO1xuICAgICAgfVxuICAgICAgcHJvcHMucHVzaChgJHtuYW1lfT0ke3ZhbHVlfWApO1xuICAgIH0pO1xuICAgIC8vIFNlcmlhbGl6ZSBwcm9wZXJ0aWVzIHRoYXQgY29ycmVzcG9uZCB0byBoaWRpbmcgVUkgY29udHJvbHMuXG4gICAgZ2V0SGlkZVByb3BzKHRoaXMpLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICBwcm9wcy5wdXNoKGAke3Byb3B9PSR7dGhpc1twcm9wXX1gKTtcbiAgICB9KTtcbiAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IHByb3BzLmpvaW4oXCImXCIpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgYWxsIHRoZSBoaWRkZW4gcHJvcGVydGllcy4gKi9cbiAgZ2V0SGlkZGVuUHJvcHMoKTogc3RyaW5nW10ge1xuICAgIGxldCByZXN1bHQ6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChsZXQgcHJvcCBpbiB0aGlzKSB7XG4gICAgICBpZiAoZW5kc1dpdGgocHJvcCwgSElERV9TVEFURV9TVUZGSVgpICYmIHRoaXNbcHJvcF0gPT09IHRydWUpIHtcbiAgICAgICAgcmVzdWx0LnB1c2gocHJvcC5yZXBsYWNlKEhJREVfU1RBVEVfU1VGRklYLCBcIlwiKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBzZXRIaWRlUHJvcGVydHkobmFtZTogc3RyaW5nLCBoaWRkZW46IGJvb2xlYW4pIHtcbiAgICB0aGlzW25hbWUgKyBISURFX1NUQVRFX1NVRkZJWF0gPSBoaWRkZW47XG4gIH1cbn1cbiJdfQ==
