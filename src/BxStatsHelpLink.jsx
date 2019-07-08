import React from 'react';
import Link from '@material-ui/core/Link';
import {testnetDefaultChannel} from '@bitconch/bitconch-web3j/package.json';

const BOOK_VERSION = (testnetDefaultChannel === 'edge') ? 'book-edge' : 'book';

class BxStatsHelpLink extends React.Component {
  render() {
    const {text, term} = this.props;
    return (
      <Link
        href={`https://bitconch.io/${BOOK_VERSION}/terminology.html#${term}`}
        target="_new"
      >
        <i className={'fa fa-question'} title={text} />
      </Link>
    );
  }
}

export default BxStatsHelpLink;
