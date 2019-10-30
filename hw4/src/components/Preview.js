import React from 'react';
import showdown from 'showdown';
import ReactDOMServer from 'react-dom/server';

class Preview extends React.Component {
  converter;
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeFiletype = this.changeFiletype.bind(this);
    this.state = {
      fileName: '',
      fileType: 'md'
    };
    this.converter = new showdown.Converter();
  }

  handleChange(event) {
    this.setState({
      fileName: event.target.value
    });
  }

  changeFiletype(event) {
    this.setState({
      fileType: event.target.value === 'h' ? 'html' : 'md'
    });
  }

  handleClick() {
    let blobUrl;

    if (this.state.fileType === 'html') {
      const fullHtml = (
        <html lang='en'>
          <head>
            <meta charSet='utf-8' />
            <meta
              name='viewport'
              content='width=device-width, initial-scale=1, shrink-to-fit=no'
            />
            <title>Rendered HTML</title>
            <style
              dangerouslySetInnerHTML={{
                __html: `
                body { padding: 10px }
                h1,h2,h3,h4,h5,h6 { color: red; }
                p { font-size: 14pt; }
            `
              }}
            />
          </head>
          <body>
            <div
              dangerouslySetInnerHTML={{
                __html: this.converter.makeHtml(this.props.editorText)
              }}
            />
          </body>
        </html>
      );
      const content = `<!DOCTYPE html>${ ReactDOMServer.renderToString(
        fullHtml
      ) }`;
      blobUrl = URL.createObjectURL(new Blob([content], { type: 'text/html' }));
    } else {
      const content = this.props.editorText;
      blobUrl = URL.createObjectURL(
        new Blob([content], { type: 'text/plain' })
      );
    }
    const a = document.createElement('a');
    a.style = 'display: none';
    a.href = blobUrl;
    a.download = `${ this.state.fileName }.${ this.state.fileType }`;
    a.click();
    window.URL.revokeObjectURL(blobUrl);
  }

  render() {
    return this.props.editorText ? (
      <div id='preview'>
        <style
          dangerouslySetInnerHTML={{
            __html: `
                body { padding: 10px }
                h1,h2,h3,h4,h5,h6 { color: red; }
                p { font-size: 14pt; }
            `
          }}
        />
        <div
          dangerouslySetInnerHTML={{
            __html: this.converter.makeHtml(this.props.editorText)
          }}
        />

        <input
          className='form'
          aria-label="Enter a file name"
          value={this.state.fileName}
          onChange={this.handleChange}
          placeholder='Enter a file name'
        ></input>
        <select className='form' onChange={this.changeFiletype} id='filetype'>
          <option value='m'>md</option>
          <option value='h'>html</option>
        </select>
        <button onClick={this.handleClick} className='btn btn-primary'>
          Download
        </button>
      </div>
    ) : (
        <p>Write some Markdown in the text area to the left to start</p>
      );
  }
}

export default Preview;
