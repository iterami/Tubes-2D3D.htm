'use strict';

function load_data(id){
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

    colors = [
      ['#f0f', '#06f', '#ff0', '#f60'],
      ['#0f0', '#f00', '#00f', '#0ff'],
    ];
}

function repo_drawlogic(){
    if(!colors[0]){
        return;
    }

    canvas.save();
    canvas.translate(
      canvas_properties['width-half'],
      canvas_properties['height-half']
    );
    canvas.rotate(math_degrees_to_radians(rotation));

    let loop_counter = 3;
    do{
        canvas_draw_path({
          'properties': {
            'fillStyle': colors[0][loop_counter],
          },
          'vertices': [
            [
              'moveTo',
              0,
              0,
            ],
            [
              'lineTo',
              wall_splits[[0,0,2,4,][loop_counter]],
              wall_splits[[1,1,3,5,][loop_counter]],
            ],
            [
              'lineTo',
              wall_splits[[2,4,6,6,][loop_counter]],
              wall_splits[[3,5,7,7,][loop_counter]],
            ],
          ],
        });
    }while(loop_counter--);

    const half = Math.max(
      canvas_properties['width-half'],
      canvas_properties['height-half']
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
          wall_splits[0],
          wall_splits[1],
        ],
        [
          'lineTo',
          wall_splits[2],
          wall_splits[3],
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
          wall_splits[0],
          wall_splits[1],
        ],
        [
          'lineTo',
          wall_splits[4],
          wall_splits[5],
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
          wall_splits[2],
          wall_splits[3],
        ],
        [
          'lineTo',
          wall_splits[6],
          wall_splits[7],
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
          wall_splits[4],
          wall_splits[5],
        ],
        [
          'lineTo',
          wall_splits[6],
          wall_splits[7],
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
    if(wall_splits.length === 0
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
        'wall_splits': [],
      },
      'info': '<button id=enter type=button>Enter the Tubes</button>',
      'menu': true,
      'pointerbinds': {},
      'storage-controls': true,
      'title': 'Tubes-2D3D.htm',
      'ui': '<span id=speed></span> m/s',
    });
    canvas_init({
      'cursor': 'pointer',
    });
}

function repo_logic(){
    let move_left = core_keys[core_storage_data['move-←']]['state'];
    let move_right = core_keys[core_storage_data['move-→']]['state'];
    let speed_down = core_keys[core_storage_data['move-↓']]['state'];
    let speed_up = core_keys[core_storage_data['move-↑']]['state'];
    if(core_pointer['down-0']){
        const x = core_pointer['x'] / globalThis.innerWidth;
        const y = core_pointer['y'] / globalThis.innerHeight;
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
        rotation -= speed / 10 + 1;
    }
    if(move_right){
        rotation += speed / 10 + 1;
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

    let do_split = false;
    const half = Math.max(
      canvas_properties['width-half'],
      canvas_properties['height-half']
    );

    let loop_counter = 3;
    do{
        const double = loop_counter * 2;

        wall_splits[double] += wall_splits[double] >= 0
          ? speed
          : -speed;
        wall_splits[double + 1] += wall_splits[double + 1] >= 0
          ? speed
          : -speed;

        if(wall_splits[double] < -half
          || wall_splits[double] > half){
            wall_splits[double] = [
              -2,
              -2,
              2,
              -2,
              -2,
              2,
              2,
              2,
            ][double];
            wall_splits[double + 1] = [
              -2,
              -2,
              2,
              -2,
              -2,
              2,
              2,
              2,
            ][double + 1];

            do_split = true;
        }
    }while(loop_counter--);

    if(do_split){
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
