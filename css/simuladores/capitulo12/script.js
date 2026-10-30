const C={"props": ["--principal:#2563eb", "--superficie:#eff6ff", "--espacio:16px", "--radio:12px"], "vals": ["#2563eb", "#eff6ff", "16", "12"], "initial": ":root{--principal:#2563eb;--superficie:#eff6ff;--espacio:16px;--radio:12px}.stage{padding:var(--espacio);background:#f8fafc}.tile{display:inline-block;padding:var(--espacio);background:var(--superficie);border:1px solid var(--principal);border-radius:var(--radio)}", "html": "<div class=\"stage\"><div class=\"tile\">CSS</div><div class=\"tile tile2\">En vivo</div><p>Modifica los controles para observar el efecto.</p></div>", "n": 12};
const preview=document.querySelector("#preview"), generated=document.querySelector("#generated"), status=document.querySelector("#status");
const controls=[...document.querySelectorAll("[data-index]")];
function current(i){return controls.find(e=>Number(e.dataset.index)===i)}
function update(){let extra=[];C.props.forEach((p,i)=>{const el=current(i);if(!el)return;let v=el.value;const out=document.querySelector("#out"+i);if(out)out.textContent=v;
let target=preview.querySelector(".stage")||preview;let prop=p.split(":")[0].trim();let val=v;
if(C.n===6){if(i===0){prop="display";target=preview.querySelector(".tile")}if(i===1){prop="position";target=preview.querySelector(".tile")}if(i===2){prop="top";target=preview.querySelector(".tile");val=v+"px"}if(i===3){prop="left";target=preview.querySelector(".tile");val=v+"px"}if(i===4){prop="z-index";target=preview.querySelector(".tile");val=v}if(i===5){prop="overflow";target=preview.querySelector(".stage")}}
if(C.n===7){const map=["flex-direction","justify-content","align-items","flex-wrap","gap"];prop=map[i];target=preview.querySelector(".stage");if(i===4)val=v+"px"}
if(C.n===8){const map=["grid-template-columns","gap","justify-items","align-content"];prop=map[i];target=preview.querySelector(".stage");if(i===0)val=`repeat(${v}, minmax(0, 1fr))`;if(i===1)val=v+"px"}
if(C.n===9){const map=["width","grid-template-columns","gap","font-size"];prop=map[i];target=i===1||i===2?preview.querySelector(".stage"):preview.querySelector(".stage");if(i===0)val=v+"px";if(i===2)val=v+"px";if(i===3){prop="font-size";val=v+"px";target=preview.querySelector("p")}}
if(C.n===10){const map=["width","border-radius","border-collapse","font-size"];prop=map[i];target=preview.querySelector(".tile");if(i===0)val=v+"%";if(i===1)val=v+"px";if(i===3)val=v+"px"}
if(C.n===11){const map=["transform","transition-duration","transition-timing-function","border-radius"];prop=map[i];target=preview.querySelector(".tile");if(i===1)val=v+"ms";if(i===3)val=v+"px";if(i===0)target.addEventListener("mouseenter",()=>target.style.transform=v,{once:true})}
if(C.n===12||C.n===13||C.n===16){target=preview;prop=p.split(":")[0].trim();if(prop.startsWith("--")){preview.style.setProperty(prop,v+(C.vals[i].match(/^\\d+$/)?(prop==="--espacio"||prop==="--radio"?"px":""):""));return}if(i===1||i===2)val=v+"px"}
if(C.n===14){const map=["font-size","line-height","outline-width","outline-color"];prop=map[i];target=preview.querySelector(".tile");if(i===0)val=v+"px";if(i===2)val=v+"px"}
if(C.n===15){const map=["box-sizing","width","padding","border-width"];prop=map[i];target=preview.querySelector(".tile");if(i>0)val=v+"px";if(i===3)val=v+"px"}
if(target)target.style.setProperty(prop,val);
extra.push(`${p.split(":")[0]}: ${val};`);
});
generated.textContent="/* CSS base */\\n"+C.initial+"\\n\\n/* Valores modificados */\\n"+extra.join("\\n");
}
function reset(){preview.innerHTML=C.html;controls.forEach((el,i)=>{el.value=C.vals[i]});update();status.textContent="Valores iniciales restaurados."}
controls.forEach(el=>el.addEventListener("input",update));
document.querySelector("#reset").addEventListener("click",reset);
document.querySelector("#copy").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(generated.textContent);status.textContent="CSS copiado."}catch(e){status.textContent="No se pudo copiar automáticamente; selecciona el CSS y cópialo manualmente."}});
update();
