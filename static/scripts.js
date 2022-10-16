// set up speech recog

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var sr = new SpeechRecognition();

sr.continuous = false;
sr.lang = 'en-US';
sr.interimResults = false;
sr.maxAlternatives = 1;


$(document).ready(function() {
    $('#speechButton').click(function() {
        sr.start();
        $('#textHere').html("Say something...");
    });
});

sr.onspeechend = function() {
    sr.stop();
    $('#textHere').html("Results are on their way...");
}

sr.onresult = function(event) {
    $('#textHere').html(event.results[0][0].transcript);
}