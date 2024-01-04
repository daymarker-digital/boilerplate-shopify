const addToCartButton = document.querySelector( 'form[action="/cart/add"] button[type="submit"]' ) || false;
const options = document.querySelectorAll( 'form[action="/cart/add"] input[type="radio"]' ) || [];

const variantSelector = () => {
  options.forEach( input => {
    input.addEventListener( 'input', event => {
      if ( !input.disabled ) {
        console.log('not disabled');
        addToCartButton.disabled = false;
      } else {
        console.log('disabled');
      }
    });
  });
}

const isSelected = () => {
  for (let i = 0; i < options.length; i++) {
    console.log(options[i]);
    if ( options[i].checked ) {
      console.log('checked!');
    }
  }
}

const init = () => {
  isSelected();
  variantSelector();
};

export default { init };
