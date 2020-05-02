
//@ts-check
var endSpan;
function getTextArea(){
  return document.getElementById("text_html");
}
function getSpansI(){
  return document.getElementsByName("I")
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
function getSelectedText(e)
{
  getResultArea().innerHTML=window.getSelection().toString();
  endSpan =e.srcElement;
}
function reProcessText()
{
  let style ='<span style="background:'+getColor().value+'" class="labaled">';
  let selected =getResultArea().value;
  let fullSpan = endSpan.innerHTML;
  let output =fullSpan.replace(selected,style+selected+"</span>");
  console.log(output);
  endSpan.innerHTML = output;
}
function addEvents(html_Button,html_spans){
  html_Button.addEventListener("click",reProcessText);
  let eventos = ["mousedown","mouseup"];
  let i=0;
  for(i=0;i<html_spans.length;i++)
  {
    for(let e in eventos){
      html_spans[i].addEventListener( eventos[e], getSelectedText);
    }
  }
}
addEvents(getButton(),getSpansI());

