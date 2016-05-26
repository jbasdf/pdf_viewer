"use strict";

import React                    from 'react';
import assets                   from '../libs/assets';
import PdfViewer                from './pdf';


class Home extends React.Component {

  render(){
    var pdf = assets("./pdfs/wiley-lo.pdf");
    return<div>
      <PdfViewer pdf={pdf} />
      <a href="http://www.opencontent.org/docs/wiley-lo-review-final.pdf">Example pdf</a> by David Wiley from <a href="http://www.opencontent.org">opencontent.org</a>
    </div>;
  }

}

export { Home as default };