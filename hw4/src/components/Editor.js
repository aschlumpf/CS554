import React from 'react';

class Editor extends React.Component {
  render() {
    return (
      <textarea id='editor' onChange={this.props.handleOnChange}></textarea>
    );
  }
}

export default Editor;
