const info = { company : 'Very Polite Agency', tagline : '"Always Be Polite™"',  version : '2.0' };

const init = () => {
  console.log( `${info.company} - ${info.tagline} - Version ${info.version}` );
  console.log( 'Site by Very Polite Agency – https://weareverypolite.com/' );
};

export default { init }
