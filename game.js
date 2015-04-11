//TODO
/*
Add player setup sliders via input type="range" and float:left css
Fix vertical speed < 1
*/
'use strict';
var canvas = document.getElementById("example");
var snd = new Audio("laser.mp3");
var upPressed = false,
    downPressed = false,
    leftPressed = false,
    rightPressed = false,
    upStillPressed = false;
function play_snd() {
    snd.currentTime = 0;
    snd.play();
}
function clamp_speed(current, max) {
    return Math.min(Math.abs(current),max) * (current > 0 ? 1 : -1);
}
function clamp_y_speed(current, up, down) {
    if (current > 0) {
        return clamp_speed(current, down);
    } else {
        return clamp_speed(current, up);
    }
}
function decelerate_x(player) {
    if (hero.speed.v.x === 0) return;    
    var direction = (hero.speed.v.x > 0) ? 1 : -1;
    hero.speed.v.x = Math.abs(hero.speed.v.x) - hero.speed.d.x;
    if (hero.speed.v.x <= 0) {
        hero.speed.v.x = 0;
    } else {
        hero.speed.v.x = hero.speed.v.x * direction;
    }
}

function decelerate_y(player) {
    hero.speed.v.y += hero.speed.d.y;
}
function keydownUp() {
  upPressed = true;
}
function keydownDown() {
}
function keydownLeft() {
    leftPressed = true;
}
function keydownRight() {
    rightPressed = true;
}

function keyupLeft() {
    leftPressed = false;
}
function keyupRight() {
    rightPressed = false;
}
function keydownZ() {}
function keydownX() {}
function keyupZ() {}
function keyupX() {}
function keyupUp() {
    upPressed = false;
    upStillPressed = false;
}
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
var objects = [{pos:{x:200,y:210}, w:100, h: 50}];
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
    if (hero.speed.v.y === 0) {
        if (upPressed && !upStillPressed) {
            upStillPressed = true;
            hero.speed.v.y -= hero.speed.a.y;
        }
    }
    decelerate_y(hero);
    
    if (leftPressed) {
        hero.speed.v.x -= hero.speed.a.x;
    } else {
        decelerate_x(hero);
    }
    if (rightPressed) {
        hero.speed.v.x += hero.speed.a.x;
    } else {
        decelerate_x(hero);
    }
    
    hero.speed.v.x = clamp_speed(hero.speed.v.x, hero.speed.max.x);
    
    hero.speed.v.y = clamp_y_speed(hero.speed.v.y, hero.speed.max.y.up, hero.speed.max.y.down);

    

    hero.pos.x = hero.pos.x + hero.speed.v.x;
    for (var i = 0; i < objects.length; i++) {
      if (collides(hero, objects[i])) {
        check_x_velocity(hero, objects[i], hero.speed.v);
        hero.speed.v.x = 0;
      }
    }
    
    hero.pos.y = hero.pos.y + hero.speed.v.y;
    
    for (var i = 0; i < objects.length; i++) {
     if (collides(hero, objects[i])) {
       check_y_velocity(hero, objects[i], hero.speed.v);
       hero.speed.v.y = 0;
         console.log('yes');
     } else {
         console.log('no');
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
    }
};
 
document.onkeyup = function (event) {
    if (keyMapUp[event.keyCode]) {
        keyMapUp[event.keyCode].call();
    }
};
canvas.onmousemove = function(event) {
    document.getElementById('coords').innerHTML = event.clientX + ':' + event.clientY;
}
