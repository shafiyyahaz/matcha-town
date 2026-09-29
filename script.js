const S=JSON.parse(localStorage.getItem("matchaTownSave")||'null')||{coins:150,xp:0,energy:5,met:[],items:[],daily:false,night:false};
const $=id=>document.getElementById(id);
const save=()=>localStorage.setItem("matchaTownSave",JSON.stringify(S));
const toast=m=>{const t=$("toast");t.textContent=m;t.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove("show"),1800)};
const stats=()=>{$("coins").textContent=S.coins;$("xp").textContent=S.xp;$("energy").textContent=S.energy};
const xp=n=>{S.xp=Math.min(100,S.xp+n);stats();save()};
const modal=h=>{$("content").innerHTML=h;$("modal").classList.remove("hidden")};
$("close").onclick=()=>$("modal").classList.add("hidden");
$("modal").onclick=e=>{if(e.target===$("modal"))$("modal").classList.add("hidden")};

$("enter").onclick=()=>{$("welcome").classList.add("hidden");$("app").classList.remove("hidden");toast("Welcome home, little explorer! 🍵");};
$("dayBtn").onclick=()=>{S.night=!S.night;$("app").classList.toggle("night",S.night);$("dayBtn").textContent=S.night?"🌙":"☀️";save();toast(S.night?"Moonlight mode ✨":"Good morning! ☀️")};
if(S.night){$("app").classList.add("night");$("dayBtn").textContent="🌙"}

document.querySelectorAll(".place").forEach(b=>b.onclick=()=>{
 const p=b.dataset.place;
 const data={
 cafe:["🍵 Matcha Café","A warm little café where every drink feels like a hug.","☕ Try a Matcha Latte","Order a cozy drink","drink"],
 garden:["🌱 Matcha Garden","Grow tiny plants, find leaves, and collect ingredients.","🌿 Gather a Leaf","Search the garden","leaf"],
 shop:["🛍️ Little Shop","A tiny shop packed with ribbons, furniture and surprises.","🎀 Browse Shop","More treasures unlock with XP.","shop"],
 house:["🏠 Cozy House","Your little home. Soon you can decorate every corner.","🛋️ Decorate","Collect furniture to make it yours.","house"]
 }[p];
 modal(`<h2>${data[0]}</h2><p>${data[1]}</p><div class="card"><b>${data[2]}</b><p>${data[3]}</p>${p==="cafe"?'<button class="main-btn" id="drink">Make Matcha — 20 🪙</button>':p==="garden"?'<button class="main-btn" id="leaf">Collect Leaf 🌿</button>':''}</div>`);
 if(p==="cafe")$("drink").onclick=()=>{if(S.coins<20){toast("Not enough coins 💭");return} if(S.energy>=5){toast("Energy is already full! ❤️");return}S.coins-=20;S.energy++;xp(10);toast("Yum! Matcha energy restored 🍵");$("modal").classList.add("hidden")};
 if(p==="garden")$("leaf").onclick=()=>{S.items.push("leaf");S.coins+=8;xp(12);stats();save();toast("You found a fresh matcha leaf! 🌿 +8 coins");$("modal").classList.add("hidden")};
});

document.querySelectorAll(".npc").forEach(n=>n.onclick=()=>{
 const name=n.dataset.npc;
 if(!S.met.includes(name)){S.met.push(name);S.coins+=12;xp(15);stats();save();toast(`You met ${name}! +12 coins +15 XP ✨`)}
 else toast(name==="Momo"?"Momo: The café has the best mornings! 🍵":name==="Mimi"?"Mimi: I found a flower! 🌸":"Kiki: Let's explore!");
});

$("fountain").onclick=()=>{const g=3+Math.floor(Math.random()*8);S.coins+=g;xp(5);stats();save();toast(`The fountain sparkled! +${g} coins ✨`)};

$("daily").onclick=()=>{
 if(S.daily){toast("Come back tomorrow for another gift! 🎁");return}
 S.daily=true;S.coins+=50;S.energy=5;xp(20);stats();save();toast("Daily gift: +50 coins + full energy! 🎁");
};

$("surprise").onclick=()=>{
 const worlds=["🏡 Town Square","🍵 Matcha Café","🌱 Matcha Garden","🛍️ Little Shop","🏠 Cozy House","🌳 Whispering Forest","🌸 Sakura Hill","🌙 Moonlight Lake"];
 const pick=worlds[Math.floor(Math.random()*worlds.length)];
 modal(`<h2>🎲 Surprise Me!</h2><p>The town chose a little adventure for you...</p><div class="card" style="text-align:center;font-size:25px">${pick}</div><p style="text-align:center">Go explore this place and see what you discover! ✨</p>`);
};

document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>{
 document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active"));b.classList.add("active");
 const p=b.dataset.panel;
 if(p==="home"){$("modal").classList.add("hidden");return}
 if(p==="map"){
 const worlds=[["🏡","Town Square","OPEN"],["🍵","Matcha Café","OPEN"],["🌱","Matcha Garden","OPEN"],["🛍️","Little Shop","OPEN"],["🏠","Cozy House","OPEN"],["🌳","Whispering Forest","LV 2"],["🌸","Sakura Hill","LV 3"],["🌙","Moonlight Lake","LV 5"]];
 modal(`<h2>🗺️ Your Green World</h2><p>Eight little places are waiting to become part of your story.</p><div class="world-grid">${worlds.map((w,i)=>`<div class="world-card ${i>4?'locked':''}"><span style="font-size:30px">${w[0]}</span><b>${w[1]}</b><small>${w[2]} ${i>4?"🔒":""}</small></div>`).join("")}</div>`);
 }
 if(p==="quest"){
 const n=S.met.length, pct=Math.min(100,Math.round(n/3*100));
 modal(`<h2>🎯 Cozy Quests</h2><div class="card"><b>Meet the Villagers</b><p>Say hello to Momo, Mimi and Kiki.</p><div class="progress"><i style="width:${pct}%"></i></div><p>${n}/3 met ${n>=3?"— COMPLETE! 🎉":"— keep exploring!"}</p></div><div class="card"><b>Little Explorer</b><p>Visit 3 different places around town.</p><p>🌿 Your town is full of tiny secrets.</p></div>`);
 }
 if(p==="bag"){
 modal(`<h2>🎒 Little Bag</h2><div class="card"><b>🌿 Matcha Leaves</b><p>${S.items.filter(x=>x==="leaf").length} collected</p></div><div class="card"><b>🧸 Cozy items</b><p>More collectibles will appear as you unlock worlds.</p></div>`);
 }
 if(p==="profile"){
 const level=1+Math.floor(S.xp/100);
 modal(`<h2>🌿 Little Explorer</h2><p>Welcome to your Matcha Town profile.</p><div class="card"><b>Level ${level} Explorer</b><p>⭐ ${S.xp} XP · 🪙 ${S.coins} coins · 🧑‍🤝‍🧑 ${S.met.length}/3 villagers met</p></div><div class="card"><b>Town motto</b><p>“Slow days, tiny joys, lots of matcha.” 🍵</p></div>`);
 }
});
stats();
