function process_nlp(phrase) {

    $.post('/nlp', {'phrase': phrase}, function(data, status, jqXHR) {

        if (data['error']) {

            e = data['error'];
            
            if (e == 'no number') {

                alert("no number given!");
                return;

            }

        }

        passed_info = data['info'];
        command = data['command'];

        // passed_info has certain variables based on command

            // Create - ['model': 'pendulum']
            // Increase, Decrease, Set - ['variable': 'height', 'amount': 0.0]
            // Plot - ['variables': ['velocity', 'time']]

            // variables = ['mass', 'length', 'height', 'gravity', 'angle', 'angular velocity']
            // plot_variables = variables.copy() + ['potential', 'kinetic', 'time']
            // models = ['block on a ramp', 'pendulum', 'quantum harmonic oscillator', 'mobius strip']

        // get back commands to interpret, run those commands w troy's code

    });

}