import Render from 'render';

const config = { debug: false, name: 'instagramFeed.js', version: '1.0' };

const MAX_MINUTES = 300;
const elements = document.querySelectorAll( '.js--instagram-feed' ) || [];

const asyncGetMedia = async ( token = '' ) => {
  return await fetch( `https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink&access_token=${token}`, { method: 'GET' } )
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.log(error);
    });
};

const asyncGetToken = async ( account = '' ) => {
  return await fetch( `https://very-polite-instagram-feed.herokuapp.com/token?userAccount=${account}`, { method: 'GET' } )
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.log(error);
    });
};

const isLocalStorageExpired = ( localStorageDate = 0 ) => {

  let todaysDate = Date.now();
  let timeDifferenceMilliseconds = todaysDate - localStorageDate;
  let timeDifferenceMinutes = ( timeDifferenceMilliseconds / 60000 ).toFixed(2);

  if ( config.debug ) console.log(`[ ${config.name}.isLocalStorageExpired() ] Time Difference ::`, timeDifferenceMinutes);

  if ( timeDifferenceMinutes > MAX_MINUTES ) {
    return true;
  }

  return false;

}

const init = () => {
  if ( config.debug ) console.log(`[ ${config.name} v.${config.version} initialized ]`);
    elements.forEach( element => {

      let feed = {
        account: element.dataset?.instagramFeedAccount || "instagram-feed-account-not-set",
        localStorage: {
          name: "very-polite-instagram-feed",
          data: "",
        },
      };

      feed.localStorage.name += `--${feed.account}`;
      feed.localStorage.data = JSON.parse( localStorage.getItem( feed.localStorage.name ) || false );
      feed.localStorage.expired = isLocalStorageExpired( feed.localStorage.data.date );

      if ( feed.localStorage.expired ) {
        asyncGetToken( feed.account ).then( data => {
          asyncGetMedia( data.token ).then( result => {

            let fetchedFeedData = {
              account: feed.account,
              date: Date.now(),
              items: result.data || [],
            };

            localStorage.setItem( feed.localStorage.name, JSON.stringify(fetchedFeedData) );
            Render.instagramFeed( feed.account, fetchedFeedData.items );

          });
        });
      } else {
        Render.instagramFeed( feed.account, feed.localStorage.data.items );
      }

    });
  if ( config.debug ) console.log(`[ ${config.name} v.${config.version} complete ]`);
};

export default { init };
