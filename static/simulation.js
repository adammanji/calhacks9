/// All code for physics simulation and plots

const W = 1700;
const H = 950;

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    // MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Constraint = Matter.Constraint,
    Body = Matter.Body,
    Bodies = Matter.Bodies;

var engine = Engine.create(),
    world = engine.world;

var render;
var runner;

function clear() {
    // Fades out the html of container and clears #simulation, #chart-container1, and #chart-container2
    pendulum_created = false;
}


/// Pendulum

// Some helpers

var pendulum_created = false;
var pendulum;
var rod;

var line_length = 250; // we'll start with this
var mass = 1;
var angle = 1;
var angular_velocity;

function d2r(angle) {
    return angle * Math.PI / 180;
}
function r2d(angle) {
    return angle * 180 / Math.PI;
}

function pendulum_x(angle) {
    return W/2 + line_length*Math.sin(d2r(angle));
}
function pendulum_y(angle) {
    return H/2 + line_length*Math.cos(d2r(angle));
}
function pendulum_vel_x(vel) {
    return d2r(vel)*line_length*Math.sin(d2r(angle));
}
function pendulum_vel_y(vel) {
    return d2r(vel)*line_length*Math.cos(d2r(angle));
}
function pendulum_scale(mass) {
    return Math.sqrt(mass);
}

function pendulum_create() {
    if (pendulum_created) {
        return;
    }
    pendulum_created = true;
    render = Render.create({
        element: document.getElementById("simulation"),
        engine: engine,
        options: {
            width: W,
            height: H,
            wireframes: false,
            background: 'transparent',
            show: true
        }
    });
    Render.run(render);

    runner = Runner.create();
    Runner.run(runner, engine);

    pendulum = Bodies.circle(pendulum_x(angle), pendulum_y(angle), pendulum_scale(mass)*25, {mass: mass, frictionAir: -0.0021, render: {fillStyle: "#fff"}});
    rod = Constraint.create({
        pointA: { x: W / 2, y: H / 2 },
        bodyB: pendulum,
        stiffness: 1,
        render: {
            lineWidth: 4,
            strokeStyle: "#fff"
        }
    });
    World.add(world, [pendulum, rod])
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: W, y: H }
    });
}

function adjust(base, type, amount) {
    switch (type) {
        case "increase":
        case "decrease":
            return base + amount;
        case "set":
            return amount;
    }
}

function pendulum_set(type, variable, amount) {
    switch (variable) {
        case 'angle':
            angle = adjust(angle, type, amount);
            Matter.Body.setPosition(pendulum, {x: pendulum_x(angle), y: pendulum_y(angle)});
            Matter.Body.setVelocity(pendulum, {x: 0, y: 0});
            angular_velocity = 0;
            break;
        case 'angular velocity':
            angular_velocity = adjust(angular_velocity, type, amount);
            Matter.Body.setPosition(pendulum, {x: pendulum_x(angle), y: pendulum_y(angle)});
            Matter.Body.setVelocity(pendulum, {x: pendulum_vel_x(angular_velocity), y: pendulum_vel_y(angular_velocity)});
            console.log(pendulum_vel_x(angular_velocity), pendulum_vel_y(angular_velocity));
            break;
        case 'length':
            line_length = adjust(line_length, type, amount);
            Matter.World.remove(world, rod);
            Matter.Body.setPosition(pendulum, {x: pendulum_x(angle), y: pendulum_y(angle)});
            Matter.Body.setVelocity(pendulum, {x: 0, y: 0});
            angular_velocity = 0;
            rod = Constraint.create({
                pointA: { x: W / 2, y: H / 2 },
                bodyB: pendulum,
                stiffness: 1,
                render: {
                    lineWidth: 4,
                    strokeStyle: "#fff"
                }
            });
            Matter.World.add(world, [rod]);
            break;
        case 'mass':
            mass = adjust(mass, type, amount);
            Matter.Body.setMass(pendulum, mass);
            Matter.Body.scale(pendulum, pendulum_scale(mass), pendulum_scale(mass));
            break;
        default:
            break;
    }
}

var start;
var myChart1;
var chart_x_var;
var chart_y_var;

let decor = (v, i) => [v, i];          // set index to value
let undecor = a => a[1];               // leave only index
let argsort = arr => arr.map(decor).sort().map(undecor);
// order = argsort(clickCount);
// newArray = order.map(i => imgUrl[i])

function updateChart() {
    const now = new Date();
    const t = now - start;

    var x_pt;
    switch (chart_x_var) {
        case 'mass':
            x_pt = pendulum.mass;
            break;
        case 'length':
            x_pt = line_length;
            break;
        case 'height':
            x_pt = (H - pendulum.position.y) - H/2;
            break;
        case 'gravity':
            x_pt = -9.8;
            break;
        case 'angle':
            horz = pendulum.position.x - W/2;
            vert = pendulum.position.y - H/2;
            x_pt = Math.atan2(horz, vert);
            break;
        case 'angular velocity':
            x_pt = pendulum.line_length*pendulum.speed;
            break;
        case 'potential':
            x_pt = pendulum.mass*9.8*((H - pendulum.position.y) - H/2);
            break;
        case 'kinetic':
            x_pt = 0.5*pendulum.mass*pendulum.speed**2;
            break;
        case 'time':
            x_pt = t;
            break;
        default:
            break;
    }
    // myChart1.data.labels.push(x_pt);

    // order = argsort(myChart1.data.labels);
    // myChart1.data.labels.sort();

    var y_pt;
    switch (chart_y_var) {
        case 'mass':
            y_pt = pendulum.mass;
            break;
        case 'length':
            y_pt = line_length;
            break;
        case 'height':
            y_pt = (H - pendulum.position.y) - H/2;
            break;
        case 'gravity':
            y_pt = -9.8;
            break;
        case 'angle':
            horz = pendulum.position.x - W/2;
            vert = pendulum.position.y - H/2;
            y_pt = r2d(Math.atan2(horz, vert));
            break;
        case 'angular velocity':
            y_pt = pendulum.line_length*pendulum.speed;
            break;
        case 'potential':
            y_pt = pendulum.mass*9.8*((H - pendulum.position.y) - H/2);
            break;
        case 'kinetic':
            y_pt = 0.5*pendulum.mass*pendulum.speed**2;
            break;
        default:
            break;
    }

    myChart1.data.datasets[0].data.push({x: x_pt, y: y_pt});

    // myChart1.data.datasets[0].data.push(y_pt);
    // myChart1.data.datasets[0].data = order.map(i => myChart1.data.datasets[0].data[i]);

    if (myChart1.data.datasets[0].data.length > 400) {
        myChart1.data.datasets[0].data.shift();
    }

    myChart1.update();
}

plotsOpen = false

function pendulum_plot(x_var, y_var) {
    var ctx1 = document.getElementById("chart1").getContext("2d");
    chart_x_var = x_var;
    chart_y_var = y_var;
    myChart1 = new Chart(ctx1, {
        type: "scatter",
        data: {
            labels: [],
            datasets: [
                {
                    label: y_var + " vs. " + x_var,
                    data: [],
                    borderColor: ["rgba(255, 99, 132, 1)"],
                    borderWidth: 1,
                    pointRadius: 4,
                    showLine: true,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                xAxes: [
                    {
                        ticks: {
                            display: false
                        }
                    }
                ],
                yAxes: [
                    {
                        ticks: {
                            display: false
                        }
                    }
                ]
            }
        }
    });

    start = new Date();
    setInterval(updateChart, 1000/30);

    if (plotsOpen) {
        Render.lookAt(render, {
            min: { x: 0, y: 0 },
            max: { x: W, y: H }
        });
        $("#chart-container1").css("opacity", 0)
    } else {
        Render.lookAt(render, {
            min: { x: 2.5*W/10, y: 0 },
            max: { x: 12.5*W/10, y: H }
        });
        $("#chart-container1").css("opacity", 1)
    }
    plotsOpen = !plotsOpen
}