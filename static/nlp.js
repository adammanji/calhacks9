function process_nlp(phrase) {

    $.post('/nlp', {'phrase': phrase}, function(data, status, jqXHR) {

        passed_info = data['info']
        command = data['command']

        display_string = "Your command was " + command + "<br><br>";
        for ([key, value] of Object.entries(passed_info)) {
           display_string += key + ": " + value + "<br>"
        }

        $('#textHere').html(display_string);

        // get back commands to interpret, run those commands w troy's code

    });

}