'use strict';
// is dot inside a box
function isinside(dot, bbox) {
    return (dot.x > bbox.edges[0].x && dot.y1 > bbox.edges[0].y && dot.x < bbox.edges[2].x && dot.y < bbox.edges[3].y);
}
// are two boxes collide
function collides(box1, box2) {
    var result = false;
    return !(box1.pos.x + box1.w < box2.pos.x ||
      box1.pos.x > box2.pos.x + box2.w ||
      box1.pos.y + box1.h < box2.pos.y ||
      box1.pos.y > box2.pos.y + box2.h);
}
function check_x_velocity(b1, b2, v) {
    if (v.x > 0) {
        b1.pos.x = b2.pos.x - b1.w - 1;
    }
    if (v.x < 0) {
        b1.pos.x = b2.pos.x + b2.w + 1;
    }
}
function check_y_velocity(b1, b2, v) {
    if (v.y > 0) {
        b1.pos.y = b2.pos.y - b1.h - 1;
    }
    if (v.y < 0) {
        b1.pos.y = b2.pos.y + b2.h + 1;
    }
}

function belongs_to(point, line) {
    var line_start_x = Math.min(line.x1, line.x2);
    return (point.x > Math.min(line.x1, line.x2)
            && point.x < Math.max(line.x1, line.x2)
            && point.y > Math.min(line.y1, line.y2)
            && point.y < Math.max(line.y1, line.y2));
}

function collide_lines(line1, line2) {
    var A1 = line1.e.y - line1.s.y,
        B1 = line1.s.x - line1.e.x,
        C1 = line1.e.x * line1.s.y - line1.s.x * line1.e.y,
        A2 = line2.e.y - line2.s.y,
        B2 = line2.s.x - line2.e.x,
        C2 = line2.e.x * line2.s.y - line2.s.x * line2.e.y,
        denom = B2 * A1 - B1 * A2;
    if (denom === 0) {
        return false;
    }
    var x = (C2 * B1 - C1 * B2) / denom,
        y = (C1 * A2 - C2 * A1) / denom;
    if (belongs_to({x: x, y: y}, line1)) {
        return {x: x, y: y};
    } else {
        return false;
    }
}
