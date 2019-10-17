import React from 'react';

class Editor extends React.Component {
  render() {
    return (
      <textarea aria-label="Enter markdown here" id='editor' onChange={this.props.handleOnChange}></textarea>
    );
  }
}

export default Editor;
