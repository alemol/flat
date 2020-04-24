
//@ts-check
function getTextArea(){
  return document.getElementById("text_html");
}
function getResultArea(){
  return document.getElementById("result");
}
function processSelectedText(pElementHtml,pStarts,pEnds)
{
    return pElementHtml.slice(pStarts,pEnds);  
}
function getSelectedText()
{
  var textArea = getTextArea();
  var inicio = textArea.selectionStart;
  var fin    = textArea.selectionEnd;
  getResultArea().innerHTML=processSelectedText(textArea.value,inicio,fin);
}
function addEvents(elemento_html){
  var eventos = ["keyup","keydown","mousedown","mouseup","mousemove"];
  for(var i in eventos){
    elemento_html.addEventListener( eventos[i], getSelectedText);
  }
}
addEvents(getTextArea());
