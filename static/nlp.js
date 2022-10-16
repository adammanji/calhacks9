// variables = ['mass', 'length', 'height', 'gravity', 'angle', 'angular velocity'];
// plot_variables = variables.copy() + ['potential', 'kinetic', 'over time'];
current_model = "";

function process_nlp(phrases) {

    for (var i = 0; i < phrases.length; i++) {

        var phrase = phrases[i];

        currentModel = ""
        // comment this out when we have an actual way to track this

        $.post('/nlp', {'phrase': phrase, 'model': currentModel}, function(data, status, jqXHR) {

        /*  POSSIBLE ERRORS

            no number - cannot find a number
            command not valid on oscillator - increase or decrease on oscillator
            no match for oscillator set - none of the oscillator set phrases 

        */

            if (data['error']) {

                e = data['error'];
                
                if (e == 'no number') {
                    alert("no number given!");
                }

                else if (e == 'command not valid on oscillator') {
                    alert(e);
                }

                else if (e == 'no match for oscillator set') {
                    alert(e);
                }

                return;

            }

            passed_info = data['info'];
            command = data['command'];

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
                clear(passed_info['which']);
                break;
        }

        console.log(passed_info, command);

        /*
        
        passed_info has certain variables based on command

                Create - ['model': 'pendulum']
                Increase, Decrease, Set - ['variable': 'height', 'amount': 0.0]
                Plot - ['variables': ['velocity', 'time']]
                Clear - ['which': 'plot'] -- options: ['plot', 'all']

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

                IF MODEL IS OSCILLATOR, Increase and Decrease return errors
                    Set returns ['which': 'ground state'] (one of the key phrases)

                variables = ['mass', 'length', 'height', 'gravity', 'angle', 'angular velocity']
                plot_variables = variables.copy() + ['potential', 'kinetic', 'time']
                models = ['block on a ramp', 'pendulum', 'quantum harmonic oscillator', 'mobius strip']
                oscillator_key_phrases = ['ground state', 'add some second stationary state', 'add a bit of first excited state',
                    'give me a random linear combination of stationary states', 'coherent state']

            get back commands to interpret, run those commands w troy's code 
            
            */

        });

    }

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