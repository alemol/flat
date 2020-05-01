
//@ts-check
function getTextArea(){
  return document.getElementById("text_html");
}
function getContTextArea(){
  return document.getElementById("contTextArea");
}
function getResultArea(){
  return document.getElementById("result");
}
function getButton(){
  return document.getElementById('addColor');
}
function getColor(){
  return document.getElementById("selectedColor");
}
function getSelectedText()
{
  getResultArea().innerHTML=window.getSelection().toString();
}
function reProcessText()
{
  var selectedText = getResultArea().value;
  var allText = getTextArea().innerHTML;
  var style ='style="background:'+getColor().value+'"';
  var outputText = allText.replace(selectedText,'<span '+style+'>'+selectedText+'</span>');
  getTextArea().remove();
  var child = document.createElement("div");
  child.id = "text_html";
  console.log(outputText);
  child.innerHTML = outputText.toString();
  document.getElementById('contTextArea').appendChild(child);
  
}
function addEvents(html_textArea,html_Button){
  var eventos = ["keyup","keydown","mousedown","mouseup","mousemove"];
  for(var i in eventos){
    html_textArea.addEventListener( eventos[i], getSelectedText);
  }
  html_Button.addEventListener("click",reProcessText)
}
addEvents(getContTextArea(),getButton());

