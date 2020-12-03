export const extractStyles = node => {
  if (!node || !node.props || !node.props.style) {
    return {};
  }
  const {style} = node.props;
  return style.length ? style.reduce((acc, curValue) => ({...acc, ...curValue}), {}) : style;
};

export const getDaysArray = (start, end) => {
  const days = [];
  for (let i = start; i <= end; i++) {
    days.push(i.toString());
  }
  return days;
};

export const partial = obj => expect.objectContaining(obj);
