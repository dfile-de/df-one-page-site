'use strict';
const uiModul=()=> {
    // nav mobile
    const togglenav=document.querySelector('.toggle-nav');
    const body=document.querySelector('body');
    const main=document.querySelector(".container");

    togglenav.addEventListener('click', () =>{
        togglenav.classList.toggle('is-active');
        body.classList.toggle('show-nav');
    
    });
    main.addEventListener('click',() => {
        if(body.classList.contains('show-nav')){
            togglenav.classList.remove('is-active');
            body.classList.remove('show-nav');
        }
    });
    // nav anchor to id
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click',(e)=> {
            const targetId = anchor.getAttribute('href');
            if(targetId !=='#') {
                e.preventDefault();
                document.querySelector(anchor.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    // scroll to top
    const scrolltotop=document.querySelector('.scroll-to-top');	
    scrolltotop.style.opacity = 0;
    scrolltotop.addEventListener('click',() => {  
        document.querySelector('.top').scrollIntoView({ behavior: 'smooth'});
    });
    // scroll to top wait one second
    window.addEventListener('scroll', () => {
        let totop;
        clearTimeout(totop); 
        totop = setTimeout(() => {
            // scroll to top visible?
            if (Math.round(window.scrollY) >= 300) {
                scrolltotop.style.opacity = 1;
                scrolltotop.style.visibility = 'visible';
            } else {
                scrolltotop.style.opacity = 0;
            }
        }, 1000);
    });
    // wait for transition opacity 0 
    scrolltotop.addEventListener('transitionend', () => { 
        if (window.getComputedStyle(scrolltotop).opacity == '0') {
            scrolltotop.style.visibility = 'hidden';
        }
        else{
            scrolltotop.style.visibility = 'visibel';
        }
    });
     // animate in view IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('inview');
            } else {
                entry.target.classList.remove('inview');
            }
        });
    }, {
        threshold: 0.5
    });
    // animate in view
    let aiv=document.querySelectorAll('.animate');
    aiv.forEach(element => {
        observer.observe(element);
    });
}
export default uiModul;