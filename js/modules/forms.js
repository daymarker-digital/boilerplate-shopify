const config = { debug: true, name: 'forms.js', version: '1.0' };
const forms = document.querySelectorAll( 'form.js--validate-me' ) || [];
const formFiles = [];
const maxMB = 25.0;
const reCaptcha = {
  enable: false,
  v3: {
    keys: {
      site: '6LfuWuIgAAAAAKSZZvc9s-sr2MdS9zWjpxGq_5B8',
      secret: '6LfuWuIgAAAAAP1Eo5-h_rqVYDMtT3_8Ptmz0MbU'
    }
  }
};
const regEx = {
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
};

// ---------------------------------------- Is Field Valid?
const isFieldValid = ( field = false ) => {

  if ( config.debug ) console.log( '[ isFieldValid() initialized ]', field );

  let valid = false;
  let nodeType = field.nodeName || '';

  switch ( nodeType ) {
    case 'INPUT': {
      valid = isInputValid(field) ;
      break;
    }
    case 'SELECT': {
      alert( 'forms.js :: select element form validation not configured!' );
      break;
    }
    case 'TEXTAREA': {
      valid = isTextareaValid(field) ;
      break;
    }
  }

  if ( config.debug ) console.log( '[ isFieldValid() complete ]', valid );

  return valid;

};

// ---------------------------------------- Is Form Valid?
const isFormValid = ( form = false ) => {

  let requiredFields = form.querySelectorAll('.required') || [];
  let requiredFieldsCount = requiredFields.length;
  let validFieldsCount = 0;

  requiredFields.forEach( field => {
    if ( config.debug ) console.log( '[ isFormValid() ]', field );
    if ( isFieldValid( field ) ) {
      validFieldsCount++;
    }
  });

  if ( requiredFieldsCount == validFieldsCount ) {
    return true;
  }

  return false;

};

// ---------------------------------------- Is Input Valid?
const isInputValid = ( input = {} ) => {

  let type = input.type || '';
  let value = input.value || '';
  let valid = false;

  switch ( type ) {
    case 'email': {
      valid = testEmail(value);
      break;
    }
    case 'tel': {
      valid = testTel(value);
      break;
    }
    case 'text': {
      valid = testText(value);
      break;
    }
  }

  updateFieldState( input, valid );

  if ( config.debug ) console.log( '[ isInputValid() complete ]', { type, value } );

  return valid;

};

// ---------------------------------------- Is Textarea Valid?
const isTextareaValid = ( textarea = {} ) => {

  let value = textarea.value || '';
  let valid = testText(value);

  updateFieldState( textarea, valid );

  if ( config.debug ) console.log( '[ isTextareaValid() complete ]', { value, valid } );

  return valid;

};

// ---------------------------------------- On Field Focus
const onFormFocus = ( form = false ) => {

  if ( form ) {

    form.addEventListener( 'focusin', (e) => {
      let field = e.target.closest('.form-field') || false;
      if ( field ) field.classList.add('in-focus');
    });

    form.addEventListener( 'focusout', (e) => {
      let field = e.target.closest('.form-field') || false;
      if ( field && !e.target.value ) {
        isFieldValid( field );
        field.classList.remove('in-focus');
      }
    });

  }

};

// ---------------------------------------- reCaptchaV3
const reCaptchaV3 = ( action = 'submit', form = false ) => {
  if ( form ) {
    let data = new FormData( form );
    grecaptcha.ready(function() {
      grecaptcha.execute( reCaptcha.v3.keys.site, { action: action } ).then(function(token) {
        data.append( 'g-recaptcha-response' , token );
        submitForm( form );
      });
    });
  }
};

// ---------------------------------------- Submit Form
const submitForm = ( form = false ) => {

  if ( form ) {

    let redirectUrl = form.dataset.redirectUrl || '/';
    let type = form.dataset.formType || 'default';
    let action = form.action || '';
    let data = new FormData( form );
    let dataObject = Object.fromEntries( data.entries() );
	  let dataJSONString = JSON.stringify( dataObject );

    document.body.classList.add('form-posting');
    form.classList.add('form-posting');

    axios.post( action, data )
    .then( data => {
      if ( 200 === data.status ) {
        switch ( type ) {
          case 'contact-us': {
            window.location.replace( redirectUrl );
            break;
          }
        }
      }
    })
    .catch( data => {
      console.log('[ submitForm() Error ]', data );
    }).finally( data => {
      form.reset();
      document.body.classList.remove('form-posting');
      form.classList.remove('form-posting');
    });

  }
};

// ---------------------------------------- Test Email Against RegEx
const testEmail = ( value = '' ) => {
  return value && regEx.email.test(value) ? true : false;
};

// ---------------------------------------- Test Telephone Against RegEx
const testTel = ( value = '' ) => {
  return value && regEx.phone.test(value) ? true : false;
};

// ---------------------------------------- Test Text Against RegEx
const testText = ( value = '' ) => {
  return value.trim() ? true : false;
};

// ---------------------------------------- Update Field State
const updateFieldState = ( input = {}, valid = false ) => {

  let field = input.closest('.form-field') || false;

  if ( field ) {
    if ( valid ) {
      field.classList.remove('error');
    } else {
      field.classList.add('error');
    }
  }

  if ( config.debug ) console.log( '[ updateFieldState() ]', { field, valid } );

};

// ---------------------------------------- Initialize
const init = () => {

  if ( config.debug ) console.log(`[ ${config.name} v.${config.version} initialized ]`);

    forms.forEach( form => onFormFocus( form ) );

    ( document.querySelectorAll('form.js--validate-me [type="submit"]') || [] ).forEach( button => {
      button.addEventListener('click', event => {

        event.preventDefault();

        let form = button.closest( 'form' );

        if ( isFormValid( form ) ) {
          if ( reCaptcha.enable ) {
            reCaptchaV3( 'submit', form );
          } else {
            submitForm( form );
          }
        }

      });
    });

  if ( config.debug ) console.log(`[ ${config.name} v.${config.version} complete ]`);

};

export default { init };
