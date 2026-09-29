const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const worlds=[
 {id:"town",name:"🏡 Town Square",desc:"The heart of Matcha Town.",emoji:"🏡",open:true},
 {id:"cafe",name:"🍵 Matcha Café",desc:"Warm drinks and tiny treats.",emoji:"🍵",open:true},
 {id:"garden",name:"🌱 Matcha Garden",desc:"Collect leaves and hidden treasures.",emoji:"🌱",open:true},
 {id:"shop",name:"🛍️ Little Shop",desc:"Cute things for your adventure.",emoji:"🛍️",open:true},
 {id:"house",name:"🏠 Cozy House",desc:"A peaceful place to rest.",emoji:"🏠",open:true},
 {id:"forest",name:"🌳 Whispering Forest",desc:"A mysterious green forest.",emoji:"🌳",open:true},
 {id:"sakura",name:"🌸 Sakura Hill",desc:"Pink petals and a dreamy view.",emoji:"🌸",open:true},
 {id:"lake",name:"🌙 Moonlight Lake",desc:"A magical lake under the stars.",emoji:"🌙",open:true}
];
let state=JSON.parse(localStorage.getItem("matchaTownV3")||'{"coins":150,"xp":0,"energy":5,"met":[],"items":[],"daily":false,"night":false,"world":"town"}');
let px=50,py=14;
function save(){localStorage.setItem("matchaTownV3",JSON.stringify(state));render()}
function render(){
 $("#coins").textContent=state.coins;$("#xp").textContent=state.xp;$("#energy").textContent=state.energy;
 $("#clock").textContent=state.night?"Night":"Day";document.body.classList.toggle("night",state.night);
 $("#worldName").textContent=worlds.find(w=>w.id===state.world)?.name||"🏡 Town Square";
}
function modal(html){$("#modalContent").innerHTML=html;$("#modal").classList.remove("hidden")}
function close(){ $("#modal").classList.add("hidden") }
$("#close").onclick=close;$("#modal").onclick=e=>{if(e.target.id==="modal")close()};
$("#enterBtn").onclick=()=>{$("#start").classList.add("hide");render()};
$("#modeBtn").onclick=()=>{state.night=!state.night;save()};
$("#daily").onclick=()=>{
 if(state.daily)return modal(`<div class="reward">🌿</div><h2>Daily Gift sudah diambil!</h2><p>Besok datang lagi untuk hadiah baru ✨</p>`);
 state.daily=true;state.coins+=50;state.xp+=20;state.energy=5;save();
 modal(`<div class="reward">🎁</div><h2>Daily Gift!</h2><p>Kamu mendapat <b>+50 coins</b>, <b>+20 XP</b> dan energy penuh!</p>`);
};
$("#surprise").onclick=()=>{let w=worlds[Math.floor(Math.random()*worlds.length)];goWorld(w.id);modal(`<div class="reward">${w.emoji}</div><h2>Surprise! Kamu pergi ke ${w.name}</h2><p>${w.desc}</p>`)};
function goWorld(id){state.world=id;save(); if(id!=="town") buildWorld(id)}
function buildWorld(id){
 const w=worlds.find(x=>x.id===id);let s=$("#scene");
 const themes={
 cafe:["#f4d6c1","#b9d88e","☕","🍰","🪴","✨"],garden:["#c8efc0","#8ac66e","🌱","🌷","🦋","🍃"],
 shop:["#f8d5e3","#b9d88e","🛍️","🎀","🧸","✨"],house:["#d9e9f7","#a8cf88","🏠","🛏️","🧸","💤"],
 forest:["#a9d5c0","#6ea96e","🌳","🍄","🦊","🍃"],sakura:["#f6d4e5","#a8d58a","🌸","🏯","🦋","🌸"],
 lake:["#9fc6e9","#719e78","🌙","🪷","🐟","✨"]
 };
 let t=themes[id]||themes.cafe;
 s.className="scene";s.style.background=`linear-gradient(${t[0]} 0 55%,${t[1]} 55%)`;
 s.innerHTML=`<div class="sun"></div><div class="moon"></div><div class="hill h1"></div><div class="hill h2"></div>
 <div class="pond"><span>${t[4]}</span><span>${t[3]}</span></div>
 <div class="building interact" data-action="special" style="left:8%;bottom:30%"><div>${t[2]}</div><b>${w.name}</b></div>
 <div class="tree t1">${t[4]}</div><div class="tree t2">${t[4]}</div>
 <div class="npc n1 interact" data-action="npc" data-name="Pip">🐿️<small>Pip</small></div>
 <div class="npc n2 interact" data-action="npc" data-name="Mimi">🐰<small>Mimi</small></div>
 <div id="player">🧑🏻‍🌾</div><div id="leaves">${t[5]}</div><div class="leaf l2">${t[5]}</div>`;
 bindInteractions(); $("#worldName").textContent=w.name;
}
function bindInteractions(){$$(".interact").forEach(x=>x.onclick=()=>act(x.dataset.action,x.dataset.name))}
function act(a,name){
 if(a==="npc"){
  if(!state.met.includes(name)){state.met.push(name);state.coins+=12;state.xp+=15;save();modal(`<div class="reward">💚</div><h2>Kamu bertemu ${name}!</h2><p>${name} memberimu <b>+12 coins</b> dan <b>+15 XP</b>.</p>`)}
  else modal(`<div class="reward">👋</div><h2>Hai lagi, ${name}!</h2><p>${name} senang melihatmu kembali.</p>`);
 }
 if(a==="fountain"){let n=3+Math.floor(Math.random()*8);state.coins+=n;state.xp+=5;save();modal(`<div class="reward">⛲</div><h2>Fountain Wish!</h2><p>Koin berkilau muncul: <b>+${n} coins</b> dan +5 XP ✨</p>`)}
 if(a==="cafe"){if(state.energy<5){state.energy=5;state.xp+=10;save();modal(`<div class="reward">🍵</div><h2>Matcha Time!</h2><p>Energy kamu kembali penuh. +10 XP!</p>`)}else modal(`<div class="reward">🍵</div><h2>Matcha Café</h2><p>Energy kamu sudah penuh. Nikmati suasananya dulu 🌿</p>`)}
 if(a==="shop")modal(`<div class="reward">🛍️</div><h2>Little Shop</h2><p>Shop ini siap jadi tempat belanja item di update berikutnya!</p>`);
 if(a==="house")modal(`<div class="reward">🏠</div><h2>Cozy House</h2><p>Rumah kecilmu terasa hangat dan nyaman 🧸</p>`);
 if(a==="special"){state.xp+=8;save();modal(`<div class="reward">${worlds.find(w=>w.id===state.world).emoji}</div><h2>Exploring!</h2><p>Kamu menemukan sesuatu yang cantik. +8 XP ✨</p>`)}
}
$$(".interact").forEach(x=>x.onclick=()=>act(x.dataset.action,x.dataset.name));
document.addEventListener("keydown",e=>{
 if(!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d","W","A","S","D"].includes(e.key))return;
 e.preventDefault();let k=e.key.toLowerCase();if(e.key==="ArrowLeft"||k==="a")px=Math.max(5,px-3);if(e.key==="ArrowRight"||k==="d")px=Math.min(92,px+3);if(e.key==="ArrowUp"||k==="w")py=Math.min(70,py+3);if(e.key==="ArrowDown"||k==="s")py=Math.max(5,py-3);$("#player").style.left=px+"%";$("#player").style.bottom=py+"%";
});
$$("[data-key]").forEach(b=>b.onclick=()=>{document.dispatchEvent(new KeyboardEvent("keydown",{key:b.dataset.key}))});
$("#mapBtn").onclick=()=>modal(`<h2>🗺️ Matcha World Map</h2><p>Pilih dunia untuk dijelajahi.</p><div class="world-grid">${worlds.map(w=>`<button class="world-btn" data-w="${w.id}">${w.emoji} <b>${w.name.replace(/^\\S+ /,"")}</b><br><small>${w.desc}</small></button>`).join("")}</div>`);
document.addEventListener("click",e=>{let b=e.target.closest("[data-w]");if(b){goWorld(b.dataset.w);close()}});
$$(".feature").forEach(b=>b.onclick=()=>goWorld(b.dataset.world));
$$(".nav").forEach(n=>n.onclick=()=>{
 $$(".nav").forEach(x=>x.classList.remove("active"));n.classList.add("active");let p=n.dataset.panel;
 if(p==="town"){goWorld("town");return}
 if(p==="worlds")$("#mapBtn").click();
 if(p==="quests")modal(`<h2>🎯 Quests</h2><p>🌱 <b>Meet the villagers</b><br>Temui 3 warga • progress: ${Math.min(state.met.length,3)}/3</p><p>✨ Hadiah: 50 coins + 30 XP</p>`);
 if(p==="bag")modal(`<h2>🎒 Your Bag</h2><p>🍃 Matcha Leaves: ${state.items.length}</p><p>🔮 Mystery item: coming soon!</p>`);
 if(p==="profile")modal(`<h2>🌿 Profile</h2><p>Level: <b>${1+Math.floor(state.xp/50)}</b></p><p>XP: ${state.xp} • Coins: ${state.coins}</p><p>Villagers met: ${state.met.length}</p>`);
});
bindInteractions();render();
