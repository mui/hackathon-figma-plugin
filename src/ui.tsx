import * as React from 'react';
import * as ReactDOM from 'react-dom';

const App = () => {
  const inputRef = React.useRef<HTMLInputElement>();

  const handleUpload = () => {
    inputRef.current.click();
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { files } = event.target;

    if (!files || files.length === 0) {
      return;
    }

    const reader = new FileReader();
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = () => {
      const json = JSON.parse(reader.result as string);
      parent.postMessage({ pluginMessage: { type: 'IMPORT_THEME', payload: json } }, '*');
    };
    reader.readAsBinaryString(files[0]);
  };

  return (
    <React.Fragment>
      <input type="file" ref={inputRef} onChange={handleChange} accept=".json" hidden />
      <button type="button" onClick={handleUpload}>
        Upload theme
      </button>
    </React.Fragment>
  );
};

ReactDOM.render(<App />, document.getElementById('mui-theme'));
