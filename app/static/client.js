var el = x => document.getElementById(x);

function showPicker() {
  el("file-input").click();
}

function showPicked(input) {
  el("upload-label").innerHTML = input.files[0].name;
  var reader = new FileReader();
  reader.onload = function(e) {
    el("image-picked").src = e.target.result;
    el("image-picked").className = "";
  };
  reader.readAsDataURL(input.files[0]);
}

var alldiseases = [
  {prefix: 'actinic_keratosis', full : 'Старческий кератоз'},
  {prefix: 'basal_cell_carcinoma', full : 'Базально-клеточная карцинома'},
  {prefix: 'dermatofibroma', full : 'Дерматофиброма'},
  {prefix: 'melanoma', full : 'Меланома'},
  {prefix: 'nevus', full : 'Невус'},
  {prefix: 'pigmented_benign_keratosis', full : 'Пигментный доброкачественный кератоз'},
  {prefix: 'seborrheic_keratosis', full : 'Себорейный кератоз'},
  {prefix: 'squamous_cell_carcinoma', full : 'Плоскоклеточная карцинома'},
  {prefix: 'vascular_lesion', full : 'Поражение сосудов'}
  ];

function analyze() {
  var uploadFiles = el("file-input").files;
  if (uploadFiles.length !== 1) alert("Please select a file to analyze!");

  el("analyze-button").innerHTML = "Analyzing...";
  var xhr = new XMLHttpRequest();
  var loc = window.location;
  xhr.open("POST", `${loc.protocol}//${loc.hostname}:${loc.port}/analyze`,
    true);
  xhr.onerror = function() {
    alert(xhr.responseText);
  };
  xhr.onload = function(e) {
    if (this.readyState === 4) {
      var response = JSON.parse(e.target.responseText);
      el("result-label").innerHTML = `Result = ${response["result"]} Percentage = ${response["percent"]}`;
      var percent = ${response["percent"]};
      console.log('${response["percent"]}');
      console.log("working");
      for(var i=0; i < alldiseases.length; i++) {
        if(response["result"] == alldiseases[i].prefix){
          var infrussian = alldiseases[i].full;
          el("infspan").innerHTML = infrussian "\n Вероятность: ${response["percent"]} %";
          document.getElementById("map").style.visibility = 'visible';
          console.log(infrussian);
        }
      }
    }
    el("analyze-button").innerHTML = "Analyze";
  };

  var fileData = new FormData();
  fileData.append("file", uploadFiles[0]);
  xhr.send(fileData);
}

