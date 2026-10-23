const $ = id => document.getElementById(id);
const ids=["ancho","alto","padding","borde","margen","modelo"];
function update(){
 const w=+$("ancho").value,h=+$("alto").value,p=+$("padding").value,b=+$("borde").value,m=+$("margen").value,model=$("modelo").value;
 for(const id of ["ancho","alto","padding","borde","margen"]) $(id+"Out").value=$(id).value+"px";
 const box=$("box");
 box.style.boxSizing=model;box.style.width=w+"px";box.style.height=h+"px";box.style.padding=p+"px";box.style.borderWidth=b+"px";box.style.margin=m+"px";
 const totalW=model==="border-box"?w:w+2*p+2*b;
 const totalH=model==="border-box"?h:h+2*p+2*b;
 $("totalW").textContent=(totalW+2*m)+"px (incluye márgenes)";
 $("totalH").textContent=(totalH+2*m)+"px (incluye márgenes)";
 $("cssOutput").textContent=`.caja {\n  box-sizing: ${model};\n  width: ${w}px;\n  height: ${h}px;\n  padding: ${p}px;\n  border: ${b}px solid #2563eb;\n  margin: ${m}px;\n}`;
}
ids.forEach(id=>$(id).addEventListener("input",update));
$("reset").addEventListener("click",()=>{$("ancho").value=240;$("alto").value=120;$("padding").value=20;$("borde").value=4;$("margen").value=16;$("modelo").value="content-box";update();$("status").textContent="Valores restablecidos.";});
$("copy").addEventListener("click",async()=>{try{await navigator.clipboard.writeText($("cssOutput").textContent);$("status").textContent="CSS copiado.";}catch(e){$("status").textContent="No se pudo copiar automáticamente. Selecciona el CSS y cópialo manualmente.";}});
update();
