import React from 'react';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  const options = {
    // logOnDifferentValues: true
  };

  whyDidYouRender(React, options);
}

// NOTE: You must add static `whyDidYouRender = true` to the component you want to track.
