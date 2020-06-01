//@ts-check
var endSpan;
var newTags = [];
var eliminatedtags=[];
var idInterview;
function getButtonSave() {
  return document.getElementById("btnSave")
}
function AJAXrequest(method,objectToSend,objectName,route){
  var conection = new XMLHttpRequest();
  conection.open(method, route, true);
  conection.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  conection.send(objectName+'=' + encodeURIComponent(JSON.stringify(objectToSend)));
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
function getTagsCollections(){
  return document.getElementById("tagscollection");
}
function getFullWatch(){
  return document.getElementById("fullWatch");
}
function getSelectedText(eventArgs) {
  getResultArea().innerHTML = window.getSelection().toString();
  endSpan = eventArgs.srcElement;
}
function reProcessText() {
  var html_optCategory = getOptCategory();
  var selected = getResultArea().value;
  var idCatTag = html_optCategory.options[html_optCategory.selectedIndex].text;
  var index = html_optCategory.selectedIndex;
  let color = html_optCategory.options[index].value;
  if (selected == '' || getColor().value == '#ffffff' || endSpan.childNodes.length > 1|| endSpan == null) {
    console.log(selected);
    console.log(getColor().value);
    console.log(endSpan==null);
    console.log(endSpan.childNodes.length);
    return;
  }
  if (idCatTag == "Add new") {
    let newtitle = document.getElementById("inpTitle").value;
    
    if (newtitle == "" || newtitle == null || newtitle.includes(' ')) {
      return;
    }
    idCatTag = newtitle;
    color = getColor().value;
  }
  var newtag = document.createElement('span');
  newtag.style.backgroundColor = color;
  newtag.setAttribute('name',"labeled");
  newtag.innerText=selected;
  let idStamp_span = endSpan.id.substring(4);
  let fullSpan = endSpan.innerText.split(selected);
  endSpan.innerText = fullSpan[0];
  endSpan.appendChild(newtag);
  endSpan.innerHTML = endSpan.innerHTML+fullSpan[1];
  newTags.push({ id_cat_tag: idCatTag, idDialogInterview: idInterview, stamp: idStamp_span, sentence: selected,color:color });
  let tagscollection = getTagsCollections();
  var opt = document.createElement("option");
  opt.style.color = color;
  opt.innerText = idStamp_span + " " + idCatTag + " " + selected.substring(0, 10);
  tagscollection.appendChild(opt);
  if(html_optCategory.options[html_optCategory.selectedIndex].text=="Add new"){
    let newColorR = Math.round(Math.random()*250+1);
    let newColorG = Math.round(Math.random()*250+1);
    let newColorB = Math.round(Math.random()*250+1);
    getColor().value= '#'+newColorR.toString(16)+newColorG.toString(16)+newColorB.toString(16);
  }
  addEventsToTags();
}

function save() {
  AJAXrequest('POST',newTags,'tags','/interviews/addTag');
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
    color_html.disabled='';
    color_html.value = '#ffffff';
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
function obtainMousePos(html_e, eva) {
  var ClientRect = html_e.getBoundingClientRect();
	return { 
	x: Math.round(eva.clientX - ClientRect.left),
  y: Math.round(eva.clientY - ClientRect.top)
  }
}
function addEventsToTags(){
  var spans = document.getElementsByName('labeled');
  for (let index = 0; index < spans.length; index++) {
    const span = spans[index];
    span.onclick=null;
    span.onclick=deployMenu;
  }
}
function deployMenu(eventArgs){
  var menu= document.getElementById('fmenu');
  if(menu!=null){
    menu.remove();
    return;
  }
  const x = eventArgs.screenX;
  const y = eventArgs.screenY;
  const xp = eventArgs.x;
  const yp = eventArgs.y;
  console.log(x+","+y);
  console.log(xp+","+yp); 
  var mousePosition = obtainMousePos(eventArgs.srcElement,eventArgs);
  console.log(mousePosition.x+" "+mousePosition.y);
  // @ts-ignore
  var menu = document.createElement('div');
  menu.style.top = mousePosition.y.toString()+'px';
  menu.style.left = mousePosition.x.toString()+'px';
  menu.className = "floatingMenu";
  menu.id='fmenu';
  var btnRemover =document.createElement('div');
  var btnChangeCategory = document.createElement('div');

  menu.onmouseleave =()=> menu.remove();
  btnRemover.onclick= ()=>{
    let text = eventArgs.srcElement.parentNode.innerHTML.split("<span");
    const init = text[0];
    const end = text[1].split("</span>")[1];
    let middle = eventArgs.srcElement.innerText;
    let stamp = eventArgs.srcElement.parentNode.id.substring(4);
    eventArgs.srcElement.parentNode.innerHTML = init+middle+end;
    var tagscollection = document.getElementById('tagscollection');
    // @ts-ignore
    for (let index = 0; index < tagscollection.length; index++) {
      const tag = tagscollection[index];
      // @ts-ignore
      if(tag.innerText.split(" ")[0]==stamp){
        // @ts-ignore
        tag.remove();
        break;
      }
    }
    for (let index = 0; index < newTags.length; index++) {
      const tag = newTags[index];
      if(tag.stamp==stamp){
        newTags.splice(index,1);
        break;
      }
    }
    AJAXrequest('POST',{stamp:stamp,idDialogInterview:idInterview},'tag','/interviews/deleteTag');
    btnRemover.parentElement.remove();
  } 
  btnRemover.innerText='Delete';
  btnRemover.className='btn btn-danger';
  btnChangeCategory.innerText= 'Change category';
  btnChangeCategory.className= 'btn btn-secondary';
  btnChangeCategory.inherText ='Change category';
  btnChangeCategory.onclick =()=>{

  }
  //menu.appendChild(btnChangeCategory);
  menu.appendChild(btnRemover);
  console.log(getFullWatch());
  eventArgs.srcElement.appendChild(menu);
  //getFullWatch().appendChild(menu);
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
        // @ts-ignore
        var opt = getOptCategory().options;
        console.log("elemento categoria: "+category);
        for (const key in opt) {
          const element = opt[key];
          //console.log("elemento opt: "+element.textContent);
            if(element.textContent.toLowerCase()==category.toLowerCase()){
              //console.log(element.textContent+" == "+category);
              color=element.value;
              break;
            }
        }
        var span = document.getElementById("line"+stamp);
        /* console.log(span);
        console.log(sentence+" "+color); */

        span.innerHTML = span.innerHTML.replace(sentence,'<span style="background: '+color+ '" name="labeled">'+sentence+'</span>');
      }

    });
    addEventsToTags();
  };
  
}
addEvents(getButtonSave(), getButton(), getSpansIntake(), getOptCategory());
idInterview = document.getElementById('IdItrviewHolder').innerHTML;
