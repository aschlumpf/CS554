import React from 'react';
import Editor from './Editor';
import Preview from './Preview';

class MarkdownEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorText: ''
    };
    this.onEditorChange = this.onEditorChange.bind(this);
  }

  onEditorChange(event) {
    this.setState({
      editorText: event.target.value
    });
  }

  render() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-sm'>
            <Editor handleOnChange={this.onEditorChange} />
          </div>
          <div id='preview' className='col-sm'>
            <Preview editorText={this.state.editorText} />
          </div>
        </div>
      </div>
    );
  }
}

export default MarkdownEditor;
