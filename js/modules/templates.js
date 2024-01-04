import Money from 'money';

const config = { debug: false, name: 'templates.js', version: '1.0' };

const cartLineItem = ( line_item = {} ) => {

  let {
    block_name = 'cart-line-item',
    featured_image,
    final_line_price, // price x quantity
    key,
    price,
    product_title,
    product_type,
    quantity,
    title,
    url,
    variant_id,
    variant_title
  } = line_item;

  let icon_trash = Theme.svg.icon?.trash ?? '';
  let image = {
    classes: 'lazyload lazyload-item lazyload-item--image lazypreload lazyload-item--inline inline',
    src: Theme.tools?.imgURLFilter ? Theme.tools.imgURLFilter( featured_image.url, 'small' ) : featured_image.url,
  };
  let price_formatted = Money.format( final_line_price );

  return `
    <div class="${block_name}" id="${block_name}--${key}" data-key="${key}">
      <div class="${block_name}__image">
        <a class="${block_name}__image-link link" href="${url}" title="${product_title}" target="_self">
          <img class="${image.classes}" src="${image.src}" alt="${featured_image.alt}" width="${featured_image.width}" height="${featured_image.height}" />
        </a>
      </div>
      <div class="${block_name}__content text--uppercase">
        <div class="${block_name}__info">
          <strong class="${block_name}__product-title">
            <a class="${block_name}__product-title-link link" href="${url}" title="${product_title}" target="_self">${product_title}</a>
          </strong>
          ${ variant_title ? `<span class="${block_name}__variant-title">${variant_title}</span>` : '' }
        </div>
        <div class="${block_name}__price">${price_formatted}</div>
        <div class="${block_name}__stepper">${stepper({ quantity })}</div>
        <div class="${block_name}__action">
          <button class="${block_name}__button-remove button button--remove-cart-line-item js--remove-cart-line-item" type="button">
            ${ icon_trash ?? 'Remove' }
          </button>
        </div>
      </div>
    </div>
  `;

};

const cartLineItemsCount = ( line_items_total = 0 ) => {
  ( document.querySelectorAll( '.js--cart-line-items-total' ) || [] ).forEach( element => {
    element.innerHTML = `${line_items_total}`;
  });
};

const cartNotificationError = ( data = {} ) => {

  let {
    block_name = 'cart-notification',
    description,
    triangle = Theme.icons?.triangle ?? '',
  } = data;

  return `
    ${ triangle ? `<div class="${block_name}__triangle">${triangle}</div>` : '' }
    <div class="${block_name}__main">
      <span class="${block_name}__notice">Oops!</span>
      <strong class="${block_name}__heading heading--primary">${description}</strong>
    </div>
  `;

}

const cartNotificationSuccess = ( data = {} ) => {

  let {
    block_name = 'cart-notification',
    featured_image,
    options_with_values = [],
    product_has_only_default_variant,
    product_title,
    product_type,
    triangle = Theme.icons?.triangle ?? '',
    url,
    variant_title
  } = data;

  let image = {
    classes: 'lazyload lazyload-item lazyload-item--image lazypreload',
    src: Theme.tools?.imgURLFilter ? Theme.tools.imgURLFilter( featured_image.url, 'medium' ) : featured_image.url,
  };

  let options = options_with_values.map((option) => {
    return `
      <div class="${block_name}__option">
        <span class="${block_name}__option-name">${option.name}</span>
        <span class="${block_name}__option-value">${option.value}</span>
      </div>
    `;
  }).join('');

  return `
    ${ triangle ? `<div class="${block_name}__triangle">${triangle}</div>` : '' }
    <div class="${block_name}__main">
      <span class="${block_name}__notice">1 Item Added to Cart!</span>
        <div class="${block_name}__image">
          <a class="${block_name}__image-link link" href="${url}" title="${product_title}" target="_self">
            <img class="${image.classes}" src="${image.src}" alt="${featured_image.alt}" width="${featured_image.width}" height="${featured_image.height}" />
          </a>
        </div>
      <strong class="${block_name}__heading heading--primary">${product_title}</strong>
      ${ !product_has_only_default_variant && options ? `<span class="${block_name}__options">${options}</span>` : '' }
      <div class="${block_name}__cta">
        <a class="${block_name}__cta-link link" href="/checkout" title="Checkout" target="_self" />Checkout</a>
      </div>
    </div>
  `;

}

const instagramFeedItems = ( feed = {} ) => {

  let {
    block_name = 'instagram-feed',
    item_count = 0,
    limit = 0,
    items = [],
  } = feed;

  function instagramFeedItem( item = {} ) {

    let {
      media_type = '',
      media_url = '',
      permalink = '',
      template = ''
    } = item;

    if ( ( "CAROUSEL_ALBUM" === media_type || "IMAGE" === media_type ) && ( item_count < limit ) ) {
      template = `
        <li class="glide__slide">
          <div class="${block_name}__item" data-count="${item_count}">
            <a class="${block_name}__item-link link" href="${permalink}" target="_blank" title="Intagram">
              <div class="${block_name}__item-image">
                <img class="lazyload lazyload-item lazyload-item--image lazypreload" src="${media_url}" title="Instagram Image" />
              </div>
            </a>
          </div>
        </li>
      `;
      item_count++;
    }

    return template;

  }

  return `${items.map( (item) => `${instagramFeedItem( item )}` ).join('')}`;

};

const stepper = ( data = {} ) => {

  let {
    block_name = 'stepper',
    quantity,
  } = data;

  let button = {
    decrease: Theme.svg.button.stepper?.decrease ?? '-',
    increase: Theme.svg.button.stepper?.increase ?? '+'
  };

  return `
    <div class="${block_name}">
      <button class="${block_name}__button button button--stepper button--svg decrease js--stepper-button" type="button">
        <span class="${block_name}__button-icon button__icon">${button.decrease}</span>
      </button>
      <input class="${block_name}__input input--secondary js--stepper-input" type="number" name="quantity" min="1" max="9999" value="${quantity}" readonly>
      <button class="${block_name}__button button button--stepper button--svg increase js--stepper-button" type="button">
        <span class="${block_name}__button-icon button__icon">${button.increase}</span>
      </button>
    </div>
  `;

};

export default { cartLineItem, cartNotificationError, cartNotificationSuccess };
