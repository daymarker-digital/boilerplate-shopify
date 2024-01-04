import Tools from 'tools';
import Cookies from 'cookies';

const cookieName = 'vp_shopify_announcements';

const hideAnnouncements = () => {
  ( document.querySelectorAll( '.header__announcements' ) || [] ).forEach( element => {
    element.classList.remove( 'show' );
    Tools.setHeaderHeightCSSVariable();
    Cookies.set( cookieName, 'hide', 1 );
  });
};

const showAnnouncements = () => {
  ( document.querySelectorAll( '.header__announcements' ) || [] ).forEach( element => {
    element.classList.add( 'show' );
    Tools.setHeaderHeightCSSVariable();
  });
};

const onClickHideAnnouncements = () => {
  ( document.querySelectorAll( '.js-hide-announcements') || [] ).forEach( button => {
    button.addEventListener( 'click', () => {
      hideAnnouncements();
    });
  });
};

const init = () => {
  if ( !Cookies.get( cookieName ) ) {
    showAnnouncements();
  }
  onClickHideAnnouncements();
};

export default { init };
