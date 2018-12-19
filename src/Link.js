import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

import styles from './Link.scss';

const Link = props => {
  return (
    <a className={styles.link} href={props.to} {...props}>
      {props.children}
    </a>
  );
};

export default Link;
