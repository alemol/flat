
var endSpan;
var tags = [];
var idInterview;
function getButtonSave() {
  return document.getElementById("btnSave")
}
function getOptCategory() {
  return document.getElementById("optCategory");
}
function getTextArea() {
  return document.getElementById("text_html");
}
function getSpansIntake() {
  return document.getElementsByName("I")
}
function getResultArea() {
  return document.getElementById("result");
}
function getButton() {
  return document.getElementById('addColor');
}
function getColor() {
  return document.getElementById("selectedColor");
}
function getSelectedText(e) {
  getResultArea().innerHTML = window.getSelection().toString();
  endSpan = e.srcElement;
}
function reProcessText() {

  const style = '<span style="background:' + getColor().value + '" name="labaled">';
  const selected = getResultArea().value;
  let idCatTag = getOptCategory().options[getOptCategory().selectedIndex].text;
  const index = getOptCategory().selectedIndex;
  let color = "";
  color = getOptCategory().options[index].value;

  if (selected == '' || getColor().value == '#ffffff' || endSpan == null || endSpan.childNodes.length > 1) {
    return;
  }
  if (idCatTag == "Add new") {
    let newtitle = document.getElementById("inpTitle").value;
    if (newtitle == "" || newtitle == null) {
      return;
    }
    idCatTag = newtitle;
    color = getColor().value;
  }


  let idStamp_span = endSpan.id.substring(4);
  let fullSpan = endSpan.innerHTML;
  let output = fullSpan.replace(selected, style + selected + "</span>");
  endSpan.innerHTML = output;

  /* if(tags.map((v)=>v.category).find((x)=>x==idCatTag)!=undefined){
    return;
  } */

  tags.push({ id_cat_tag: idCatTag, idDialogInterview: idInterview, stamp: idStamp_span, sentence: selected });
  let tagscollection = document.getElementById("tagscollection");
  var opt = document.createElement("option");

  opt.style.color = color;
  opt.innerText = idStamp_span + " " + idCatTag + " " + selected.substring(0, 10);
  tagscollection.appendChild(opt);

  if(getOptCategory().options[getOptCategory().selectedIndex].text=="Add new"){
    console.log("hola");
    let newColorR = Math.round(Math.random()*250+1);
    let newColorG = Math.round(Math.random()*250+1);
    let newColorB = Math.round(Math.random()*250+1);
    getColor().value= '#'+newColorR.toString('16')+newColorG.toString('16')+newColorB.toString('16');
    }
}

function save() {
  sendTagsToServer();
}
function sendTagsToServer() {
  var conection = new XMLHttpRequest();
  conection.open("POST", '/interviews/addTag', true);
  conection.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  conection.send('tags=' + encodeURIComponent(JSON.stringify(tags)));
}

function category_changed() {
  var title = document.getElementById('ctrTitle');
  if (title != null) {
    title.parentNode.removeChild(title);
  }

  var opt_html = getOptCategory();
  var color_html = getColor();
  const index = opt_html.selectedIndex;
  const color = opt_html.options[index].value;
  if (color == "add new") {
    color_html.value = '#ffffff';

    color_html.disabled = 'false';
    var frmMenu_html = document.getElementById('frmAddTagMenu');
    var newElement = document.createElement("input");
    newElement.setAttribute("type", "text");
    newElement.setAttribute('class', 'form-control');
    newElement.setAttribute('plceholder', 'Title');
    newElement.id = 'inpTitle';
    var newDiv = document.createElement('div');
    newDiv.className = 'form-group';
    newDiv.appendChild(newElement);
    newDiv.id = 'ctrTitle';
    var html_childs = frmMenu_html.childNodes;
    frmMenu_html.insertBefore(newDiv, html_childs[3]);
    return;
  }
  color_html.disabled = 'true';
  color_html.value = color;
}
function addEvents(html_Button_Save, html_Button, html_spans, html_optCategory) {

  html_Button.addEventListener("click", reProcessText);
  html_Button_Save.addEventListener("click", save);
  let eventos = ["mousedown", "mouseup"];
  let i = 0;
  for (i = 0; i < html_spans.length; i++) {
    for (let e in eventos) {
      html_spans[i].addEventListener(eventos[e], getSelectedText);
    }
  }
  html_optCategory.addEventListener("click", category_changed);
  window.onload = () => {
    let html_tags = document.getElementById('tagscollection');
    html_tags.childNodes.forEach((opt) => {
      if (opt.firstChild != null) {
        let content = opt.textContent;
        let stamp = 0;
        stamp = parseInt(content.split(" ")[0]);
        let category = "";
        let sentence = "";
        sentence = content.split(" ").slice(2).reduce(function (pv, cv) { return pv + " " + cv; });
        category = content.split(" ")[1];
        var color = "";
        var opt = getOptCategory().options;
        for (const key in opt) {
          const element = opt[key];
            if(element.textContent==category){
              color=element.value;
              //console.log(color);
              break;
            }
          
        }
        //console.log(category+" "+sentence+" "+color);
        span = document.getElementById("line"+stamp);
        span.innerHTML = span.innerHTML.replace(sentence,'<span style="background: '+color+ '" name="labeled">'+sentence+'</span>');
        
      }

    });
  };
}
addEvents(getButtonSave(), getButton(), getSpansIntake(), getOptCategory());
idInterview = document.getElementById('IdItrviewHolder').innerHTML;
