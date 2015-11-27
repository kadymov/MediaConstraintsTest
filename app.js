navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.webkitGetUserMedia;

var PARAMS = [
    'minWidth', 'minHeight', 'minFrameRate', 
    'minAspectRatio', 'maxWidth', 'maxHeight', 
    'maxFrameRate', 'maxAspectRatio'];

var logDiv = document.querySelector('#log');

function log(str) {
    logDiv.innerText = logDiv.innerText + '\n' + str;
    
    logDiv.innerHTML = logDiv.innerHTML
        .replace(/Constraints:/g, '<span class="blue">Constraints:</span>')
        .replace(/ERROR:/g, '<span class="red">ERROR:</span>')
        .replace(/\n--\n([^-]*)\n--\n/g, '<span class="gray">\n--\n$1\n--\n</span>')
    
    logDiv.scrollTop = logDiv.scrollHeight;
}

function createConstraints() {
    var constraints =  {
            audio: false,
            video: {
                mandatory: {},
                optional: []
            }
        },
        mandatory = constraints.video.mandatory,
        optional = constraints.video.optional;
    
    PARAMS.forEach(function(el) {
		var madnVal = document.querySelector('.mandatory.' + el).value,
            optVal = document.querySelector('.optional.' + el).value;
        
        if (madnVal) {
        	mandatory[el] = parseFloat(madnVal, 10);
        }
        if (optVal) {
        	optional.push({el : optVal});
        }
    });
    
    return constraints;
}

Array.prototype.forEach.call(document.querySelectorAll('.mandatory, .optional'), function(el) {
    el.addEventListener('keydown', function(e) {
		var key = e.keyCode;
        if (([46, 8, 9, 27, 13, 110, 190].indexOf(key) !== -1) ||
            (key == 65 && ( e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode >= 35 && e.keyCode <= 40)) {

            return;
        }

        if ((e.shiftKey || (key < 48 || key > 57)) && (key < 96 || key > 105)) {
            e.preventDefault();
        }
    });
});

document.querySelector('#getMediaBtn').addEventListener('click', function() {
    log('***************************************************');
    var constraints = createConstraints();
    log('        TEST');
    log(new Date().toLocaleString('ru') + '\n');
    
    log('Constraints:');
    log('--\n'+JSON.stringify(constraints, null, 2)+'\n--');
    
    start(constraints);
});

document.querySelector('#clsLogBtn').addEventListener('click', function() {
    logDiv.innerText = '';
});

var videoCont = document.getElementById('videoCont'),
	video;

function start(constraints) {   
    if (video) {
        video.pause();
        video.src=null;
        videoCont.removeChild(video);
        video = null;
    }
    
    navigator.getUserMedia(constraints, function (stream) {
        video = document.createElement('video');
        videoCont.appendChild(video);
        video.autoplay = true;
        video.muted = true;
        
        video.onloadeddata = function() {
            var video_height = video.videoHeight,
                video_width = video.videoWidth;
            log('Video Size: ' + video_width + 'x' + video_height);
        };
        
        video.src = URL.createObjectURL(stream);
    }, function(e) {
        log('\nERROR: NavigatorUserMediaError \n--\n{\n  name : ' + 
            e.name + ',\n  message : ' + e.message + '\n};\n--');
    });
}