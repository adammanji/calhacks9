function process_nlp(phrase) {

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

        /*
        
        passed_info has certain variables based on command

            Create - ['model': 'pendulum']
            Increase, Decrease, Set - ['variable': 'height', 'amount': 0.0]
            Plot - ['variables': ['velocity', 'time']]
            Clear - ['which': 'plot'] -- options: ['plot', 'all']

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