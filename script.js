const toast=document.getElementById('toast');
let timer;
function show(message){clearTimeout(timer);toast.textContent=message;toast.classList.add('show');timer=setTimeout(()=>toast.classList.remove('show'),2400)}

document.querySelectorAll('[data-place]').forEach(el=>el.addEventListener('click',()=>show('✨ Welcome to '+el.dataset.place+'!')));
document.querySelectorAll('[data-friend]').forEach(el=>el.addEventListener('click',()=>show('💚 '+el.dataset.friend+' says: "Let’s explore!"')));

document.getElementById('surpriseBtn').addEventListener('click',()=>{
  const choices=[
    ['🍵','Momo saved you a cozy matcha break!'],['🌸','Lottie found a secret flower path!'],['📚','Mochi left a tiny note in the library!'],['✨','You discovered a hidden sparkle in town!'],['🛍️','A mystery treasure appeared in the Little Shop!']
  ];
  const [icon,msg]=choices[Math.floor(Math.random()*choices.length)];show(icon+' '+msg)
});

document.getElementById('exploreBtn').addEventListener('click',()=>document.getElementById('places').scrollIntoView({behavior:'smooth'}));
document.getElementById('storyBtn').addEventListener('click',()=>show('🌿 Matcha Town was made for slow days and happy little moments.'));
document.getElementById('secretBtn').addEventListener('click',()=>show('🌲 Shhh… a secret path will open soon!'));

function updateClock(){
  const now=new Date();const h=now.getHours();const m=String(now.getMinutes()).padStart(2,'0');
  const icon=h>=18||h<6?'🌙':h>=16?'🌇':'☀️';
  const hour=h%12||12;document.getElementById('clock').textContent=`${icon} ${hour}:${m} ${h>=12?'PM':'AM'}`;
}
updateClock();setInterval(updateClock,30000);
