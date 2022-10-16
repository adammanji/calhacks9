// set up speech recog

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var sr = new SpeechRecognition();

sr.continuous = false;
sr.lang = 'en-CA';
sr.interimResults = false;
sr.maxAlternatives = 1;

speech_recognition_started = false;

function keyDown(k) {
    if (k == 32) {
        if (!speech_recognition_started) {
            sr.start();
            speech_recognition_started = true;
        }
        // $('#textHere').html("Say something...");
    }
}
function keyUp(k) {
    if (k == 32) {
        sr.stop();
        speech_recognition_started = false;
        // $('#textHere').html("Say something...");
    }
}

$(document).ready(function() {
    // $("#container").fadeOut(50);
    $(document).keydown(function(e) {
        keyDown(e.keyCode);
    });
    $(document).keyup(function(e) {
        keyUp(e.keyCode);
    });
});

// sr.onspeechend = function() {
//     sr.stop();
    // $('#textHere').html("Results are on their way...");
// }

sr.onresult = function(event) {
    speech = event.results[0][0].transcript;
    // $('#textHere').html(speech);
    process_nlp(speech.split("and"));

}