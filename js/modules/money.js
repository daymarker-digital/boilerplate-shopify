const format = ( price = 0, options = {} ) => {
  return `$${(price/100).toFixed(2)} ${Theme?.currency || 'CAD'}`;
};

export default { format };
