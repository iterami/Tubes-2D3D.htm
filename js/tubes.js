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
    buffer.rotate(rotation * (Math.PI / 180));

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
    buffer.rotate(-rotation * (Math.PI / 180));
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
        get('buffer'),
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

function get(i){
    return document.getElementById(i);
}

function random_hex(){
    return '0123456789abcdef'.charAt(Math.floor(Math.random() * 16));
}

function resize(){
    if(mode > 0){
        width = window.innerWidth;
        get('buffer').width = width;
        get('canvas').width = width;

        height = window.innerHeight;
        get('buffer').height = height;
        get('canvas').height = height;

        x = width / 2;
        y = height / 2;
    }
}

function save(){
    i = 1;
    do{
        j = [
            'audio-volume',
            'ms-per-frame'
        ][i];

        if(get(j).value == [1, 30][i] || isNaN(get(j).value) || get(j).value < [0, 1][i]){
            ls.removeItem('tubes-' + i);
            settings[i] = [
                1,
                30
            ][i];
            get(j).value = settings[i];

        }else{
            settings[i] = parseFloat(get(j).value);
            ls.setItem(
                'tubes-' + i,
                settings[i]
            );
        }
    }while(i--);

    i = 2;
    do{
        if(get(['movement-keys', 'key-slowdown', 'key-speedup'][i]).value == ['AD', 'S', 'W'][i]){
            ls.removeItem('tubes-' + (i + 2));
            settings[i + 2] = [
                'AD',
                'S',
                'W'
            ][i];

        }else{
            settings[i + 2] = get(['movement-keys', 'key-slowdown', 'key-speedup'][i]).value;
            ls.setItem(
                'tubes-' + (i + 2),
                settings[i + 2]
            );
        }
    }while(i--);

    settings[5] = get('clear').checked;
    if(settings[5]){
        ls.removeItem('tubes-5');

    }else{
        ls.setItem(
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

        get('page').innerHTML = '<canvas id=canvas></canvas>';

        buffer = get('buffer').getContext('2d');
        canvas = get('canvas').getContext('2d');

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

        get('page').innerHTML = '<div style=display:inline-block;text-align:left;vertical-align:top><div class=c><a href=/><b>Tubes</b></a></div><hr><div class=c style=color:#f00>SEIZURE WARNING!<br>FLASHING COLORS!</div><hr><div class=c><a onclick=setmode(1)>Make Mama Sick</a></div></div><div style="border-left:8px solid #222;display:inline-block;text-align:left"><div class=c><input disabled size=3 style=border:0 value=ESC>Main Menu<br><input id=movement-keys maxlength=2 size=3 value='
            + settings[2] + '>Move ←→<br><input id=key-slowdown maxlength=1 size=3 value='
            + settings[3] + '>Speed--<br><input id=key-speedup maxlength=1 size=3 value='
            + settings[4] + '>Speed++</div><hr><div class=c><input id=audio-volume max=1 min=0 step=.01 type=range value='
            + settings[0] + '>Audio<br><label><input '
            + (settings[5] ? 'checked ' : '') + 'id=clear type=checkbox>Clear</label><br><input id=ms-per-frame size=1 value='
            + settings[1] + '>ms/Frame<br><a onclick="if(confirm(\'Reset settings?\')){get(\'clear\').checked=get(\'audio-volume\').value=1;get(\'movement-keys\').value=\'AD\';get(\'key-slowdown\').value=\'S\';get(\'key-speedup\').value=\'W\';get(\'ms-per-frame\').value=30;save();setmode(0)}">Reset Settings</a></div></div>';
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
var ls = window.localStorage;
var mode = 0;
var mx = 0;
var my = 0;
var px = 0;
var py = 0;
var rotation = 0;
var settings = [
    ls.getItem('tubes-0') === null ?    1 : parseFloat(ls.getItem('tubes-0')),// audio volume
    ls.getItem('tubes-1') === null ?   30 : parseInt(ls.getItem('tubes-1')),// milliseconds per frame
    ls.getItem('tubes-2') === null ? 'AD' : ls.getItem('tubes-2'),// movement keys
    ls.getItem('tubes-3') === null ?  'S' : ls.getItem('tubes-3'),// slowdown key
    ls.getItem('tubes-4') === null ?  'W' : ls.getItem('tubes-4'),// speedup key
    ls.getItem('tubes-5') === null// clear?
];
var speed = 0;
var wall_splits = [];
var width = 0;
var x = 0;
var y = 0;

setmode(0);

window.onkeydown = function(e){
    if(mode > 0){
        i = window.event ? event : e;
        i = i.charCode ? i.charCode : i.keyCode;

        if(String.fromCharCode(i) === settings[2][0]){
            key_left = 1;

        }else if(String.fromCharCode(i) === settings[2][1]){
            key_right = 1;

        }else if(String.fromCharCode(i) === settings[3]){
            key_speedminus = 1;

        }else if(String.fromCharCode(i) === settings[4]){
            key_speedplus = 1;

        }else if(i === 27){// ESC
            setmode(0);
        }
    }
};

window.onkeyup = function(e){
    i = window.event ? event : e;
    i = i.charCode ? i.charCode : i.keyCode;

    if(String.fromCharCode(i) === settings[2][0]){
        key_left = 0;

    }else if(String.fromCharCode(i) === settings[2][1]){
        key_right = 0;

    }else if(String.fromCharCode(i) === settings[3]){
        key_speedminus = 0;

    }else if(String.fromCharCode(i) === settings[4]){
        key_speedplus = 0;
    }
};

window.onresize = resize;
