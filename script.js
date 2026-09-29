const state = {
  coins: 120,
  xp: 0,
  energy: 5,
  met: new Set(),
  items: []
};

const $ = (id) => document.getElementById(id);
const toast = (msg) => {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(window.__toast);
  window.__toast = setTimeout(() => t.classList.remove("show"), 1800);
};

function renderStats(){
  $("coins").textContent = state.coins;
  $("xp").textContent = state.xp;
  $("energy").textContent = state.energy;
}
function addXP(n){
  state.xp = Math.min(100, state.xp + n);
  renderStats();
}
function openPanel(html){
  $("panelContent").innerHTML = html;
  $("panel").classList.remove("hidden");
}
$("closePanel").addEventListener("click", () => $("panel").classList.add("hidden"));
$("panel").addEventListener("click", e => {
  if(e.target === $("panel")) $("panel").classList.add("hidden");
});

$("enterBtn").addEventListener("click", () => {
  $("welcome").classList.add("hidden");
  $("game").classList.remove("hidden");
  toast("Welcome to Matcha Town! 🍵");
});

document.querySelectorAll(".location-card").forEach(btn => {
  btn.addEventListener("click", () => {
    const place = btn.dataset.place;
    const data = {
      cafe: ["🍵 Matcha Café", "A cozy little café in the heart of town.", "Buy a matcha drink for 20 coins and restore 1 energy."],
      shop: ["🛍️ Little Shop", "Tiny treasures for your tiny green world.", "Shop is warming up! More items will unlock soon."],
      garden: ["🌱 Matcha Garden", "Fresh leaves, flowers, and quiet mornings.", "Collecting will be available in the next area update."],
      house: ["🏠 Cozy House", "Your personal little corner of Matcha Town.", "Decorations will unlock as you explore."]
    }[place];
    openPanel(`<h2>${data[0]}</h2><p>${data[1]}</p><div class="quest"><b>Coming up</b><p>${data[2]}</p></div>`);
  });
});

document.querySelectorAll(".npc").forEach(npc => {
  npc.addEventListener("click", () => {
    const name = npc.dataset.npc;
    if(!state.met.has(name)){
      state.met.add(name);
      state.coins += 10;
      addXP(15);
      renderStats();
      toast(`You met ${name}! +10 coins +15 XP ✨`);
    } else {
      toast(`${name}: "Have a lovely day! 🍃"`);
    }
  });
});

$("fountain").addEventListener("click", () => {
  const gain = Math.floor(Math.random()*5)+1;
  state.coins += gain;
  addXP(5);
  renderStats();
  toast(`The fountain gave you ${gain} coin${gain>1?"s":""}! ✨`);
});

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const panel = btn.dataset.panel;
    if(panel === "home"){ $("panel").classList.add("hidden"); return; }
    if(panel === "quest"){
      const count = state.met.size;
      const pct = Math.round(count/3*100);
      openPanel(`<h2>🎯 Welcome Quest</h2>
        <p>Meet 3 villagers around Town Square.</p>
        <div class="quest"><b>Progress: ${count}/3</b><div class="progress"><i style="width:${pct}%"></i></div>
        <p>${count>=3 ? "Quest complete! 🎉 You are officially part of Matcha Town." : "Click the walking villagers to say hello."}</p>
        </div>`);
    }
    if(panel === "inventory"){
      openPanel(`<h2>🎒 Your Bag</h2><div class="quest"><b>🌿 Mystery Leaf</b><p>${state.items.includes("leaf") ? "1 collected" : "Not collected yet"}</p></div>`);
    }
    if(panel === "map"){
      openPanel(`<h2>🗺️ Town Map</h2><p>Explore the places of Matcha Town.</p>
      <div class="map-grid">
        <div class="map-item">🏡 <b>Town Square</b><br><small>OPEN</small></div>
        <div class="map-item">🍵 <b>Matcha Café</b><br><small>OPEN</small></div>
        <div class="map-item">🌱 <b>Matcha Garden</b><br><small>OPEN</small></div>
        <div class="map-item">🛍️ <b>Little Shop</b><br><small>OPEN</small></div>
        <div class="map-item locked">🌳 <b>Whispering Forest</b><br><small>🔒 Unlock later</small></div>
        <div class="map-item locked">🌙 <b>Moonlight Lake</b><br><small>🔒 Unlock later</small></div>
      </div>`);
    }
  });
});

renderStats();
