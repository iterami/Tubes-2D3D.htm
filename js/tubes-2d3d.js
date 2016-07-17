'use strict';

function draw_logic(){
    // Save current buffer state.
    canvas_buffer.save();

    // Setup translate/rotation for wall drawing.
    canvas_buffer.translate(
      canvas_x,
      canvas_y
    );
    canvas_buffer.rotate(rotation * degree);

    // Draw walls.
    var loop_counter = 3;
    do{
        canvas_buffer.beginPath();
        canvas_buffer.moveTo(
          0,
          0
        );
        canvas_buffer.lineTo(
          wall_splits[[0,0,2,4,][loop_counter]],
          wall_splits[[1,1,3,5,][loop_counter]]
        );
        canvas_buffer.lineTo(
          wall_splits[[2,4,6,6,][loop_counter]],
          wall_splits[[3,5,7,7,][loop_counter]]
        );
        canvas_buffer.closePath();
        canvas_buffer.fillStyle = colors[0][loop_counter];
        canvas_buffer.fill();
    }while(loop_counter--);

    canvas_buffer.beginPath();
    canvas_buffer.moveTo(
      -canvas_x,
      -canvas_x
    );
    canvas_buffer.lineTo(
      wall_splits[0],
      wall_splits[1]
    );
    canvas_buffer.lineTo(
      wall_splits[2],
      wall_splits[3]
    );
    canvas_buffer.lineTo(
      canvas_x,
      -canvas_x
    );
    canvas_buffer.closePath();
    canvas_buffer.fillStyle = colors[1][0];
    canvas_buffer.fill();

    canvas_buffer.beginPath();
    canvas_buffer.moveTo(
      -canvas_x,
      -canvas_x
    );
    canvas_buffer.lineTo(
      wall_splits[0],
      wall_splits[1]
    );
    canvas_buffer.lineTo(
      wall_splits[4],
      wall_splits[5]
    );
    canvas_buffer.lineTo(
      -canvas_x,
      canvas_x
    );
    canvas_buffer.closePath();
    canvas_buffer.fillStyle = colors[1][1];
    canvas_buffer.fill();

    canvas_buffer.beginPath();
    canvas_buffer.moveTo(
      canvas_x,
      -canvas_x
    );
    canvas_buffer.lineTo(
      wall_splits[2],
      wall_splits[3]
    );
    canvas_buffer.lineTo(
      wall_splits[6],
      wall_splits[7]
    );
    canvas_buffer.lineTo(
      canvas_x,
      canvas_x
    );
    canvas_buffer.closePath();
    canvas_buffer.fillStyle = colors[1][2];
    canvas_buffer.fill();

    canvas_buffer.beginPath();
    canvas_buffer.moveTo(
      -canvas_x,
      canvas_x
    );
    canvas_buffer.lineTo(
      wall_splits[4],
      wall_splits[5]
    );
    canvas_buffer.lineTo(
      wall_splits[6],
      wall_splits[7]
    );
    canvas_buffer.lineTo(
      canvas_x,
      canvas_x
    );
    canvas_buffer.closePath();
    canvas_buffer.fillStyle = colors[1][3];
    canvas_buffer.fill();

    // Restore buffer state.
    canvas_buffer.restore();

    // Draw current speed.
    canvas_buffer.fillStyle = '#fff';
    canvas_buffer.fillText(
      speed + ' m/s',
      5,
      25
    );
}

function logic(){
    if(key_left){
        rotation -= speed / 10 + 1;
    }
    if(key_right){
        rotation += speed / 10 + 1;
    }

    if(key_speedminus
      && speed > 0){
        speed -= 1;
    }
    if(key_speedplus){
        speed += 1;
    }

    var do_split = 0;

    // Move wall split location.
    var loop_counter = 3;
    do{
        wall_splits[loop_counter * 2] += wall_splits[loop_counter * 2] >= 0
          ? speed
          : -speed;
        wall_splits[loop_counter * 2 + 1] += wall_splits[loop_counter * 2 + 1] >= 0
          ? speed
          : -speed;

        // Check if wall split reached edge of screen.
        if(wall_splits[loop_counter * 2] < -canvas_x
          || wall_splits[loop_counter * 2] > canvas_x){
            // Reset wall splits.
            wall_splits[loop_counter * 2] = [
              -2,
              -2,
              2,
              -2,
              -2,
              2,
              2,
              2,
            ][loop_counter * 2];
            wall_splits[loop_counter * 2 + 1] = [
              -2,
              -2,
              2,
              -2,
              -2,
              2,
              2,
              2,
            ][loop_counter * 2 + 1];

            do_split = 1;
        }
    }while(loop_counter--);

    if(do_split){
        colors[1] = colors[0];
        colors[0] = [
          random_hex(),
          random_hex(),
          random_hex(),
          random_hex(),
        ];
    }
}

function setmode_logic(newgame){
    // Main menu mode.
    if(canvas_mode === 0){
        document.body.innerHTML = '<div><div><a onclick=canvas_setmode(1,true)>Enter the Tubes</a></div></div>'
          + '<div class=right><div><input disabled value=ESC>Main Menu<br>'
          + '<input id=movement-keys maxlength=2>Move ←→<br>'
          + '<input id=key-slowdown maxlength=1>Speed--<br>'
          + '<input id=key-speedup maxlength=1>Speed++</div><hr>'
          + '<div><input id=audio-volume max=1 min=0 step=0.01 type=range>Audio<br>'
          + '<input id=ms-per-frame>ms/Frame<br>'
          + '<a onclick=settings_reset()>Reset Settings</a></div></div>';
        settings_update();

    // New game mode.
    }else{
        if(newgame){
            settings_save();
        }

        key_left = false;
        key_right = false;
        key_speedminus = false;
        key_speedplus = false;
        speed = 10;
        rotation = 0;

        wall_splits = [
          -2,
          -2,
          2,
          -2,
          -2,
          2,
          2,
          2,
        ];

        // Set initial tube colors.
        colors = [
          ['#f0f', '#06f', '#ff0', '#f60'],// Initial
          ['#0f0', '#f00', '#00f', '#0ff'],// First swap
        ];
    }
}

var colors = [];
var degree = Math.PI / 180;
var key_left = false;
var key_right = false;
var key_speedminus = false;
var key_speedplus = false;
var rotation = 0;
var speed = 0;
var wall_splits = [];

window.onkeydown = function(e){
    if(canvas_mode <= 0){
        return;
    }

    var key = e.keyCode || e.which;

    // ESC: return to main menu.
    if(key === 27){
        canvas_setmode(0);
        return;
    }

    key = String.fromCharCode(key);

    if(key === settings_settings['movement-keys'][0]){
        key_left = true;

    }else if(key === settings_settings['movement-keys'][1]){
        key_right = true;

    }else if(key === settings_settings['key-slowdown']){
        key_speedminus = true;

    }else if(key === settings_settings['key-speedup']){
        key_speedplus = true;
    }
};

window.onkeyup = function(e){
    var key = String.fromCharCode(e.keyCode || e.which);

    if(key === settings_settings['movement-keys'][0]){
        key_left = false;

    }else if(key === settings_settings['movement-keys'][1]){
        key_right = false;

    }else if(key === settings_settings['key-slowdown']){
        key_speedminus = false;

    }else if(key === settings_settings['key-speedup']){
        key_speedplus = false;
    }
};

window.onload = function(){
    settings_init(
      'Tubes-2D3D.htm-',
      {
        'audio-volume': 1,
        'key-slowdown': 'S',
        'key-speedup': 'W',
        'movement-keys': 'AD',
        'ms-per-frame': 30,
      }
    );
    canvas_init();
};
