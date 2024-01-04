import Glide from '@glidejs/glide';

const config = { debug: true, name: 'gliders.js', version: '1.0' };

const events = [ "build.after", "run.after" ];
const elements = document.querySelectorAll( '.js--glide' ) || [];
const gliders = {};

const createGliderFromElement = ( element = {} ) => {

  let element_id = element?.id ?? '';
  let animationDuration = parseInt( element.dataset?.glideAnimationDuration ?? 450 );
  let autoplay = parseInt( element.dataset?.glideAutoplay ?? 3500 );
  let direction = element.dataset?.glideDirection ?? 'rtl';
  let gap = parseInt( element.dataset?.glideGap ?? 36 );
  let style = element.dataset?.glideStyle ?? '';

  let options = getOptions({
    animationDuration,
    autoplay,
    direction,
    gap
  });

  switch ( style ) {
    case 'announcements': {
      options.hoverpause = true;
      break;
    }
  }

  let glide = new Glide( "#" + element_id, options );

  glide.on( events, event => {
    switch ( style ) {
      case 'product-image-gallery-carousel': {
        updateProductGalleryModalTrigger( glide.index );
        break;
      }
      default: {
        setTimeout( () => updateGlideTrackHeight( element ), 100 );
        break;
      }
    }
  });

  ( document.querySelectorAll( '[data-glide-navigation="#' + element_id + '"].next, [data-target="#' + element_id + '"].next' ) || [] ).forEach( button => {
    button.addEventListener("click", function () {
      glide.go(">");
    });
  });

  ( document.querySelectorAll( '[data-glide-navigation="#' + element_id + '"].prev, [data-target="#' + element_id + '"].prev' ) || [] ).forEach( button => {
    button.addEventListener("click", function () {
      glide.go("<");
    });
  });

  glide.mount();

  // FIX for when single slide does not fill 100% of glider
  setTimeout( () => {
    console.log( element_id, style, options );
     glide.update();
   }, 250 );

  gliders[element_id] = { element_id, glide };

};

const getOptions = ( custom = {} ) => {

  let standard = {
    animationTimingFunc: "ease-in-out",
    animationDuration: 350,
    autoHeight: true,
    autoplay: 3250,
    direction: 'rtl',
    dragThreshold: 35,
    hoverpause: false,
    perView: 1,
    swipeThreshold: 35,
    type: "carousel",
    rewind: true,
    throttle: 50,
    gap: 0,
  };

  return { ...standard, ...custom };

};

const updateGlideTrackHeight = ( element = false ) => {
  if ( element ) {
    let active_slide = element.querySelector( '.glide__slide--active' ) || false;
    let glide_track = element.querySelector( '.glide__track' ) || false;
    if ( active_slide && glide_track ) {
      let active_slide_height = active_slide.offsetHeight;
      let glide_track_height = glide_track.offsetHeight;
      if ( glide_track_height != active_slide_height ) glide_track.style.height = active_slide_height + 'px';
      AOS.refresh();
    }
  }
};

const updateProductGalleryModalTrigger = ( index = 0 ) => {
  ( document.querySelectorAll( '.main-product__image-gallery-modal-trigger' ) || [] ).forEach( button => {
     button.dataset.productImageGalleryIndex = index;
  });
};

const init = () => {
  if ( config.debug ) console.log(`[ ${config.name} v.${config.version} initialized ]`);
    elements.forEach( element => createGliderFromElement( element ) );
  if ( config.debug ) console.log(`[ ${config.name} v.${config.version} complete ]`);
};

export default { gliders, init };
