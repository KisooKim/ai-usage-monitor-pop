document.addEventListener('DOMContentLoaded',()=>{
  // Frost the sticky nav once the page is scrolled. (Reveal is pure CSS now.)
  const nav=document.getElementById('nav');
  const onScroll=()=>nav.classList.toggle('frost',window.scrollY>12);
  onScroll(); window.addEventListener('scroll',onScroll,{passive:true});
});
