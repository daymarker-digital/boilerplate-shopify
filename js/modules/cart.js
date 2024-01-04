import Render from 'render';
import Tools from 'tools';

const config = { debug: true, name: 'cart.js', version: '1.0' };

const elements = {
  cart: document.querySelectorAll('form.js--cart') || [],
  cart_footer_note: document.querySelectorAll('.cart-footer__note') || []
};

const addToCart = ( id = 0, quantity = 1 ) => {

  if ( id ) {
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: [{ id, quantity }]
      })
    })
    .then( response => {
      return response.json();
    })
    .then( data => {

      if ( 422 == data.status ) {
        Render.cartNotification( 'error', data );
      } else {
        Render.cartNotification( 'success', data.items?.[0] );
        getCart().then( cart => {
          toggleCheckoutButtonUsability( 'enable' );
          toggleCartNoteUsability( 'enable' );
          Render.cartLineItemsCount( cart.item_count );
          //Render.cartLineItemsToElement( cart.items, elements.cart );
          Render.cartSubtotal( cart.items_subtotal_price );
        });
      }

    })
    .catch( error => {
      console.log('[ addToCart() ] :: Error', error );
    });
  }

};

const emptyCart = () => {
  fetch('/cart/clear.js', {
    method: 'POST',
  })
  .then(response => {
    return response.json();
  })
  .then((data) => {})
  .catch((error) => {
    console.error('[ emptyCart() ] :: Error', error);
  });
};

const getCart = async () => {
  return await fetch( '/cart.js', { method: 'GET', })
  .then(response => {
    return response.json();
  });
};

const onClickAddProductToCart = () => {
  ( document.querySelectorAll( '.js--add-to-cart, .js--add-to-cart-from-collection' ) || [] ).forEach( button => {
    button.addEventListener( 'click', event => {

      event.preventDefault();

      let quantity = 1;
      let variantID = 0;

      switch ( button.type ) {
        case 'button': {
          // from PLP button
          variantID = parseInt( button.dataset?.productVariantId || 0 );
          break;
        }
        case 'submit': {
          // from PDP form
          let form = button.closest('form') || false;
          let inputQuantity = form.querySelector("input[name='quantity']");
          let inputOptions = form.querySelectorAll("input[name='id']");
          let inputOptionChecked = Array.from( inputOptions ).find( radio => radio.checked );
          quantity = parseInt( inputQuantity.value || 0 );
          variantID = parseInt( inputOptionChecked.value || 0 );
          break;
        }
      }

      addToCart( variantID, quantity );

    });
  });
};

const onClickRemoveCartLineItem = () => {
  document.addEventListener( 'click', event => {
    if ( event.target.closest( '.js--remove-cart-line-item' ) ) {

      let button = event.target.closest( '.js--remove-cart-line-item' );
      let cart_line_item = button.closest( '.cart-line-item' ) ?? false;
      let cart_line_item_key = cart_line_item.dataset.key || '';

      changeCartLineItemByKey( cart_line_item_key, 0 );

    }
  });
};

const onClickUpdateStepper = () => {

  function changeCartLineItem( event ) {
    if ( event.target.closest( '.js--stepper-button' ) ) {
      let key = event.target?.closest( '.cart-line-item' )?.dataset?.key ?? '';
      let value = event.target?.closest( '.stepper' )?.querySelector('input[type="number"]')?.value ?? '';
      changeCartLineItemByKey( key, value );
    }
  }

  document.addEventListener( 'click', (event) => {
    if ( event.target.closest( '.js--stepper-button' ) ) {
      let button = event.target.closest( '.js--stepper-button' );
      let stepper = button.closest('.stepper') || false;
      let stepper_input = stepper.querySelector('input[type="number"]') || false;
      if ( button && stepper_input ) {

        let min = parseInt(stepper_input.min);
        let max = parseInt(stepper_input.max);
        let quantity = parseInt(stepper_input.value);

        if ( button.classList.contains('increase') ) {
          if ( quantity < max ) {
            quantity = ++quantity;
          }
        } else {
          if ( quantity > min ) {
            quantity = --quantity;
          }
        }

        updateStepperButtonStates( quantity, min, max, stepper );
        updateStepperValue( quantity, stepper);

      }
    }
  });

  document.addEventListener( 'click', Tools.debounce(changeCartLineItem, 500) );

}

const toggleCheckoutButtonUsability = ( state = 'enable' ) => {
  ( document.querySelectorAll( 'button[name="checkout"]' ) || [] ).forEach( button => {
    switch ( state ) {
      case 'enable': {
        button.disabled = false;
        break;
      }
      case 'disable': {
        button.disabled = true;
        break;
      }
    }
  });
};

const toggleCartNoteUsability = ( state = 'enable' ) => {
  elements.cart_footer_note.forEach( element => {
    switch ( state ) {
      case 'enable': {
        element.classList.remove('d-none');
        break;
      }
      case 'disable': {
        element.classList.add('d-none');
        break;
      }
    }
  });
};

const changeCartLineItemByKey = ( key = '', quantity = 0, stepper = false ) => {

  console.log( 'changeCartLineItemByKey :: ', key, quantity );

  if ( key ) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity: quantity })
    })
    .then( response => {
      return response.json();
    })
    .then( cart => {

      if ( 0 == quantity ) Render.cartLineItemRemoveByKey( key );

      if ( cart.status == 422 ) {
        Render.cartLineItemErrorMessage( key, cart.message );
        getCart().then( cart => {
          updateCartLineQuantityByKey( key, cart.items );
        });
      } else {

        if ( cart.item_count > 0 ) {
          toggleCheckoutButtonUsability( 'enable' );
          toggleCartNoteUsability( 'enable' );
          Render.cartLineItemPrice( key, cart.items );
        } else {
          toggleCheckoutButtonUsability( 'disable' );
          toggleCartNoteUsability( 'disable' );
          Render.cartEmptyMessage();
        }

        Render.cartLineItemsCount( cart.item_count );
        Render.cartSubtotal( cart.items_subtotal_price );

      }

    })
    .catch( error => {
      console.log('[ changeCartLineItemByKey() ] :: Error', error );
    });
  };
};

const updateCartLineQuantityByKey = ( key = '', cart_items = [] ) => {
  for ( let i = 0; i < cart_items.length; i++ ) {
    if ( key === cart_items[i].key ) {
      document.querySelector(`[data-key="${key}"] input[name="quantity"]`).value = cart_items[i].quantity;
      break;
    }
  }
}

const updateStepperValue = ( value = 0, stepper = false ) => {
  if ( stepper.querySelector('input[name="quantity"]') ) {
    stepper.querySelector('input[name="quantity"]').value = value;
  }
};

const updateStepperButtonStates = ( value = 0, min = 0, max = 99999, stepper = false ) => {
  if ( stepper ) {
    let btnDecrease = stepper.querySelector('.stepper__button.decrease') || false;
    let btnIncrease = stepper.querySelector('.stepper__button.increase') || false;
    if ( value == min ) {
      btnDecrease.disabled = true;
      btnIncrease.disabled = false;
    } else if ( value > min && value < max ) {
      btnDecrease.disabled = false;
      btnIncrease.disabled = false;
    } else {
      btnDecrease.disabled = false;
      btnIncrease.disabled = true;
    }
  }
};

const init = () => {
  if ( config.debug ) console.log(`[ ${config.name} v.${config.version} initialized ]`);

  getCart().then( cart => {
    console.log( cart.items );
  });

  if ( Theme.cart.items.length ) {
    //Render.cartLineItemsToElement( Theme.cart.items, elements.cart );
    toggleCheckoutButtonUsability( 'enable' );
    toggleCartNoteUsability( 'enable' );
  } else {
    Render.cartEmptyMessage();
    toggleCheckoutButtonUsability( 'disable' );
    toggleCartNoteUsability( 'disable' );
  }

  Render.cartLineItemsCount( Theme.cart.item_count );
  Render.cartSubtotal( Theme.cart.items_subtotal_price );

  onClickAddProductToCart();
  onClickRemoveCartLineItem();
  onClickUpdateStepper();

  if ( config.debug ) console.log(`[ ${config.name} v.${config.version} complete ]`);
};

export default {
  addToCart,
  emptyCart,
  getCart,
  init
};
