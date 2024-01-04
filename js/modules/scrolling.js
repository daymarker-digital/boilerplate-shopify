import Tools from 'tools';

const config = { debug: false, name: 'scrolling.js', version: '1.0' };
const elements = document.querySelectorAll( 'body, footer, header, main' ) || [];
const classes = {
  atTop: 'scroll-position--at-top',
  scrolled: 'scroll-position--scrolled',
  scrollingDown: 'scroll-position--scrolling-down',
  scrollingUp: 'scroll-position--scrolling-up'
};
const scrollPosition = {
  initial: window.pageYOffset || document.documentElement.scrollTop,
  current: window.pageYOffset || document.documentElement.scrollTop,
  initial: window.pageYOffset || document.documentElement.scrollTop,
  previous: window.pageYOffset || document.documentElement.scrollTop,
  down: false
};

const currentScrollPosition = () => {
  return window.pageYOffset || document.documentElement.scrollTop;
};

const setClassesByScrollPosition = () => {

  scrollPosition.previous = scrollPosition.current;
  scrollPosition.current = currentScrollPosition();
  scrollPosition.down = scrollPosition.current > scrollPosition.previous ? true : false;

  // set scrolling action state
  if ( scrollPosition.current > 30 ) {
    Tools.addClassesToElements( [ classes.scrolled ], elements );
  } else {
    Tools.removeClassesFromElements( [ classes.scrolled ], elements );
  }

  // set scroll top position state
  if ( scrollPosition.current === 0 ) {
    Tools.addClassesToElements( [ classes.atTop ], elements );
  } else {
    Tools.removeClassesFromElements( [ classes.atTop ], elements );
  }

  // set scroll direction down state
  if ( scrollPosition.down ) {
    Tools.addClassesToElements( [ classes.scrollingDown ], elements );
    Tools.removeClassesFromElements( [ classes.scrollingUp ], elements );
  } else {
    Tools.addClassesToElements( [ classes.scrollingUp ], elements );
    Tools.removeClassesFromElements( [ classes.scrollingDown ], elements );
  }

};

const init = () => {
  if ( config.debug ) console.log(`[ ${config.name} v.${config.version} initialized ]`);
    setClassesByScrollPosition();
  if ( config.debug ) console.log(`[ ${config.name} v.${config.version} complete ]`);
};

export default { init };
