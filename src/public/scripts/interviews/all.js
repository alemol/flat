
//@ts-check
function getTextArea(){
  return document.getElementById("text_html");
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
function processSelectedText(pElementHtml,pStarts,pEnds)
{
    return pElementHtml.slice(pStarts,pEnds);  
}
function getSelectedText()
{
  var textArea = getTextArea();
  var start = textArea.selectionStart;
  var end    = textArea.selectionEnd;
  getResultArea().innerHTML=processSelectedText(textArea.value,start,end);
}
function reProcessText()
{
  alert('presionado');
  var actualText = getTextArea().value;
  var selectedText = getResultArea().value;
  var newText = actualText.replace(selectedText,'<span style="color:' + getColor().value +'">' + selectedText + '</span>');
  getTextArea().innerHTML = newText;
}
function addEvents(html_textArea,html_Button){
  var eventos = ["keyup","keydown","mousedown","mouseup","mousemove"];
  for(var i in eventos){
    html_textArea.addEventListener( eventos[i], getSelectedText);
  }
  console.log(html_Button);
  html_Button.addEventListener("click",reProcessText)
}


addEvents(getTextArea(),getButton());
