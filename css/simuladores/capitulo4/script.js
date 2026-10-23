const $ = id => document.getElementById(id);
const ids = ["color1","color2","tipo","angulo","radio","blur","opacidad","sombra"];
function update(){
 const c1=$("color1").value,c2=$("color2").value,tipo=$("tipo").value;
 const angle=$("angulo").value,radius=$("radio").value,blur=$("blur").value,opacity=Number($("opacidad").value)/100,shadow=$("sombra").value;
 $("anguloOut").value=angle+"°";$("radioOut").value=radius+"px";$("blurOut").value=blur+"px";$("opacidadOut").value=$("opacidad").value+"%";$("sombraOut").value=shadow+"px";
 let background=tipo==="solid"?c1:tipo==="radial"?`radial-gradient(circle, ${c1}, ${c2})`:`linear-gradient(${angle}deg, ${c1}, ${c2})`;
 const css=`background: ${background};\nborder-radius: ${radius}px;\nfilter: blur(${blur}px);\nopacity: ${opacity};\nbox-shadow: 0 10px ${shadow}px rgb(20 30 60 / 22%);`;
 $("preview").querySelector(".sample").style.cssText=css;
 $("cssOutput").textContent=`.tarjeta {\n  ${css.replaceAll("\n","\n  ")}\n}`;
}
ids.forEach(id=>$(id).addEventListener("input",update));
$("reset").addEventListener("click",()=>{ $("color1").value="#2563eb";$("color2").value="#9333ea";$("tipo").value="linear";$("angulo").value=120;$("radio").value=16;$("blur").value=0;$("opacidad").value=100;$("sombra").value=18;update();$("status").textContent="Valores restablecidos.";});
$("copy").addEventListener("click",async()=>{try{await navigator.clipboard.writeText($("cssOutput").textContent);$("status").textContent="CSS copiado."; }catch(e){$("status").textContent="No se pudo copiar automáticamente. Selecciona el CSS y cópialo manualmente."; }});
update();
