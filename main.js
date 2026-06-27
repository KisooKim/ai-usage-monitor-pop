document.addEventListener('DOMContentLoaded',()=>{
  const els=document.querySelectorAll('.reveal');
  if(!('IntersectionObserver'in window)){els.forEach(e=>e.classList.add('is-visible'));return;}
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){en.target.classList.add('is-visible');io.unobserve(en.target);} });
  },{threshold:.15,rootMargin:'0px 0px -10% 0px'});
  els.forEach(e=>io.observe(e));

  const nav=document.getElementById('nav');
  const onScroll=()=>nav.classList.toggle('frost',window.scrollY>12);
  onScroll(); window.addEventListener('scroll',onScroll,{passive:true});
});
