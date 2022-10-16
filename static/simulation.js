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

var plotsOpen = false;

function clear(which) {
    // Fades out the html of container and clears #simulation, #chart-container1, and #chart-container2
    if (model_active == false) {
        return;
    }
    if (which == 'plot') {
        $("#container").fadeOut(500, function() {
            togglePlot();
            $("#container").fadeIn(500);
        });
        return;
    }
    $("#container").fadeOut(1000, function() {
        $("#simulation").html("");
        $("#chart-container1").html("");
        $("#chart-container1").html("<canvas id='chart1'></canvas>");
        $("#container").fadeIn(250);
        current_model = "";
        line_length = 250;
        mass = 1;
        angle = 1;
        angular_velocity = 0;
        model_active = false;
        if (render != undefined) {
            World.clear(world);
            Render.lookAt(render, {
                min: { x: 0, y: 0 },
                max: { x: W, y: H }
            });
        }
        coeffs = [1];
        q_data = undefined;
    })
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

function togglePlot() {
    if (plotsOpen) {
        Render.lookAt(render, {
            min: { x: 0, y: 0 },
            max: { x: W, y: H }
        });
        $("#chart-container1").css("opacity", 0)
        $("#chart-container1").html("");
        $("#chart-container1").html("<canvas id='chart1'></canvas>");
    } else {
        Render.lookAt(render, {
            min: { x: 2.5*W/10, y: 0 },
            max: { x: 12.5*W/10, y: H }
        });
        $("#chart-container1").css("opacity", 1)
    }
    plotsOpen = !plotsOpen
}


/// Pendulum

// Some helpers

var model_active = false;
var pendulum;
var p_rod;

var p_line_length = 250; // we'll start with this
var p_mass = 1;
var p_angle = 1;
var p_angular_velocity;

function d2r(angle) {
    return angle * Math.PI / 180;
}
function r2d(angle) {
    return angle * 180 / Math.PI;
}

function pendulum_x(angle) {
    return W/2 + p_line_length*Math.sin(d2r(angle));
}
function pendulum_y(angle) {
    return H/2 + p_line_length*Math.cos(d2r(angle));
}
function pendulum_vel_x(vel) {
    return d2r(vel)*p_line_length*Math.sin(d2r(angle));
}
function pendulum_vel_y(vel) {
    return d2r(vel)*p_line_length*Math.cos(d2r(angle));
}
function pendulum_scale(mass) {
    return Math.sqrt(p_mass);
}

function base_create() {
    if (model_active) {
        return;
    }
    model_active = true;
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
}

function base_create_end() {
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: W, y: H }
    });
    $("#container").fadeIn(1000);
}

function pendulum_create() {
    base_create();
    pendulum = Bodies.circle(pendulum_x(p_angle), pendulum_y(p_angle), pendulum_scale(p_mass)*25, {mass: p_mass, frictionAir: -0.001, render: {fillStyle: "#fff"}});
    p_rod = Constraint.create({
        pointA: { x: W / 2, y: H / 2 },
        bodyB: pendulum,
        stiffness: 1,
        render: {
            lineWidth: 4,
            strokeStyle: "#fff"
        }
    });
    World.add(world, [pendulum, p_rod])
    base_create_end();
}

function pendulum_set(type, variable, amount) {
    switch (variable) {
        case 'angle':
            p_angle = adjust(p_angle, type, amount);
            Matter.Body.setPosition(pendulum, {x: pendulum_x(p_angle), y: pendulum_y(p_angle)});
            Matter.Body.setVelocity(pendulum, {x: 0, y: 0});
            p_angular_velocity = 0;
            break;
        case 'angular velocity':
            p_angular_velocity = adjust(p_angular_velocity, type, amount);
            Matter.Body.setPosition(pendulum, {x: pendulum_x(p_angle), y: pendulum_y(p_angle)});
            Matter.Body.setVelocity(pendulum, {x: pendulum_vel_x(angular_velocity), y: pendulum_vel_y(angular_velocity)});
            console.log(pendulum_vel_x(p_angular_velocity), pendulum_vel_y(angular_velocity));
            break;
        case 'length':
            p_line_length = adjust(p_line_length, type, amount);
            Matter.World.remove(world, p_rod);
            Matter.Body.setPosition(pendulum, {x: pendulum_x(p_angle), y: pendulum_y(p_angle)});
            Matter.Body.setVelocity(pendulum, {x: 0, y: 0});
            p_angular_velocity = 0;
            p_rod = Constraint.create({
                pointA: { x: W / 2, y: H / 2 },
                bodyB: pendulum,
                stiffness: 1,
                render: {
                    lineWidth: 4,
                    strokeStyle: "#fff"
                }
            });
            Matter.World.add(world, [p_rod]);
            break;
        case 'mass':
            p_mass = adjust(p_mass, type, amount);
            Matter.Body.setMass(pendulum, p_mass);
            Matter.Body.scale(pendulum, pendulum_scale(p_mass), pendulum_scale(p_mass));
            break;
        default:
            break;
    }
}

var start;
var myChart1;
var chart_x_var;
var chart_y_var;

function pendulum_updateChart() {
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
            x_pt = line_length*pendulum.speed;
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
            y_pt = p_line_length;
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
            y_pt = p_line_length*pendulum.speed;
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

function pendulum_plot(x_var, y_var) {
    $("#container").fadeOut(500, function() {
        var ctx1 = document.getElementById("chart1").getContext("2d");
        chart_x_var = x_var;
        chart_y_var = y_var;
        if (!plotsOpen) {
            togglePlot();
        }
        myChart1 = new Chart(ctx1, {
            type: "scatter",
            data: {
                labels: [],
                datasets: [
                    {
                        label: y_var + " vs. " + x_var,
                        data: [],
                        borderColor: ["rgba(255, 255, 255, 1)"],
                        borderWidth: 5,
                        pointRadius: 5,
                        pointBackgroundColor: ["rgba(255, 255, 255, 1)"],
                        pointBorderColor: ["rgba(255, 255, 255, 1)"],
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
        setInterval(pendulum_updateChart, 1000/30);

        $("#container").fadeIn(500);
    });
}


/// Block on ramp

var b_incline_plane;
var b_ground;
var b_block;

var b_mass;
var b_friction = 0.005;
var b_angle = 15;
var b_ground_length = 0.8*W;

function block_create() {
    base_create();
    const ground_height = 100;
    const ground_z = H - ground_height/2;
    const plane_height = b_ground_length*Math.sin(d2r(b_angle));
    b_incline_plane = Bodies.fromVertices(0.4*W, ground_z - plane_height/2, [{x: 0, y: ground_z}, {x: 0, y: ground_z-plane_height}, {x: 0.8*W, y:ground_z}], {friction: 1, frictionStatic: 1, isStatic: true, render: {fillStyle: "#fff"}})
    // b_ground = Bodies.rectangle(W/2, H, W, ground_height, {isStatic: true, render: {fillStyle: "#fff"}})
    b_block = Bodies.rectangle(0.4*W, 0.3*H, 100, 100, {friction: b_friction, frictionStatic: b_friction, render: {fillStyle: "#fff"}})
    World.add(world, [b_incline_plane, b_block]);
    base_create_end();
}



// Quantum harmonic oscillator

var myQuantumChart;
var coeffs = [1];
var labels = []
for (var i = 0; i < 80; i += 1) {
    labels.push(-4 + 0.1*i);
}
var q_data;

function hermite(x, n) {
    switch (n) {
        case 0:
            return 1;
        case 1:
            return 2*x;
        case 2:
            return 4*(x**2) - 2;
        case 3:
            return 8*(x**3) - 12*x;
        case 4:
            return 16*(x**4) - 48*(x**2) + 12;
        case 5:
            return 32*(x**5) - 160*(x**3) + 120*x;
        case 6:
            return 64*(x**6) - 480*(x**4) + 720*(x**2) - 120;
        case 7:
            return 128*(x**7) - 1344*(x**5) + 3360*(x**3) - 1680*x;
        case 8:
            return 256*(x**8) - 3584*(x**6) + 13440*(x**4) - 13440*(x**2) + 1680;
        case 9:
            return 512*(x**9) - 9216*(x**7) + 48384*(x**5) - 80640*(x**3) + 30240*x;
        case 10:
            return 1024*(x**10) - 23040*(x**8) + 161280*(x**6) - 403200*(x**4) + 302400*(x**2) - 30240;
    }
}

function factorial(n) {
    var val = 1;
    for (var i = n; i >= 1; i -= 1) {
        val *= i;
    }
    return val;
}

function harmonic(x, n) {
    return (1/Math.sqrt((2**n)*(factorial(n))))*(1/Math.PI)**(0.25)*Math.exp(-(x**2) / 2)*hermite(x, n);
}

function harmonic_squared(n) {
    return function(x) {
        return harmonic(x, n)**2;
    };
}

omega = 0.0004;

function general_combination(lst, t) {
    // give lst of coefficients for the linear combination: must sum squares to 1, max 11 elements
    return function(x) {
        real = 0
        imag = 0
        for (var i = 0; i < lst.length; i += 1) {
            stationary_state = harmonic(x, i);
            real += stationary_state*Math.cos((2*i+1)*omega*t);
            imag += stationary_state*Math.sin((2*i+1)*omega*t);
        }
        return Math.sqrt(real**2 + imag**2);
    }
}

function q_updateChart() {
    const now = new Date();
    const t = now - start;
    q_data.datasets[0].data = [];
    func = general_combination(coeffs, t);
    for (var j = 0; j < q_data.labels.length; j++) {
        y = func(q_data.labels[j]);
        q_data.datasets[0].data.push(y);
    }
    myQuantumChart.update();
}

function quantum_create() {
    if (model_active) {
        return;
    }
    model_active = true;
    current_model = 'oscillator';
    $("#simulation").html("<canvas id='chart0'></canvas>");
    $("#chart0").width("1700px");
    $("#chart0").height("950px");
    console.log($("#chart0").width());
    var ctx = document.getElementById("chart0").getContext("2d");
    q_data = {
        labels: labels,
        datasets: [{
            label: "", // Name it as you want
            function: general_combination(coeffs, 0),
            data: [], // Don't forget to add an empty data array, or else it will break
            borderColor: "rgba(255, 255, 255, 1)",
            borderWidth: 5,
            fill: true,
            pointRadius: 0
        }]
    }
    Chart.pluginService.register({
        beforeInit: function(chart) {
            // For every label ...
            for (var j = 0; j < q_data.labels.length; j++) {
                // We get the dataset's function and calculate the value
                var fct = q_data.datasets[0].function,
                    x = q_data.labels[j],
                    y = fct(x);
                // Then we add the value to the dataset data
                q_data.datasets[0].data.push(y);
            }
        }
    });
    myQuantumChart = new Chart(ctx, {
        type: 'line',
        data: q_data,
        options: {
            legend: {
                display: false,
            },
            scales: {
                xAxes: [{
                    ticks: {
                        display: false,
                    }
                }],
                yAxes: [{
                    ticks: {
                        display: false,
                        min: -0.5,
                        max: 3
                    }
                }]
            }
        }
    });    
    
    start = new Date();
    setInterval(q_updateChart, 100);

    // $("#container").fadeIn(1000);
}


function quantum(phrase) {
    switch (phrase) {
        case 'give me the ground state':
            coeffs = [1];
            break;
        case 'add some second stationary state':
            coeffs = [0.4, 0, 0.3];
            break;
        case 'add a bit of first excited state':
            unnormalized_coeffs = [0.3, 0.3, 0.3];
            norm_const = 3*0.3**2;
            for (var i = 0; i < 3; i += 1) {
                coeffs.push(unnormalized_coeffs[i] / norm_const);
            }
            break;
        case 'give me a random linear combination of stationary states':
            coeffs = [];
            var unnormalized_coeffs = [];
            var norm_const = 0;
            for (var i = 0; i < 7; i += 1) {
                var new_coeff = Math.random();
                unnormalized_coeffs.push(new_coeff);
                norm_const += new_coeff**2;
            }
            for (var i = 0; i < 7; i += 1) {
                coeffs.push(unnormalized_coeffs[i] / norm_const);
            }
            break;
        case 'coherent state':
            break;
        default:
            break;
    }
    start = new Date();
}


/// Mobius strip


function mobius_create() {
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
    camera.position.setScalar(10);
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(innerWidth, innerHeight);
    document.getElementById("simulation").appendChild(renderer.domElement);
    
    let controls = new OrbitControls(camera, renderer.domElement);
    
    const geometry = new ParametricGeometry( ParametricGeometries.mobius3d, 25, 25 );
    const material = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load("https://threejs.org/examples/textures/uv_grid_opengl.jpg") } );
    const mobius = new THREE.Mesh( geometry, material );
    mobius.scale.multiplyScalar(2);
    scene.add( mobius );
    
    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
        mobius.rotation.x += 0.01
        // mobius.rotation.y += 0.01
    });
}