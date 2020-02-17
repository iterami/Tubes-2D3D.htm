'use strict';

function draw_logic(){
    // Save current buffer state.
    canvas_buffer.save();

    // Setup translate/rotation for wall drawing.
    canvas_buffer.translate(
      canvas_properties['width-half'],
      canvas_properties['height-half']
    );
    canvas_buffer.rotate(math_degrees_to_radians({
      'degrees': rotation,
    }));

    // Draw walls.
    let loop_counter = 3;
    do{
        canvas_draw_path({
          'properties': {
            'fillStyle': colors[0][loop_counter],
          },
          'vertices': [
            {
              'type': 'moveTo',
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
          'x': -canvas_properties['width-half'],
          'y': -canvas_properties['width-half'],
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
          'x': canvas_properties['width-half'],
          'y': -canvas_properties['width-half'],
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
          'x': -canvas_properties['width-half'],
          'y': -canvas_properties['width-half'],
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
          'x': -canvas_properties['width-half'],
          'y': canvas_properties['width-half'],
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
          'x': canvas_properties['width-half'],
          'y': -canvas_properties['width-half'],
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
          'x': canvas_properties['width-half'],
          'y': canvas_properties['width-half'],
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
          'x': -canvas_properties['width-half'],
          'y': canvas_properties['width-half'],
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
          'x': canvas_properties['width-half'],
          'y': canvas_properties['width-half'],
        },
      ],
    });

    // Restore buffer state.
    canvas_buffer.restore();
}

function logic(){
    if(core_keys[core_storage_data['move-←']]['state']){
        rotation -= speed / 10 + 1;
    }
    if(core_keys[core_storage_data['move-→']]['state']){
        rotation += speed / 10 + 1;
    }
    if(core_keys[core_storage_data['move-↓']]['state']
      && speed > 0){
        speed -= 1;
    }
    if(core_keys[core_storage_data['move-↑']]['state']){
        speed += 1;
    }

    let do_split = false;

    // Move wall split location.
    let loop_counter = 3;
    do{
        const double = loop_counter * 2;

        wall_splits[double] += wall_splits[double] >= 0
          ? speed
          : -speed;
        wall_splits[double + 1] += wall_splits[double + 1] >= 0
          ? speed
          : -speed;

        // Check if wall split reached edge of screen.
        if(wall_splits[double] < -canvas_properties['width-half']
          || wall_splits[double] > canvas_properties['width-half']){
            // Reset wall splits.
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

function repo_escape(){
    if(wall_splits.length === 0
      && !core_menu_open){
        core_repo_reset();
    }
}

function repo_init(){
    core_repo_init({
      'events': {
        'enter': {
          'onclick': core_repo_reset,
        },
      },
      'globals': {
        'colors': [],
        'rotation': 0,
        'speed': 0,
        'wall_splits': [],
      },
      'info': '<input id=enter type=button value="Enter the Tubes">',
      'menu': true,
      'reset': canvas_setmode,
      'title': 'Tubes-2D3D.htm',
      'ui': '<span id=speed></span> m/s',
    });
    canvas_init();
}
