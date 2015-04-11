'use strict';
var canvas = document.getElementById("example");
var snd = new Audio("laser.mp3");

function play_snd() {
    snd.currentTime = 0;
    snd.play();
}
function clamp_speed(current, max) {
    //console.log('current' + current);
    //console.log('max' + max);
    //console.log('final ' + Math.min(Math.abs(current),max));
    return Math.min(Math.abs(current),max) * (current > 0 ? 1 : -1);
}
function clamp_y_speed(current, up, down) {
    if (current > 0) {
        return clamp_speed(current, down);
    } else {
        return clamp_speed(current, up);
    }
}
function keydownUp() {
  hero.speed.v.y -= hero.speed.a.y;
  hero.speed.v.y = clamp_y_speed(hero.speed.v.y, hero.speed.max.y.up,       hero.speed.max.y.down);
    console.log(hero.spee)
}
function keydownDown() {
}
function keydownLeft() {
    hero.speed.v.x -= hero.speed.a.x;
    //hero.speed.v.x = clamp_speed(hero.speed.v.x, hero.speed.max.x);
}
function keydownRight() {
    hero.speed.v.x += hero.speed.a.x;
    //hero.speed.v.x = clamp_speed(hero.speed.v.x, hero.speed.max.x);
}

function keyupLeft() {}
function keyupRight() {}
function keydownZ() {}
function keydownX() {}
function keyupZ() {}
function keyupX() {}
function keyupUp() {}
function keyupDown() {}

var keyMapDown = {
    38 : keydownUp,
    40 : keydownDown,
    37 : keydownLeft,
    39 : keydownRight,
    90 : keydownZ,
    88 : keydownX
};

var keyMapUp = {
    38 : keyupUp,
    40 : keyupDown,
    37 : keyupLeft,
    39 : keyupRight,
    90 : keyupZ,
    88 : keyupX
};
var ctx = canvas.getContext("2d");

var t_prev = 0;
var objects = [{pos:{x:200,y:100}, w:100, h: 50}];
objects.push({pos:{x:10, y:300}, w:700, h:30});
hero.pos.x = 20;
hero.pos.y = 100;
hero.w = 20;
hero.h = 40;

function draw_entity(ctx,entity) {
  ctx.strokeRect(entity.pos.x, entity.pos.y, entity.w, entity.h);
}
function draw_v(ctx, entity) {
  var centerx = entity.pos.x + entity.w/2
  var centery = entity.pos.y + entity.h/2
  ctx.beginPath();
  
  ctx.moveTo(centerx, centery);
  ctx.lineTo(centerx + entity.speed.v.x*10, centery + entity.speed.v.y*10)
  ctx.stroke();
}

function update(t) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    var delta = t - t_prev;
    t_prev = t;
    hero.speed.v.y += hero.speed.d.y;
    hero.speed.v.y = clamp_y_speed(hero.speed.v.y, hero.speed.max.y.up, hero.speed.max.y.down);
    console.log(hero.speed.v.y);
    
    var direction = (hero.speed.x > 0) ? 1 : -1;
    hero.speed.v.x = Math.abs(hero.speed.v.x) - hero.speed.d.x;
    if (hero.speed.v.x < 0) {
        hero.speed.v.x = 0;
    } else {
        hero.speed.v.x *= direction;
    }
    //console.log(hero.speed.v.x);
    
    hero.speed.v.x = clamp_speed(hero.speed.v.x, hero.speed.max.x);

    //console.log('--------------------------');
    hero.pos.x = hero.pos.x + hero.speed.v.x;
    for (var i = 0; i < objects.length; i++) {
      if (collides(hero, objects[i])) {
        check_x_velocity(hero, objects[i], hero.speed.v);
      }
    }
    
    hero.pos.y = hero.pos.y + hero.speed.v.y;
    
    for (var i = 0; i < objects.length; i++) {
     if (collides(hero, objects[i])) {
       check_y_velocity(hero, objects[i], hero.speed.v);
     }
    }
    
    for(var i = 0; i < objects.length; i++) {
      draw_entity(ctx, objects[i]);
    }
    draw_entity(ctx, hero);
    draw_v(ctx, hero);
    
    window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);
document.onkeydown = function (event) {
    if (keyMapDown[event.keyCode]) {
        keyMapDown[event.keyCode].call();
    } else {
        document.getElementById('key').innerHTML = event.keyCode;
    }
};
 
document.onkeyup = function (event) {
        document.getElementById('key').innerHTML = 'up:' + event.keyCode;
    if (keyMapUp[event.keyCode]) {
        keyMapUp[event.keyCode].call();
    } else {
        document.getElementById('key').innerHTML = event.keyCode;
    }
};
