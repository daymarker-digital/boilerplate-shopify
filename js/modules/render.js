import Money from 'money';
import Templates from 'templates';
import Tools from 'tools';

const config = { debug: false, name: 'render.js', version: '1.0' };
const elements = {
  cart: document.querySelectorAll('.js--cart') || [],
};

const cartEmptyMessage = () => {
  let message = Theme.settings?.cart_empty_message ?? '<p>Oops! Nothing added to your cart yet :(</p>';
  elements.cart.forEach( element => {
    element.innerHTML = `
      <div class="cart-empty-message body-copy--primary body-copy--1">${message}</div>
    `;
  });
};

const cartLineItemErrorMessage = ( key = '', message = 'Something went wrong!' ) => {

  let element = document.createElement("div");
  let parent = document.querySelector(`.cart-line-item[data-key="${key}"]`) || false;

  if ( parent ) {
    element.classList.add( 'cart-line-item__error-message' );
    element.innerHTML = `<strong class="heading--primary heading--3">${message}</strong>`;
    parent.appendChild(element);
    anime.timeline({
      targets: element,
      complete: function(anim) {
        element.remove();
      }
    }).add({
      delay: 0,
      duration: 750,
      opacity: 1,
      translateX: [200, 0]
    }).add({
      delay: 3200,
      duration: 550,
      opacity: 0,
      translateX: [0, 200]
    }).play
  }

};

const cartLineItemRemoveByKey = ( key = '' ) => {
  console.log( 'cartLineItemRemoveByKey :: ', key );
  let element = document.getElementById(`cart-line-item--${key}`) || false;
  if ( element ) {
    anime.timeline({
      targets: element,
      easing: 'easeOutElastic(1, .8)',
      complete: function(anim) {
        element.remove();
      }
    }).add({
      delay: 500,
      duration: 700,
      endDelay: 700,
      translateX: 250,
      opacity: 0,
    }).play
  }
}

const cartLineItemPrice = ( key = '', line_items = [] ) => {
  if ( line_items.length ) {
    for ( let i = 0; i < line_items.length; i++ ) {
      if ( key === line_items[i].key ) {
        ( document.querySelectorAll( `[data-key="${key}"] .cart-line-item__price` ) || [] ).forEach( element => {
          element.innerHTML = Money.format( line_items[i].final_line_price );
        });
      }
    }
  }
};

const cartLineItemsQuantity = ( key = '', quantity = 1, line_items = [] ) => {
  if ( line_items.length ) {
    for ( let i = 0; i < line_items.length; i++ ) {
      if ( key === line_items[i].key ) {
        if ( quantity > line_items[i].quantity ) {
          // show message stating no inventory
          ( document.querySelectorAll( `[data-key="${key}"] input[name="quantity"]` ) || [] ).forEach( element => {
            element.value = line_items[i].quantity;
          });
        }
        break;
      }
    }
  }
};

const cartLineItemsToElement = ( line_items = [], elements = [] ) => {
  elements.forEach( element => {
    let template = '';
    for ( let i = 0; i < line_items.length; i++ ) {
      template += Templates.cartLineItem( line_items[i] );
    }
    element.innerHTML = template;
  });
};

const cartLineItemsCount = ( line_items_total = 0 ) => {
  ( document.querySelectorAll( '.js--cart-line-items-total' ) || [] ).forEach( element => {
    element.innerHTML = `${line_items_total}`;
  });
};

const cartNotification = ( status = 'success', data = {} ) => {

  let block_name = 'cart-notification';
  let element = document.createElement('div');
  let parent = document.querySelector('main[role="main"]') || false;
  let animation_delay = 'error' == status ? 4000 : 3000;

  switch( status ) {
    case 'error': {
      element.innerHTML = Templates.cartNotificationError( data );
      break;
    }
    default: {
      element.innerHTML = Templates.cartNotificationSuccess( data );
      break;
    }
  }

  element.classList.add( block_name, 'body-copy--primary' );
  parent.appendChild(element);
  anime.timeline({
    targets: element,
    complete: function(anim) {
      setTimeout(() => {
        element.remove();
      }, 250);
    }
  }).add({
    delay: 0,
    duration: 1000,
    opacity: 1,
    translateY: [ -20, 0 ]
   }).add({
    delay: animation_delay,
    duration: 550,
    opacity: 0,
    translateY: [ 0, -100 ]
  }).play

}

const cartSubtotal = ( subtotal = 0 ) => {
  ( document.querySelectorAll( '.js--cart-subtotal' ) || [] ).forEach( element => {
    element.innerHTML = Money.format( subtotal );
  });
};

const instagramFeed = ( account = "", items = [] ) => {
  if ( account && items.length ) {
    ( document.querySelectorAll( `[data-instagram-feed-account="${account}"]` ) || [] ).forEach( element => {

      let elementLimit = element.dataset?.instagramFeedLimit || 20;
      let elementItemCount = 0;

      for ( let i = 0; i < items.length; ++i ) {

        let {
          block_name = "instagram-feed",
          media_type,
          media_url = "",
          permalink = "",
        } = items[i];
        let allowedMediaType = [ "CAROUSEL_ALBUM", "IMAGE" ].includes(media_type);

        if ( allowedMediaType ) {

          ( element.querySelectorAll(`.${block_name}__item[data-index="${elementItemCount}"] .${block_name}__link`) || [] ).forEach( el => {
            el.href = permalink;
          });

          ( element.querySelectorAll(`.${block_name}__item[data-index="${elementItemCount}"] .${block_name}__image`) || [] ).forEach( el => {
            el.dataset.bg = media_url;
            el.classList.add("lazyload");
          });

          elementItemCount++;

        }

        if ( elementItemCount >= elementLimit ) {
          break;
        }

      }
    });
  }
};

export default {
  cartEmptyMessage,
  cartLineItemErrorMessage,
  cartLineItemRemoveByKey,
  cartLineItemPrice,
  cartLineItemsQuantity,
  cartLineItemsToElement,
  cartLineItemsCount,
  cartNotification,
  cartSubtotal,
  instagramFeed
};
