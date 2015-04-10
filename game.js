'use strict';
var canvas = document.getElementById("example");
var snd = new Audio("laser.mp3");
function play_snd() {
    snd.currentTime = 0;
    snd.play();
}
var hero = {
    pos : {x: 0, y :0},
    w:0,
    h:0,
    v : {x:0, y:0},
    throttle: 1,
    maxspeed: 1
}

function keydownUp() {
  hero.v.y -= 20;
  if (Math.abs(hero.v.y) > 20) {
     hero.v.y = 20 * (hero.v.y < 0)? -1:1;
  }
}
function keydownDown() {
  hero.v.y += hero.throttle;
  if (Math.abs(hero.v.y) > hero.maxspeed) {
     hero.v.y = hero.maxspeed * (hero.v.x < 0)? -1:1;
  }
}
function keydownLeft() {
    hero.v.x -= hero.throttle;
    if (Math.abs(hero.v.x) > hero.maxspeed) {
        hero.v.x = hero.maxspeed * (hero.v.x < 0)? -1:1;
    }
}
function keydownRight() {
    hero.v.x += hero.throttle;
    if (Math.abs(hero.v.x) > hero.maxspeed) {
        hero.v.x = hero.maxspeed * (hero.v.x < 0)? -1:1;
    }
}

function keyupLeft() {
  hero.v.x = 0;
}
function keyupRight() {
  hero.v.x = 0;
}

function keydownZ() {}
function keydownX() {}
function keyupZ() {}
function keyupX() {}
function keyupUp(){
}
function keyupDown(){
  hero.v.y = 0;
}

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
ctx.fillRect(0, 10, 3, 3);
var x = 0;
var vel = 0.1;
var t_prev = 0;
var objects = [{pos:{x:200,y:100}, w:100, h: 50}];
objects.push({pos:{x:10, y:300}, w:700, h:30});
hero.pos.x = 20;
hero.pos.y = 100;
hero.w = 20;
hero.h = 40;
hero.v.y = 2;
function draw_entity(ctx,entity) {
  ctx.strokeRect(entity.pos.x, entity.pos.y, entity.w, entity.h);
}
function draw_v(ctx, entity) {
  var centerx = entity.pos.x + entity.w/2
  var centery = entity.pos.y + entity.h/2
  ctx.beginPath();
  
  ctx.moveTo(centerx, centery);
  ctx.lineTo(centerx + entity.v.x*10, centery + entity.v.y*10)
  ctx.stroke();
}

function update(t) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    var delta = t - t_prev;
    t_prev = t;
    hero.pos.x = hero.pos.x + hero.v.x;
    for (var i = 0; i < objects.length; i++) {
      if (collides(hero, objects[i])) {
        check_x_velocity(hero, objects[i], hero.v);
      }
    }
    hero.pos.y = hero.pos.y + hero.v.y;
    for (var i = 0; i < objects.length; i++) {
     if (collides(hero, objects[i])) {
       check_y_velocity(hero, objects[i], hero.v);
     }
    }
    for(var i = 0; i < objects.length; i++) {
      draw_entity(ctx, objects[i]);
    }
    draw_entity(ctx, hero);
    draw_v(ctx, hero);
    hero.v.y += 2;
    if (hero.v.y > 2) hero.v.y = 2;
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
