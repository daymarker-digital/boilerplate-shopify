import Credits from './modules/credits';
import Cart from './modules/cart';
import Drawers from './modules/drawers';
import Forms from './modules/forms';
import Gliders from './modules/gliders';
import Scrolling from './modules/scrolling';
import Tools from './modules/tools';

// ---------------------------------------- Modules
Cart.init();
Credits.init();
Drawers.init();
Forms.init();
Scrolling.init();

// ---------------------------------------- Animate on Scroll
AOS.init({
  offset: 150,                // offset (in px) from the original trigger point
  delay: 0,                   // values from 0 to 3000, with step 50ms
  duration: 500,              // values from 0 to 3000, with step 50ms
  easing: 'ease-in-out',      // default easing for AOS animations
});

// ---------------------------------------- On Load
window.addEventListener( 'load', function (e) {
  AOS.refresh();
  Gliders.init();
  Scrolling.init();
});

// ---------------------------------------- On Resize
window.addEventListener( 'resize', Tools.debounce(() => {}, 300));

window.addEventListener( 'resize', Tools.throttle(() => {
  Scrolling.init();
}, 300));

// ---------------------------------------- On Scroll
window.addEventListener( 'scroll', Tools.debounce(() => {}, 300));

window.addEventListener( 'scroll', Tools.throttle(() => {
  Scrolling.init();
}, 300));
