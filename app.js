window.mobileAndTabletcheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

if (mobileAndTabletcheck()) {
    document.body.classList.add('mobile');
}



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
    log('**********************************');
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