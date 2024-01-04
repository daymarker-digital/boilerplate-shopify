const addClass = ( $class = '', $elements = [] ) => {
  if ( $class && $elements.length ) {
    for( let i = 0; i < $elements.length; i++ ) {
      if ( $elements[i] ) {
        $elements[i].classList.add( $class );
      }
    }
  }
};

const addClassesToElements = ( classes = [], elements = [] ) => {
  if ( classes.length && elements.length ) {
    elements.forEach( element => {
      element.classList.add( ...classes );
    });
  }
};

const debounce = (func, delay) => {
  let inDebounce;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};

const filterObjectFromArrayByID = ( id = 0, arr = [] ) => {
  for ( let i = 0; i < arr.length; i++ ) {
    if ( arr[i].id === id ) {
      return arr[i];
    }
  }
  return false;
}

const getArrayOfElementsByTag = ( $elements = [ 'body', 'footer', 'header', 'main' ] ) => {
  let filteredElements = $elements.filter( tag => { return document.getElementsByTagName( tag )[0] } ) || [];
  return filteredElements.map( tag => document.getElementsByTagName( tag )[0] ) || [];
};

const getElementHeightByTag = ( $tag = '' ) => {
  return document.getElementsByTagName( $tag )[0].offsetHeight || 0;
};

const getLocalStorageValueByKey = ( $key ) => {
  return localStorage.getItem( $key );
};

const getTimeStamp = () => {
  let d = new Date();
  return d.getTime();
};

const isMobileDevice = () => {
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return true;
  }
  return false;
};

const removeClass = ( $class = '', $elements = [] ) => {
  if ( $class && $elements.length ) {
    for( let i = 0; i < $elements.length; i++ ) {
      if ( $elements[i] ) {
        $elements[i].classList.remove( $class );
      }
    }
  }
};

const removeClassesFromElements = ( classes = [], elements = [] ) => {
  if ( classes.length && elements.length ) {
    elements.forEach( element => {
      element.classList.remove( ...classes );
    });
  }
};

const setCSSVariable = ( id = '', value = '' ) => {
  if ( id && value ) document.documentElement.style.setProperty( `--${id}`, value );
};

const setElementsHeightToCSSVariable = () => {

  let elements = [
    { var_id: 'theme-header-height--total', element_id: 'shopify-section-header' },
    { var_id: 'theme-announcement-height--total', element_id: 'shopify-section-announcements' }
  ];

  elements.forEach( item => {
    let { var_id, element_id } = item;
    let value = document.getElementById( element_id ) ? document.getElementById( element_id ).offsetHeight : 0;
    document.documentElement.style.setProperty( `--${var_id}`, `${value}px` );
  });

};

const setLocalStorage = ( $key, $value ) => {
  localStorage.setItem( $key, $value );
}

const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function() {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

const toggleClass = ( $class = '', $elements = [] ) => {
  if ( $class && $elements.length ) {
    for( let i = 0; i < $elements.length; i++ ) {
      if ( $elements[i] ) {
        $elements[i].classList.toggle( $class );
      }
    }
  }
};

export default {
  addClass,
  addClassesToElements,
  debounce,
  filterObjectFromArrayByID,
  getArrayOfElementsByTag,
  getElementHeightByTag,
  getLocalStorageValueByKey,
  getTimeStamp,
  removeClass,
  removeClassesFromElements,
  setCSSVariable,
  setElementsHeightToCSSVariable,
  setLocalStorage,
  throttle,
  toggleClass
};
