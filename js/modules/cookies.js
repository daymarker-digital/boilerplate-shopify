const config = { debug: true, name: 'cookies.js', version: '1.0' };

const set = ( name = '', value = '', expires = 1 ) => {

  const d = new Date();
  d.setTime(d.getTime() + (expires * 24 * 60 * 60 * 1000));
  expires = "expires="+d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";

};

const get = ( name = '' ) => {

  name = name + "=";
  let ca = document.cookie.split(';');

  for ( let i = 0; i < ca.length; i++ ) {
    let c = ca[i];
    while ( c.charAt(0) == ' ' ) {
      c = c.substring(1);
    }
    if ( c.indexOf(name) == 0 ) {
      return c.substring(name.length, c.length);
    }
  }

  return '';

}

export default { get, set };
