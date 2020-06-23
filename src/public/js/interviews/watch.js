
var endSpan;
var newTags = [];
var eliminatedtags = [];
var idInterview;
idInterview = document.getElementById('IdItrviewHolder').innerHTML;
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
function getTagsCollections() {
  return document.getElementById("tagscollection");
}
function getFullWatch() {
  return document.getElementById("fullWatch");
}
function getSelectedText(eventArgs) {
  var text = window.getSelection().toString();
  text = text.trim();
  getResultArea().innerHTML = text;
  endSpan = eventArgs.srcElement;
}
function reProcessText() {
  //globals ref
  var selected = getResultArea().value.trim();
  var html_optCategory = getOptCategory();
  var idCatTag = html_optCategory.options[html_optCategory.selectedIndex].text;
  let _color = html_optCategory.options[html_optCategory.selectedIndex].value;

  //verification
  if (selected == '' || getColor().value == '#ffffff' || endSpan.childNodes.length > 1 || endSpan == null) {
    return;
  }
  if (idCatTag == "Add new") {
    let newtitle = document.getElementById("inpTitle").value;
    if (newtitle == "" || newtitle == null || newtitle.includes(' ')) {
      return;
    }
    idCatTag = newtitle;
    _color = getColor().value;
  }

  //constants
  const stamp = endSpan.id.substring(4);
  const category = idCatTag;
  const color = _color;
  //const unmodifiedText = endSpan.innerText.trim();
  const selectedText = selected.trim();

  addNewTag(stamp, category, color, selectedText, endSpan);

  //Adding to lists
  addTagTocollection(category, idInterview, stamp, selectedText, color);
  //If new category
  if (html_optCategory.options[html_optCategory.selectedIndex].text == "Add new") {
    getColor().value = '#' + randomColor();
  }
}
function addNewTag(stamp, category, color, selectedText, srcElement) {
  var span = createSpanForTaggedText(selectedText, color);
  var firtsPart = document.createElement("span");
  var lastPart = document.createElement("span");
  var unmodifiedText = srcElement.innerText.trim().split(selectedText);
  firtsPart.innerText = unmodifiedText[0];
  lastPart.innerText = unmodifiedText[1];
  srcElement.innerHTML = "";
  if (unmodifiedText[0] != "") {
    srcElement.appendChild(firtsPart);
  }
  srcElement.appendChild(span);
  if (unmodifiedText[1] != "") {
    srcElement.appendChild(lastPart);
  }
  if (category!=null&&category!="") {
    document.getElementById('tagscollection').appendChild(createOpt(stamp, category, selectedText.substring(0, 20), color));
  }
}
function addTagTocollection(cat, idInt, _stamp, text, _color) {
  newTags.push({ id_cat_tag: cat, idDialogInterview: idInt, stamp: _stamp, sentence: text, color: _color });
}
function randomColor() {
  let color = Math.round(Math.random() * 250 + 1);
  return color.toString(16) + color.toString(16) + color.toString(16);
}
function createSpanForTaggedText(text, _color) {
  var newtag = document.createElement('span');
  newtag.style.backgroundColor = _color;
  newtag.setAttribute('name', "labeled");
  newtag.className = "lblSpan";
  newtag.innerText = text;
  newtag.onclick = deployMenu;
  return newtag;
}
function createOpt(stamp, idCatTag, text, color) {
  var opt = document.createElement("option");
  opt.style.color = color;
  opt.innerText = stamp + " " + idCatTag + " " + text;
  return opt;
}

function save() {
  AjaxRequest("POST", '/interviews/addTag', newTags, (_) => window.location.href = 'http://localhost:4000/interviews/watch/' + idInterview);
}
function AjaxRequest(method, purl, package, fun) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, purl, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      fun(this.response);
    }
  };
  var data = JSON.stringify(package);
  xhr.send(data);
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
    color_html.disabled = '';
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
function deployMenu(eventArgs) {
  DeletMenuIfExists();
  const x = eventArgs.screenX;
  const y = eventArgs.y;
  var root = document.getElementById('root');
  root.appendChild(createMenu());
  root.style.position = "fixed";
  root.style.top = y + "px";
  root.style.left = x + "px";
}
function createMenu() {
  var menu = document.createElement('div');
  menu.className = "floatingMenu";
  menu.id = 'fmenu';
  menu.onmouseleave = () => menu.remove();
  menu.appendChild(createBtnRemove());
  return menu;
}
function createBtnRemove() {
  var btnRemover = document.createElement('div');
  btnRemover.onclick = () => {
    var span = endSpan.parentNode;
    var newsentence = "";
    const stamp = span.id.substring(4);
    span.childNodes.forEach(childNode => {
      newsentence += childNode.innerText;
    });
    span.innerHTML = newsentence;
    AjaxRequest("POST", '/interviews/deleteTag', { stamp: stamp, idDialogInterview: idInterview, }, (_) => { });
    btnRemover.parentElement.remove();
  }
  btnRemover.innerText = 'Delete';
  btnRemover.className = 'btn btn-danger';
  return btnRemover;
}
function DeletMenuIfExists() {
  var menu = document.getElementById("fmenu");
  if (menu != null) {
    menu.remove();
  }
}
function loadTags(tagsinOpt) {
  //Pasar a un helper de handlebars
  for (const key in tagsinOpt) {
    if (tagsinOpt.hasOwnProperty(key)) {
      const node = tagsinOpt[key];
      const tag= node.innerText.split(" ");
      const stamp = tag[0];
      const color = node.style.color;

      const selectedText = tag.slice(2).reduce((a,c)=>a+" "+c);
      addNewTag(stamp, null, color, selectedText, document.getElementById('line' + stamp)); 
    }
  }
}
function addEvents(html_Button_Save, html_Button, html_spans, html_optCategory) {
  document.addEventListener("scroll", DeletMenuIfExists);
  document.getElementById("contTextArea").addEventListener("scroll", DeletMenuIfExists);
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
  loadTags( document.getElementById('tagscollection'));
}
addEvents(getButtonSave(), getButton(), getSpansIntake(), getOptCategory());
