function draw(){
    if(key_left){
        rotation -= speed / 10 + 1;
    }
    if(key_right){
        rotation += speed / 10 + 1;
    }

    if(key_speedminus && speed > 0){
        speed -= 1;
    }
    if(key_speedplus){
        speed += 1;
    }

    var no_blink_fix = 1;
    do_split = 0;

    // move wall split location
    i = 3;
    do{
        wall_splits[i * 2] += wall_splits[i * 2] >= 0 ? speed : -speed;
        wall_splits[i * 2 + 1] += wall_splits[i * 2 + 1] >= 0 ? speed : -speed;

        // check if wall split reached edge of screen
        if(wall_splits[i * 2] < -x || wall_splits[i * 2] > x){
            // this temporary variable prevents blinking bug
            no_blink_fix = 0;

            // reset wall splits
            wall_splits[i * 2] = [
              -2,
              -2,
              2,
              -2,
              -2,
              2,
              2,
              2
            ][i * 2];
            wall_splits[i * 2 + 1] = [
              -2,
              -2,
              2,
              -2,
              -2,
              2,
              2,
              2
            ][i * 2 + 1];

            do_split = 1;
        }
    }while(i--);

    if(settings[5]){// clear?
        buffer.clearRect(
          0,
          0,
          width,
          height
        );
    }

    buffer.translate(
      x,
      y
    );
    buffer.rotate(rotation * pi_divide_180);

    // draw walls
    draw_walls(no_blink_fix);

    if(do_split){
        colors[1] = colors[0];
        colors[0] = [
          '#' + random_hex() + random_hex() + random_hex(),
          '#' + random_hex() + random_hex() + random_hex(),
          '#' + random_hex() + random_hex() + random_hex(),
          '#' + random_hex() + random_hex() + random_hex()
        ];
    }

    // undo rotate/translate
    buffer.rotate(-rotation * pi_divide_180);
    buffer.translate(
      -x,
      -y
    );

    // draw current speed
    buffer.font = '23pt sans-serif';
    buffer.textAlign = 'left';
    buffer.textBaseline = 'top';
    buffer.fillStyle = '#fff';
    buffer.fillText(
      speed + ' m/s',
      5,
      5
    );

    if(settings[5]){// clear?
        canvas.clearRect(
          0,
          0,
          width,
          height
        );
    }
    canvas.drawImage(
      document.getElementById('buffer'),
      0,
      0
    );
}

function draw_walls(no_blink_fix){
    if(no_blink_fix){
        i = 3;
        do{
            buffer.beginPath();
            buffer.moveTo(
              0,
              0
            );
            buffer.lineTo(
              wall_splits[[0,0,2,4][i]],
              wall_splits[[1,1,3,5][i]]
            );
            buffer.lineTo(
              wall_splits[[2,4,6,6][i]],
              wall_splits[[3,5,7,7][i]]
            );
            buffer.closePath();
            buffer.fillStyle = colors[0][i];
            buffer.fill();
        }while(i--);
    }

    buffer.beginPath();
    buffer.moveTo(
      -x,
      -x
    );
    buffer.lineTo(
      wall_splits[0],
      wall_splits[1]
    );
    buffer.lineTo(
      wall_splits[2],
      wall_splits[3]
    );
    buffer.lineTo(
      x,
      -x
    );
    buffer.closePath();
    buffer.fillStyle = colors[no_blink_fix][0];
    buffer.fill();

    buffer.beginPath();
    buffer.moveTo(
      -x,
      -x
    );
    buffer.lineTo(
      wall_splits[0],
      wall_splits[1]
    );
    buffer.lineTo(
      wall_splits[4],
      wall_splits[5]
    );
    buffer.lineTo(
      -x,
      x
    );
    buffer.closePath();
    buffer.fillStyle = colors[no_blink_fix][1];
    buffer.fill();

    buffer.beginPath();
    buffer.moveTo(
      x,
      -x
    );
    buffer.lineTo(
      wall_splits[2],
      wall_splits[3]
    );
    buffer.lineTo(
      wall_splits[6],
      wall_splits[7]
    );
    buffer.lineTo(
      x,
      x
    );
    buffer.closePath();
    buffer.fillStyle = colors[no_blink_fix][2];
    buffer.fill();

    buffer.beginPath();
    buffer.moveTo(
      -x,
      x
    );
    buffer.lineTo(
      wall_splits[4],
      wall_splits[5]
    );
    buffer.lineTo(
      wall_splits[6],
      wall_splits[7]
    );
    buffer.lineTo(
      x,
      x
    );
    buffer.closePath();
    buffer.fillStyle = colors[no_blink_fix][3];
    buffer.fill();

    if(!no_blink_fix){
        i = 3;
        do{
            buffer.beginPath();
            buffer.moveTo(
              0,
              0
            );
            buffer.lineTo(
              wall_splits[[0,0,2,4][i]],
              wall_splits[[1,1,3,5][i]]
            );
            buffer.lineTo(
              wall_splits[[2,4,6,6][i]],
              wall_splits[[3,5,7,7][i]]
            );
            buffer.closePath();
            buffer.fillStyle = colors[1][i];
            buffer.fill();
        }while(i--);
    }
}

function random_hex(){
    return '0123456789abcdef'.charAt(Math.floor(Math.random() * 16));
}

function reset(){
    if(confirm('Reset settings?')){
        document.getElementById('audio-volume').value = 1;
        document.getElementById('clear').checked = 1;
        document.getElementById('key-slowdown').value = 'S';
        document.getElementById('key-speedup').value = 'W';
        document.getElementById('movement-keys').value = 'AD';
        document.getElementById('ms-per-frame').value = 30;
        save();
    }
}

function resize(){
    if(mode > 0){
        height = window.innerHeight;
        document.getElementById('buffer').height = height;
        document.getElementById('canvas').height = height;
        y = height / 2;

        width = window.innerWidth;
        document.getElementById('buffer').width = width;
        document.getElementById('canvas').width = width;
        x = width / 2;
    }
}

function save(){
    i = 1;
    do{
        j = [
          'audio-volume',
          'ms-per-frame'
        ][i];

        if(document.getElementById(j).value == [1, 30][i] || isNaN(document.getElementById(j).value) || document.getElementById(j).value < [0, 1][i]){
            window.localStorage.removeItem('tubes-' + i);
            settings[i] = [
              1,
              30
            ][i];
            document.getElementById(j).value = settings[i];

        }else{
            settings[i] = parseFloat(document.getElementById(j).value);
            window.localStorage.setItem(
              'tubes-' + i,
              settings[i]
            );
        }
    }while(i--);

    i = 2;
    do{
        if(document.getElementById(['movement-keys', 'key-slowdown', 'key-speedup'][i]).value == ['AD', 'S', 'W'][i]){
            window.localStorage.removeItem('tubes-' + (i + 2));
            settings[i + 2] = [
              'AD',
              'S',
              'W'
            ][i];

        }else{
            settings[i + 2] = document.getElementById(['movement-keys', 'key-slowdown', 'key-speedup'][i]).value;
            window.localStorage.setItem(
              'tubes-' + (i + 2),
              settings[i + 2]
            );
        }
    }while(i--);

    settings[5] = document.getElementById('clear').checked;
    if(settings[5]){
        window.localStorage.removeItem('tubes-5');

    }else{
        window.localStorage.setItem(
          'tubes-5',
          0
        );
    }
}

function setmode(newmode){
    clearInterval(interval);

    mode = newmode;

    // new game mode
    if(mode > 0){
        save();

        key_left = 0;
        key_right = 0;
        key_speedminus = 0;
        key_speedplus = 0;
        speed = 10;
        rotation = 0;

        document.getElementById('page').innerHTML = '<canvas id=canvas></canvas>';

        buffer = document.getElementById('buffer').getContext('2d');
        canvas = document.getElementById('canvas').getContext('2d');

        resize();

        wall_splits = [
          -2,
          -2,
          2,
          -2,
          -2,
          2,
          2,
          2
        ];

        // set initial tube colors
        colors = [
          ['#f0f', '#06f', '#ff0', '#f60'],// initial
          ['#0f0', '#f00', '#00f', '#0ff']// first swap
        ];

        interval = setInterval('draw()', settings[1]);// milliseconds per frame

    // main menu mode
    }else{
        buffer = 0;
        canvas = 0;

        document.getElementById('page').innerHTML = '<div style=display:inline-block;text-align:left;vertical-align:top><div class=c><b>Tubes-2D3D.htm</b></div><hr><div class=c style=color:#f00>SEIZURE WARNING!<br>FLASHING COLORS!</div><hr><div class=c><ul><li><a onclick=setmode(1)>Make Mama Sick</a></ul></div></div><div style="border-left:8px solid #222;display:inline-block;text-align:left"><div class=c><input disabled style=border:0 value=ESC>Main Menu<br><input id=movement-keys maxlength=2 value='
          + settings[2] + '>Move ←→<br><input id=key-slowdown maxlength=1 value='
          + settings[3] + '>Speed--<br><input id=key-speedup maxlength=1 value='
          + settings[4] + '>Speed++</div><hr><div class=c><input id=audio-volume max=1 min=0 step=.01 type=range value='
          + settings[0] + '>Audio<br><label><input '
          + (settings[5] ? 'checked ' : '') + 'id=clear type=checkbox>Clear</label><br><input id=ms-per-frame value='
          + settings[1] + '>ms/Frame<br><a onclick=reset()>Reset Settings</a></div></div>';
    }
}

var buffer = 0;
var canvas = 0;
var colors = [];
var do_split = 0;
var height = 0;
var i = 0;
var interval = 0;
var j = 0;
var key_left = 0;
var key_right = 0;
var key_speedminus = 0;
var key_speedplus = 0;
var mode = 0;
var mx = 0;
var my = 0;
var pi_divide_180 = Math.PI / 180;
var px = 0;
var py = 0;
var rotation = 0;
var settings = [
  window.localStorage.getItem('tubes-0') === null
    ? 1
    : parseFloat(window.localStorage.getItem('tubes-0')),// audio volume
  window.localStorage.getItem('tubes-1') === null
    ? 30
    : parseInt(window.localStorage.getItem('tubes-1')),// milliseconds per frame
  window.localStorage.getItem('tubes-2') === null
    ? 'AD'
    : window.localStorage.getItem('tubes-2'),// movement keys
  window.localStorage.getItem('tubes-3') === null
    ? 'S'
    : window.localStorage.getItem('tubes-3'),// slowdown key
  window.localStorage.getItem('tubes-4') === null
    ? 'W'
    : window.localStorage.getItem('tubes-4'),// speedup key
  window.localStorage.getItem('tubes-5') === null// clear?
];
var speed = 0;
var wall_splits = [];
var width = 0;
var x = 0;
var y = 0;

setmode(0);

window.onkeydown = function(e){
    if(mode > 0){
        var key = window.event ? event : e;
        key = key.charCode ? key.charCode : key.keyCode;

        if(key === 27){// ESC
            setmode(0);

        }else{
            key = String.fromCharCode(key);

            if(key === settings[2][0]){
                key_left = 1;

            }else if(key === settings[2][1]){
                key_right = 1;

            }else if(key === settings[3]){
                key_speedminus = 1;

            }else if(key === settings[4]){
                key_speedplus = 1;
            }
        }
    }
};

window.onkeyup = function(e){
    var key = window.event ? event : e;
    key = String.fromCharCode(key.charCode ? key.charCode : key.keyCode);

    if(key === settings[2][0]){
        key_left = 0;

    }else if(key === settings[2][1]){
        key_right = 0;

    }else if(key === settings[3]){
        key_speedminus = 0;

    }else if(key === settings[4]){
        key_speedplus = 0;
    }
};

window.onresize = resize;
