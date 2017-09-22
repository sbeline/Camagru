(function(){
  refresh_timeline(0);
})();

function Disconnect(elem)
{
	ajax(null, "/includes/script/disconnect.php", null, 0);
}

function delete_post(post)
{
  var request = "id_post=" + post.getAttribute('data-name');

  ajax(request, "/includes/script/delete_picture.php", null, 1);
  refresh_timeline(1000);
}

function post_comment(form)
{
  var request = "id_picture=" + form.id_picture.value
                + "&input_comment=" + form.input_comment.value;

  ajax(request, "/includes/script/upload_comment.php", null, 1);
  input_comment.value = "";
  refresh_timeline(1000);
  return (false);
}

function like_post(button)
{
  var request = "id_picture=" + button.name;

  ajax(request, "/includes/script/like_post.php", null, 1);
  refresh_timeline(1000);
}

function clear_context()
{
  var canvas_png = document.getElementById("canvas");
  var canvas_file = document.getElementById("canvasfile");

  var canvasctx = canvas_png.getContext('2d');
  var canvasfilectx = canvas_file.getContext('2d');

  canvasctx.clearRect(0, 0, canvas_png.width, canvas_png.height);
  
  if (document.getElementById("lifile").style.display != "block")
    canvasfilectx.clearRect(0, 0, canvas_file.width, canvas_file.height);
}

function handle_input_file()
{
  if (document.getElementById("livid").style.display == "block")
  {
    document.getElementById("livid").style.display = "none";
    clear_context();
  }

  if (document.getElementById("lifile").style.display != "block")
  {
    document.getElementById("lifile").style.display = "block";
    document.getElementById("li_gif").style.display = "inline-block";
    document.getElementById("canvasfile").style.display = "block";
    document.getElementById("canvas").style.display = "block";
    document.getElementById('input_file').click();
  }
  else
  {
    document.getElementById("lifile").style.display = "none";
    document.getElementById("li_gif").style.display = "none";
    document.getElementById("canvasfile").style.display = "none";
    document.getElementById("canvas").style.display = "none";
    document.getElementById("input_file").value = "";
    clear_context();
  }
}

function display_png(elem)
{
  var beer = document.getElementById("catFace");
  var monkey = document.getElementById("happyFace");
  var banana = document.getElementById("pokerFace");
  var canvas_png = document.getElementById("canvas");
  var canvasctx = canvas.getContext('2d');
  var draw = new Image();

  if (elem.id == "catFace")
    draw.src = "images/Cat_face.png";
  else if (elem.id == "happyFace")
    draw.src = "images/Happy_face.png";
  if (elem.id == "pokerFace")
    draw.src = "images/Poker_face.png";

    draw.onload = function (){
      canvasctx.drawImage(draw, 80, 10, 150, 115);
    };
}

function handleFiles(input) {
    var canvas_file = document.getElementById('canvasfile');
    var ctx = canvas_file.getContext('2d');
    var img = new Image();
    var file = input.files[0];
    var reader  = new FileReader();

    img.onload = function() {
      canvas_file.width = img.width;
      canvas_file.height = img.height;
      ctx.drawImage(img, 0, 0); 
    }
    reader.onloadend = function () {
        img.src = reader.result;
    }
    reader.readAsDataURL(file);
}

function send_file()
{
  var li_gif = document.getElementById("li_gif");
  var livid = document.getElementById("livid");
  var lifile = document.getElementById("lifile");

  var li_gif_style = window.getComputedStyle(li_gif);
  var livid_style = window.getComputedStyle(livid);

  var input_type_file = document.getElementById("input_file");
  var img = document.createElement("img");

  var canvas_with_png = document.getElementById("canvas");
  var canvas_file = document.getElementById("canvasfile");
  var canvas_final = document.createElement("canvas");
  var blank = document.createElement('canvas');

  canvas_final.width =  500;
  canvas_final.height = 380;

  if (input_type_file.files.length != 0 || livid_style.getPropertyValue('display') != "none")
  {
    if (canvas_with_png.toDataURL() == blank.toDataURL())
    {
      banner_create("No png choosen", "red");
      return (false);
    }

    if (input_type_file.files.length != 0)
      canvas_final.getContext('2d').drawImage(canvasfile, 0, 0, canvas_final.width, canvas_final.height);
    else
      canvas_final.getContext('2d').drawImage(video, 0, 0, canvas_final.width, canvas_final.height);
    
    //draw background then png
    canvas_final.getContext('2d').drawImage(canvas_with_png, 0, 0,canvas_final.width, canvas_final.height);
 
    img.src = canvas_final.toDataURL("image/jpeg", 1);
    ajax(img.src, "/includes/script/upload_picture.php", null, 1);

    //clear
    clear_context();
    livid.style.display = "none";
    li_gif.style.display = "none";
    lifile.style.display = "none";
    canvas_with_png.style.display = "none";
    canvasfile.style.display = "none";
    canvas_file.getContext('2d').clearRect(0, 0, canvas_file.width, canvas_file.height);
    refresh_timeline(1000);
  }
  else
  {
      banner_create("No file selected", "red");
      return (false);
  }
}

function active_webcam()
{
  var streaming = false,
      video        = document.querySelector('#video'),
      cover        = document.querySelector('#cover'),
      photo        = document.querySelector('#photo'),
      width = 500,
      height = 380;

  navigator.getMedia = ( navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);

  navigator.getMedia(
    {
      video: true,
      audio: false
    },
    function(stream) {
      if (navigator.mozGetUserMedia) {
        video.mozSrcObject = stream;
      } else {
        var vendorURL = window.URL || window.webkitURL;
        video.src = vendorURL.createObjectURL(stream);
      }
      video.play();
    },
    function(err) {
      console.log("An error occured! " + err);
    }
  );

  video.addEventListener('canplay', function(ev){
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth/width);
      video.setAttribute('width', width);
      video.setAttribute('height', height);
      streaming = true;
    }
  }, false);

  if (document.getElementById("lifile").style.display == "block")
  {
    document.getElementById("lifile").style.display = "none";
    document.getElementById("canvasfile").style.display = "none";
    document.getElementById("input_file").value = "";
    clear_context();
  }
  if (document.getElementById("livid").style.display != "block")
  {
    document.getElementById("livid").style.display = "block";
    document.getElementById("li_gif").style.display = "inline-block";
    document.getElementById("canvas").style.display = "block";
  }
  else
  {
    document.getElementById("livid").style.display = "none";
    document.getElementById("li_gif").style.display = "none";
    document.getElementById("canvas").style.display = "none";
  }
}

function refresh_timeline(time)
{
  var timeline = document.getElementById("timeline");

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState == XMLHttpRequest.DONE)
      timeline.innerHTML = xmlhttp.responseText;
  };

  xmlhttp.open("POST", "includes/script/get_photos.php", true);
  setTimeout(function()
  {
    xmlhttp.send();
    timeline.innerHTML = ""; 
  }, time);
}
