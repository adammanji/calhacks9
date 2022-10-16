// variables = ['mass', 'length', 'height', 'gravity', 'angle', 'angular velocity'];
// plot_variables = variables.copy() + ['potential', 'kinetic', 'over time'];
current_model = "";

function process_nlp(phrase) {

    $.post('/nlp', {'phrase': phrase}, function(data, status, jqXHR) {

        passed_info = data['info']
        command = data['command']

        switch (command) {
            case "Create":
                create(passed_info['model']);
                break;
            case "Increase":
                increase(passed_info['variable'], passed_info['amount']);
                break;
            case "Decrease":
                decrease(passed_info['variable'], passed_info['amount']);
                break;
            case "Set":
                set(passed_info['variable'], passed_info['amount']);
                break;
            case "Plot":
                plot(passed_info['variables']);
                break;
            case "Clear":
                clear();
                break;
        }

        console.log(passed_info, command);

        // passed_info has certain variables based on command

            // Create - ['model': 'pendulum']
            // Increase, Decrease, Set - ['variable': 'height', 'amount': 0.0]
            // Plot - ['variables': ['velocity', 'time']]

            // variables = ['mass', 'length', 'height', 'gravity', 'angle', 'angular velocity']
            // plot_variables = variables.copy() + ['potential', 'kinetic', 'over time']
            // models = ['block on a ramp', 'pendulum', 'quantum harmonic oscillator', 'mobius strip']

        // get back commands to interpret, run those commands w troy's code

    });

}

function create(model) {
    current_model = model;
    switch (model) {
        case 'pendulum':
            pendulum_create();
            break;
        case 'block on a ramp':
            break;
        case 'quantum harmonic oscillator':
            break;
        case 'mobius strip':
            break;
    }
}

function increase(variable, amount) {
    switch (current_model) {
        case 'pendulum':
            pendulum_set('increase', variable, amount);
            break;
        default:
            break;
    }
}

function decrease(variable, amount) {
    switch (current_model) {
        case 'pendulum':
            pendulum_set('decrease', variable, amount);
            break;
        default:
            break;
    }
}

function set(variable, amount) {
    switch (current_model) {
        case 'pendulum':
            pendulum_set('set', variable, amount);
            break;
        default:
            break;
    }
}


function plot(variables) {
    switch (current_model) {
        case 'pendulum':
            pendulum_plot(variables[1], variables[0]);
            break;
        default:
            break;
    }
}