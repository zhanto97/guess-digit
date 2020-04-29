/*
 * Fixes the blurriness of image on canvas
 */
function enhance_canvas_dpi(canvas) {
    var dpi = window.devicePixelRatio;
    var style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    var style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
    canvas.setAttribute('height', style_height * dpi);
    canvas.setAttribute('width', style_width * dpi);
}

/**
 * Return the coordinates of grid where mouse is located
 */
function get_mouse_pos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    var gridX = Math.floor(x / (rect.width / GRID_SHAPE))
    var gridY = Math.floor(y / (rect.height / GRID_SHAPE))
    return {
        x: gridX,
        y: gridY
    };
}

/**
 * Returns nxn array of zeros
 */
function zeros(n){
    return [...Array(n)].map(e => Array(n).fill(0));
}