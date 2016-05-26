"use strict";

import React                    from 'react';
import assets                   from '../libs/assets';
import PDFJS                    from 'pdfjs-dist';
import _                        from 'lodash';

class Home extends React.Component {

  constructor(){
    super();
    this.state = {
      numPages: 0
    };
  }

  componentWillMount(){
    this.updatePdf();
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.pdf != this.props.pdf){
      this.updatePdf();
    }
  }

  componentDidMount(){
    this.renderPdfPages();
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.pdf != this.state.pdf){
      this.renderPdfPages();
    }
  }

  updatePdf(){
    PDFJS.getDocument(this.props.pdf).then((pdf) => {
      this.setState({
        pdf,
        numPages: pdf.numPages
      });
    });
  }

  renderPdfPages(){
    _.times(this.state.numPages, this.renderPdfPage.bind(this));
  }

  renderPdfPage(pageNum){
    this.state.pdf.getPage(pageNum + 1).then((page) => {
      var scale = 1;
      var viewport = page.getViewport(scale);

      var canvas = this.refs[`canvas${pageNum}`];
      var context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      var renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      page.render(renderContext);
    });
  }

  render(){
    const canvases = _.times(this.state.numPages).map((pageNum) => {
      const key = `canvas${pageNum}`;
      return <canvas key={key} ref={key}></canvas>;
    });
    return<div>
      {canvases}
    </div>;
  }

}

export { Home as default };