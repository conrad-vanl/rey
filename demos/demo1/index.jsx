import React from 'react';
import ReactDOM from 'react-dom';
import Demo from './demo';
import range from 'lodash.range';

let heads = range(10);
heads = heads.map((i) => 'https://source.unsplash.com/random/50x' + (50 + i));

ReactDOM.render(<Demo heads={heads} />, document.querySelector('#content'));
