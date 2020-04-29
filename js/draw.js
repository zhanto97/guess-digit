let GRID_SHAPE = 28;
let MODEL_URL = 'https://raw.githubusercontent.com/zhanto97/guess-digit/master/my_model/model.json';

var CANVAS = null
var DRAWING = false;
var STATE = null;
var MODEL = null;

async function initialize() {
    CANVAS = document.getElementById('canvas-canvas');
    enhance_canvas_dpi(CANVAS);
    clear_canvas()
    setup_drawing_listeners();
    MODEL = await tf.loadLayersModel(MODEL_URL);
}

function predict_digit(){
    var image = zeros(GRID_SHAPE);
    for (var i = 0; i < GRID_SHAPE; i++){
        for (var j = 0; j < GRID_SHAPE; j++){
            image[i][j] = [STATE[i][j]];
        }
    }
    image = tf.tensor4d([image]);
    let predictions = MODEL.predict(image).flatten();
    var answer = predictions.argMax().dataSync();

    var prediction = document.getElementById('prediction-p');
    prediction.innerHTML = "Predicted digit is " + answer + "!";
}

function clear_canvas(){
    var context = CANVAS.getContext('2d');
    context.clearRect(0, 0, CANVAS.width, CANVAS.height);
    draw_grids(CANVAS);
    STATE = zeros(GRID_SHAPE);
    var prediction = document.getElementById('prediction-p');
    prediction.innerHTML = "";
}

function draw_grids(canvas){
    var context = canvas.getContext('2d');
    context.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    let canvas_width = canvas.width;
    let canvas_height = canvas.height;

    var x, y;
    for (var i = 0; i <= GRID_SHAPE; i++){

        // Vertical lines
        x = Math.floor(i * canvas_width / GRID_SHAPE);
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas_height);
        context.stroke();
        
        // Horizontal lines
        y = Math.floor(i * canvas_width / GRID_SHAPE);
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas_width, y);
        context.stroke();
    }
}

function setup_drawing_listeners(){
    function fillGrid(x, y, color) {
        if (DRAWING && STATE[y][x] >= 0) {
            var context = CANVAS.getContext('2d');
            var grid_width = CANVAS.width / GRID_SHAPE;
            var grid_height = CANVAS.height / GRID_SHAPE;

            context.fillStyle = color;
            context.fillRect(x*grid_width, y*grid_height, grid_width, grid_height);

            if (color == 'rgba(0, 0, 0, 1)')
                STATE[y][x] = 255;
            else if (STATE[y][x] != 255)
                STATE[y][x] = 127;
        }
    }

    CANVAS.addEventListener("mousedown", function (e) {
        DRAWING = true;
        var coord = get_mouse_pos(CANVAS, e);
        fillGrid(coord.x, coord.y, 'rgba(0, 0, 0, 1)');
        fillGrid(coord.x - 1, coord.y, 'rgba(0, 0, 0, 0.5)');
        fillGrid(coord.x + 1, coord.y, 'rgba(0, 0, 0, 0.5)');
        fillGrid(coord.x, coord.y - 1, 'rgba(0, 0, 0, 0.5)');
        fillGrid(coord.x, coord.y + 1, 'rgba(0, 0, 0, 0.5)');
    });

    CANVAS.addEventListener("mouseup", function (e) {
        DRAWING = false;
    });

    CANVAS.addEventListener("mousemove", function (e) {
        if (DRAWING){
            var coord = get_mouse_pos(CANVAS, e);
            fillGrid(coord.x, coord.y, 'rgba(0, 0, 0, 1)');
            fillGrid(coord.x - 1, coord.y, 'rgba(0, 0, 0, 0.5)');
            fillGrid(coord.x + 1, coord.y, 'rgba(0, 0, 0, 0.5)');
            fillGrid(coord.x, coord.y - 1, 'rgba(0, 0, 0, 0.5)');
            fillGrid(coord.x, coord.y + 1, 'rgba(0, 0, 0, 0.5)');
        }
    });
}