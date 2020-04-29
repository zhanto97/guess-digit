let GRID_SHAPE = 28 // 28x28 grid
let API_URL = 'http://localhost:8080/predict'

var CANVAS = null
var DRAWING = false;
var STATE = zeros(GRID_SHAPE);

async function initialize() {
    CANVAS = document.getElementById('canvas-canvas');
    enhance_canvas_dpi(CANVAS);
    draw_grids(CANVAS);
    setup_drawing_listeners();
    let MODEL = await tf.loadLayersModel('localstorage://my_model');
}

function predict_digit(){
    let data = {
        image: STATE
    }
    let params = {
        headers: {
            'content-type': 'application/json'
        },
        body: data,
        method: 'POST'
    }

    fetch(API_URL, params)
        .then(data => data.json())
        .then(res => console.log(res))
        .catch(err => console.log(err))
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
    function fillGrid(x, y) {
        if (DRAWING && STATE[y][x] == 0) {
            var context = CANVAS.getContext('2d');
            var grid_width = CANVAS.width / GRID_SHAPE;
            var grid_height = CANVAS.height / GRID_SHAPE;

            context.fillStyle = '#000';
            context.fillRect(x*grid_width, y*grid_height, grid_width, grid_height);

            STATE[y][x] = 255;
        }
    }

    CANVAS.addEventListener("mousedown", function (e) {
        DRAWING = true;
        var coord = get_mouse_pos(CANVAS, e);
        fillGrid(coord.x, coord.y);
    });

    CANVAS.addEventListener("mouseup", function (e) {
        DRAWING = false;
    });

    CANVAS.addEventListener("mousemove", function (e) {
        if (DRAWING){
            var coord = get_mouse_pos(CANVAS, e);
            fillGrid(coord.x, coord.y);
        }
    });
}

function print_state(){
    console.log(STATE);
}