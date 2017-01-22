'use strict';

function draw_logic(){
    // Save current buffer state.
    canvas_buffer.save();

    // Setup translate/rotation for wall drawing.
    canvas_buffer.translate(
      canvas_x,
      canvas_y
    );
    canvas_buffer.rotate(rotation * math_degree);

    // Draw walls.
    var loop_counter = 3;
    do{
        canvas_draw_path({
          'properties': {
            'fillStyle': colors[0][loop_counter],
          },
          'vertices': [
            {
              'type': 'moveTo',
              'x': 0,
              'y': 0,
            },
            {
              'x': wall_splits[[0,0,2,4,][loop_counter]],
              'y': wall_splits[[1,1,3,5,][loop_counter]],
            },
            {
              'x': wall_splits[[2,4,6,6,][loop_counter]],
              'y': wall_splits[[3,5,7,7,][loop_counter]],
            },
          ],
        });
    }while(loop_counter--);

    canvas_draw_path({
      'properties': {
        'fillStyle': colors[1][0],
      },
      'vertices': [
        {
          'type': 'moveTo',
          'x': -canvas_x,
          'y': -canvas_x,
        },
        {
          'x': wall_splits[0],
          'y': wall_splits[1],
        },
        {
          'x': wall_splits[2],
          'y': wall_splits[3],
        },
        {
          'x': canvas_x,
          'y': -canvas_x,
        },
      ],
    });
    canvas_draw_path({
      'properties': {
        'fillStyle': colors[1][1],
      },
      'vertices': [
        {
          'type': 'moveTo',
          'x': -canvas_x,
          'y': -canvas_x,
        },
        {
          'x': wall_splits[0],
          'y': wall_splits[1],
        },
        {
          'x': wall_splits[4],
          'y': wall_splits[5],
        },
        {
          'x': -canvas_x,
          'y': canvas_x,
        },
      ],
    });
    canvas_draw_path({
      'properties': {
        'fillStyle': colors[1][2],
      },
      'vertices': [
        {
          'type': 'moveTo',
          'x': canvas_x,
          'y': -canvas_x,
        },
        {
          'x': wall_splits[2],
          'y': wall_splits[3],
        },
        {
          'x': wall_splits[6],
          'y': wall_splits[7],
        },
        {
          'x': canvas_x,
          'y': canvas_x,
        },
      ],
    });
    canvas_draw_path({
      'properties': {
        'fillStyle': colors[1][3],
      },
      'vertices': [
        {
          'type': 'moveTo',
          'x': -canvas_x,
          'y': canvas_x,
        },
        {
          'x': wall_splits[4],
          'y': wall_splits[5],
        },
        {
          'x': wall_splits[6],
          'y': wall_splits[7],
        },
        {
          'x': canvas_x,
          'y': canvas_x,
        },
      ],
    });

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
    if(canvas_menu){
        return;
    }

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
        document.body.innerHTML = '<div><div><a onclick=canvas_setmode({mode:1,newgame:true})>Enter the Tubes</a></div></div>'
          + '<div class=right><div><input disabled value=ESC>Menu<br>'
          + '<input id=movement-keys maxlength=2>Move ←→<br>'
          + '<input id=key-slowdown maxlength=1>Speed--<br>'
          + '<input id=key-speedup maxlength=1>Speed++</div><hr>'
          + '<div><input id=audio-volume max=1 min=0 step=0.01 type=range>Audio<br>'
          + '<input id=ms-per-frame>ms/Frame<br>'
          + '<a onclick=storage_reset()>Reset Settings</a></div></div>';
        storage_update();

    // New game mode.
    }else{
        if(newgame){
            storage_save();
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
var key_left = false;
var key_right = false;
var key_speedminus = false;
var key_speedplus = false;
var rotation = 0;
var speed = 0;
var wall_splits = [];

window.onload = function(){
    storage_init({
      'data': {
        'audio-volume': 1,
        'key-slowdown': 'S',
        'key-speedup': 'W',
        'movement-keys': 'AD',
        'ms-per-frame': 30,
      },
      'prefix': 'Tubes-2D3D.htm-',
    });
    canvas_init();

    window.onkeydown = function(e){
        if(canvas_mode <= 0){
            return;
        }

        var key = e.keyCode || e.which;

        // ESC: menu.
        if(key === 27){
            canvas_menu_toggle();
            return;
        }

        key = String.fromCharCode(key);

        if(key === storage_data['movement-keys'][0]){
            key_left = true;

        }else if(key === storage_data['movement-keys'][1]){
            key_right = true;

        }else if(key === storage_data['key-slowdown']){
            key_speedminus = true;

        }else if(key === storage_data['key-speedup']){
            key_speedplus = true;

        }else if(key === 'Q'){
            canvas_menu_quit();
        }
    };

    window.onkeyup = function(e){
        var key = String.fromCharCode(e.keyCode || e.which);

        if(key === storage_data['movement-keys'][0]){
            key_left = false;

        }else if(key === storage_data['movement-keys'][1]){
            key_right = false;

        }else if(key === storage_data['key-slowdown']){
            key_speedminus = false;

        }else if(key === storage_data['key-speedup']){
            key_speedplus = false;
        }
    };
};
