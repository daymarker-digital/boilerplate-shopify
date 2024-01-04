import Cookies from 'cookies';

//////////////////////////////////////////////////////////
////  Vars
//////////////////////////////////////////////////////////

const config = { debug: true, name: 'cookiePopup.js', version: '1.0' };
const element = {
  button: document.querySelector('#shopify-section-cookie-popup .cookie-popup__button-accept') || false,
  main: document.querySelector('#shopify-section-cookie-popup .cookie-popup__main') || false,
  section: document.getElementById('shopify-section-cookie-popup') || false
};
const cookie = {
	name: 'viavino--accept-cookies',
	value: 'yes',
  delay: function() {
    if ( element.main ) {
      return parseInt(element.main.dataset.delay || 3000);
    }
    return 3000;
  },
  duration: function() {
    if ( element.main ) {
      return parseInt(element.main.dataset.cookieDuration || 30);
    }
    return 35;
  },
  expired: function() {
    return Cookies.get( this.name ) ? false : true;
  }
};

//////////////////////////////////////////////////////////
////  Private Methods
//////////////////////////////////////////////////////////

const show = ( element = false, delay = 0 ) => {
  if ( element ) {
    setTimeout(() => {
      element.classList.add( 'active' );
    }, delay );
  }
};

//////////////////////////////////////////////////////////
////  Public Methods
//////////////////////////////////////////////////////////

const init = () => {
  if ( config.debug ) console.log(`[ ${config.name} v.${config.version} initialized ]`);

  console.log( cookie.expired(), element.main )

  if ( cookie.expired() && element.main ) {
    show( element.section, cookie.delay );

    if ( element.button ) {
      element.button.addEventListener( 'click', event => {
        Cookies.set( cookie.name, cookie.value, cookie.duration() );
        element.section.classList.remove( 'active' );
      });
    }

  }
  if ( config.debug ) console.log(`[ ${config.name} v.${config.version} complete ]`);
};

export default { init };
