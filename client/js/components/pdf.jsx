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
    this.updatePdf(this.props);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.pdf != this.props.pdf){
      this.updatePdf(nextProps);
    }
  }

  componentDidMount(){
    this.renderPdfPages();
    window.addEventListener('resize', _.debounce(this.renderPdfPages.bind(this), 150));
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.pdf != this.state.pdf){
      this.renderPdfPages();
    }
  }

  updatePdf(props){
    PDFJS.getDocument(props.pdf).then((pdf) => {
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
      var scale = 1; // Changes the size of the pdf in the html page
      var viewport = page.getViewport(scale);

      var canvas = this.refs[`canvas${pageNum}`];
      var context = canvas.getContext('2d');

      // Compensate for hi-def monitors by adjusting the backingStore. We get the devicePixelRatio
      // and adjust the actual Canvas by that amount while leaving the css styling the original value.
      var devicePixelRatio = window.devicePixelRatio || 1;
      var width = canvas.clientWidth;
      var height = Math.round(width * viewport.height / viewport.width);
      canvas.style.height = `${height}px`;

      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;

      var ratio = width * devicePixelRatio / viewport.width;
      context.scale(ratio, ratio);

      var renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      page.render(renderContext);

    });
  }

  render(){
    const styles = { width: "100%" };
    const canvases = _.times(this.state.numPages).map((pageNum) => {
      const key = `canvas${pageNum}`;
      return <canvas key={key} style={ styles } ref={key}></canvas>;
    });
    return<div style={ styles }>
      {canvases}
    </div>;
  }

}

export { Home as default };