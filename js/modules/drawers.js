import Tools from 'tools';

const config = { debug: true, name: 'drawers.js', version: '1.0' };
const elements = document.querySelectorAll( 'body, footer, header, main' ) || [];
const drawers = {};

const openDrawerByID = ( id = '', delay = 0 ) => {
  setTimeout(() => {
    Tools.addClass( `${id}--active`, elements );
  }, delay);
};

const toggleDrawerByID = ( id = '', delay = 0 ) => {
  setTimeout(() => {
    Tools.toggleClass( `${id}--active`, elements );
  }, delay);
};

const closeDrawerByID = ( id = '', delay = 0 ) => {
  setTimeout(() => {
    Tools.removeClass( `${id}--active`, elements );
  }, delay);
}

const onClickOpenDrawer = () => {
  ( document.querySelectorAll( '.js--open-drawer' ) || [] ).forEach( button => {
    let drawerID = button.dataset.drawerId || '';
    button.addEventListener( 'click', event => {
      openDrawerByID( drawerID );
      drawers[drawerID] = true;
    });
  });
};

const onClickToggleDrawer = () => {
  ( document.querySelectorAll( '.js--toggle-drawer' ) || [] ).forEach( button => {
    let drawerID = button.dataset.drawerId || '';
    button.addEventListener( 'click', event => {
      toggleDrawerByID( drawerID );
      drawers[drawerID] = drawers?.[drawerID] ? false : true;
    });
  });
};

const onClickCloseAllDrawers = () => {
  document.body.addEventListener( 'click', event => {
    let drawer = event.target.closest( '.drawer' ) ? true : false;
    let buttonDrawerOpen = event.target.closest( '.js--open-drawer' ) ? true : false;
    let buttonDrawerClose = event.target.closest( '.js--close-drawer' ) ?  true : false;
    let buttonDrawerToggle = event.target.closest( '.js--toggle-drawer' ) ?  true : false;
    if ( ( !drawer && !buttonDrawerOpen && !buttonDrawerToggle ) || buttonDrawerClose ) {
      for (const id in drawers) {
        if ( drawers[id] ) {
          closeDrawerByID( id );
          drawers[id] = false;
        }
      }
    }
  });
};

const init = () => {
  if ( config.debug ) console.log(`[ ${config.name} v.${config.version} initialized ]`);
  onClickToggleDrawer();
  onClickCloseAllDrawers();
  if ( config.debug ) console.log(`[ ${config.name} v.${config.version} complete ]`);
}

export default { closeDrawerByID, init, openDrawerByID };
