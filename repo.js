'use strict';

function repo_drawlogic(){
    if(!colors.length){
        return;
    }

    canvas.save();
    canvas.translate(
      canvas_properties.width_half,
      canvas_properties.height_half
    );
    canvas.rotate(math_degrees_to_radians(rotation));

    for(let i = 0; i < 4; i++){
        canvas_draw_path({
          'properties': {
            'fillStyle': colors[0][i],
          },
          'vertices': [
            [
              'moveTo',
              0,
              0,
            ],
            [
              'lineTo',
              walls[[0,0,2,4,][i]],
              walls[[1,1,3,5,][i]],
            ],
            [
              'lineTo',
              walls[[2,4,6,6,][i]],
              walls[[3,5,7,7,][i]],
            ],
          ],
        });
    }

    const half = Math.max(
      canvas_properties.width_half,
      canvas_properties.height_half
    );
    canvas_draw_path({
      'properties': {
        'fillStyle': colors[1][0],
      },
      'vertices': [
        [
          'moveTo',
          -half,
          -half,
        ],
        [
          'lineTo',
          walls[0],
          walls[1],
        ],
        [
          'lineTo',
          walls[2],
          walls[3],
        ],
        [
          'lineTo',
          half,
          -half,
        ],
      ],
    });
    canvas_draw_path({
      'properties': {
        'fillStyle': colors[1][1],
      },
      'vertices': [
        [
          'moveTo',
          -half,
          -half,
        ],
        [
          'lineTo',
          walls[0],
          walls[1],
        ],
        [
          'lineTo',
          walls[4],
          walls[5],
        ],
        [
          'lineTo',
          -half,
          half,
        ],
      ],
    });
    canvas_draw_path({
      'properties': {
        'fillStyle': colors[1][2],
      },
      'vertices': [
        [
          'moveTo',
          half,
          -half,
        ],
        [
          'lineTo',
          walls[2],
          walls[3],
        ],
        [
          'lineTo',
          walls[6],
          walls[7],
        ],
        [
          'lineTo',
          half,
          half,
        ],
      ],
    });
    canvas_draw_path({
      'properties': {
        'fillStyle': colors[1][3],
      },
      'vertices': [
        [
          'moveTo',
          -half,
          half,
        ],
        [
          'lineTo',
          walls[4],
          walls[5],
        ],
        [
          'lineTo',
          walls[6],
          walls[7],
        ],
        [
          'lineTo',
          half,
          half,
        ],
      ],
    });

    canvas.restore();
}

function repo_escape(){
    if(!colors.length
      && !core_menu_open){
        canvas_setmode();
    }
}

function repo_init(){
    core_repo_init({
      'events': {
        'enter': {
          'onclick': canvas_setmode,
        },
      },
      'globals': {
        'colors': [],
        'rotation': 0,
        'speed': 0,
        'walls': [],
      },
      'info': '<button class=medium id=enter type=button>Enter the Tubes</button>',
      'menu': true,
      'pointerbinds': {},
      'storage_controls': true,
      'title': 'Tubes-2D3D.htm',
      'ui': ' <span id=speed>0</span> m/s',
    });
    canvas_init({
      'cursor': 'pointer',
    });
}

function repo_load(id){
    speed = 10;
    rotation = 0;

    walls = [
      -2, -2, 2, -2,
      -2, 2, 2, 2,
    ];

    colors = [
      ['#f0f', '#06f', '#ff0', '#f60'],
      ['#0f0', '#f00', '#00f', '#0ff'],
    ];
}

function repo_logic(){
    let move_left = core_keys[core_storage_data.move_left].state;
    let move_right = core_keys[core_storage_data.move_right].state;
    let speed_down = core_keys[core_storage_data.move_down].state;
    let speed_up = core_keys[core_storage_data.move_up].state;
    if(core_pointer.down_0){
        const x = core_pointer.x / globalThis.innerWidth;
        const y = core_pointer.y / globalThis.innerHeight;
        if(x < .5){
            if(y < x){
                speed_up = true;

            }else if(y > 1 - x){
                speed_down = true;

            }else{
                move_left = true;
            }

        }else if(x < y){
            speed_down = true;

        }else if(x < 1 - y){
            speed_up = true;

        }else{
            move_right = true;
        }
    }

    if(move_left){
        rotation -= speed / 25 + 1;
    }
    if(move_right){
        rotation += speed / 25 + 1;
    }
    if(speed_down){
        speed = Math.max(
          --speed,
          0
        );
    }
    if(speed_up){
        speed += 1;
    }

    let switched = false;
    const half = Math.max(
      canvas_properties.width_half,
      canvas_properties.height_half
    );
    for(let i = 0; i < 4; i++){
        const double = i * 2;

        walls[double] += walls[double] >= 0
          ? speed
          : -speed;
        walls[double + 1] += walls[double + 1] >= 0
          ? speed
          : -speed;

        if(walls[double] < -half
          || walls[double] > half){
            walls[double] = [
              -2, -2, 2, -2,
              -2, 2, 2, 2,
            ][double];
            walls[double + 1] = [
              -2, -2, 2, -2,
              -2, 2, 2, 2,
            ][double + 1];

            switched = true;
        }
    }
    if(switched){
        colors[1] = colors[0];
        colors[0] = [
          '#' + core_random_hex(),
          '#' + core_random_hex(),
          '#' + core_random_hex(),
          '#' + core_random_hex(),
        ];
    }

    core_ui_update({
      'ids': {
        'speed': speed,
      },
    });
}
