/* global $, io */
let recognition = null;

try {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
} catch(e) {
  console.error(e);
  $('.no-browser-support').show();
  $('.app').hide();
}

const socket = io();
socket.on('analysis', (data) => {
  if (data.isFinal) {
    $('#final').append(` C${data.comparative}`);
  } else {
    $(`#${data.eventIndex}`).append(` C${data.comparative}`);
  }
  console.log(data);
});


const instructions = $('#recording-instructions');
const final = $('#final');
const attemptsList = $('ul#attempts');

/*-----------------------------
      Voice Recognition 
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 
recognition.continuous = true;
recognition.interimResults = true;

// This block is called every time the Speech APi captures a line. 
recognition.onresult = function(event) {

  // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far. 
  // We only need the current one.
  var current = event.resultIndex;

  // Get a transcript of what was said.
  const result = event.results[current];
  const { transcript } = result[0];

  console.log(event);
  socket.emit('data', { eventIndex: current, transcript, isFinal: result.isFinal });

  // Add the current transcript to the contents of our Note.
  // There is a weird bug on mobile, where everything is repeated twice.
  // There is no official solution so far so we have to handle an edge case.
  var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

  if (!mobileRepeatBug) {
    if (result.isFinal) {
      final.text(transcript);
    } else {
      attemptsList.prepend(`<li id="${current}">${transcript}</li>`);
    }
  }
};

recognition.onstart = function() { 
  instructions.text('Voice recognition activated. Try speaking into the microphone.');
};

recognition.onspeechend = function() {
  instructions.text('You were quiet for a while so voice recognition turned itself off.');
};

recognition.onerror = function(event) {
  if(event.error == 'no-speech') {
    instructions.text('No speech was detected. Try again.');  
  }
};



/*-----------------------------
      App buttons and input 
------------------------------*/

$('#start-record-btn').on('click', function(e) {
  attemptsList.html('');
  recognition.start();
});


$('#pause-record-btn').on('click', function(e) {
  recognition.stop();
  instructions.text('Voice recognition paused.');
});
