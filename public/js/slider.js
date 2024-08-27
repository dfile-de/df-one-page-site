'use strict';
const dfSliderModul=(sliderSelector)=>{

    const sliderContainer=document.querySelector(sliderSelector);
    const slider=document.querySelector(sliderSelector+' .slider');
    const slides=document.querySelector(sliderSelector+' ul');
    const slide=document.querySelector(sliderSelector+' li');
    const allSlides=Array.from(document.querySelectorAll(sliderSelector+' li'));
    const sliderImages = Array.from(document.querySelectorAll(sliderSelector+' li img'));
  
    // buttons
    const prevButton=document.querySelector(sliderSelector+' .btn.prev');
    const nextButton=document.querySelector(sliderSelector+' .btn.next');

    // dot navigation
    const dotNav=document.querySelector(sliderSelector+' .dotnav');

    //############################################################################
    //############################################################################

    // set slider height
    const setSliderHeight=()=>{
        const slideHeight=slide.offsetHeight;
        const dotNavHeight=dotNav.offsetHeight;
        slider.style.height=slideHeight+'px';
        sliderContainer.style.height=slideHeight+dotNavHeight+'px';
    }

    // set slider height after resize
    const resizeSlider=()=>{
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout); 
            resizeTimeout = setTimeout(() => {
                setSliderHeight();
            }, 100); 
        });
    }

    // images and slider loaded
    const isImageLoaded=(image)=>{
        return new Promise((resolve, reject) => {
        // image is cached
        if(image.complete){
            // cl('Image loaded :'+image);
            resolve(image);
        }
        image.onload = () =>{
            // cl('Image loaded :'+image);
            resolve(image);
        }
        image.onerror = reject;
        });
    }
    const sliderLoaded=()=>{
        Promise.all(sliderImages.map(isImageLoaded))
        .then(() =>{
            setSliderHeight();
            removeLoader();
            setSliderHeight();
            prevButton.style.visibility = 'visible';
            // prevButton.classList.add('start-disabled');
            nextButton.style.visibility = 'visible';
            dotNav.style.visibility = 'visible';
            // dotNavButton[0].classList.add('active');
            // slide 1 z-index
            allSlides[0].style.zIndex=allSlides.length+1;
            // add class first and last slide
            allSlides[0].classList.add('active');
            // add index to slides
            allSlides.forEach((slide,index)=>{
            slide.classList.add('slide-'+(index+1));
            slide.style.opacity = 0;
            });
            // autoplay
            sliderAutoplay(4);
            } 
        )
    }
    // add and remove loader 
    const addLoader=()=>{
        const loader=document.createElement('div');
        loader.classList.add('loader');
        sliderContainer.prepend(loader);
        // loader svg
        const loaderIcon=document.createElement('div');
        loaderIcon.classList.add('icon');
        loader.append(loaderIcon);
    }
    const removeLoader=()=>{
        const loader=document.querySelector('.loader');
        loader.classList.add('fadeout');
        slides.style.visibility = 'visible';
        setTimeout(() => {
            loader.parentNode.removeChild(loader);
        }, 500);
    }

    //############################################################################
    // dotnav
    const addDotNav=()=>{
        let dot;
        for(let i=0;i<allSlides.length;i++){
            dot=document.createElement('button');
            dot.setAttribute('aria-label', 'Button Carousel Indicator');
            dotNav.prepend(dot);
        }
    }
    addDotNav();
    const dotNavButton=Array.from(document.querySelectorAll(sliderSelector+' .dotnav button'));

    // next and prev index
    let imageIndex=0;
    const nextIndex = () => (imageIndex + 1) % allSlides.length;
    const prevIndex = () => (imageIndex + allSlides.length-1) % allSlides.length;

    // animate slides
    const showImages=(dir,index)=>{
        allSlides.forEach((img)=>{
            img.classList.remove('active');
            img.style.zIndex = 1;
            img.style.opacity = 1;
        });

        let indexPrev;
        dir==='next'?indexPrev=prevIndex() : indexPrev=nextIndex();
        const nextSlide=allSlides[index];
        const prevSlide=allSlides[indexPrev];
        prevSlide.style.zIndex=allSlides.length;
        nextSlide.style.zIndex=allSlides.length+1;
        nextSlide.classList.add('active');
         // add active class to dotnavigation
         dotNavButton.forEach((button)=>{
            button.removeAttribute('class');
        });
        dotNavButton[index].classList.add('active');
    } 

    // to next or previus slide
    const toNextSlide=()=>{
        imageIndex=nextIndex();
        showImages('next',imageIndex);
    }
    const ToPrevSlide=()=>{
        imageIndex=prevIndex();
        showImages('prev',imageIndex);
    }
    //############################################################################
    const sliderAutoplay=(time)=>{
        let autoplay=setInterval(toNextSlide, time *1000);
        sliderContainer.addEventListener('mouseover',()=>{ 
            clearInterval(autoplay);
            
        }) 
        sliderContainer.addEventListener('mouseout',()=>{ 
            autoplay=setInterval(toNextSlide, time *1000);
        }) 
    }
    //############################################################################
    // init slider
    addLoader();
    sliderLoaded();
    resizeSlider();
    nextButton.addEventListener('click',toNextSlide);
    prevButton.addEventListener('click',ToPrevSlide);
  
}//end dfSlider

export default dfSliderModul;