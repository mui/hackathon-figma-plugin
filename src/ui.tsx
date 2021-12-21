import * as React from 'react';
import * as ReactDOM from 'react-dom';

const App = () => {
  const inputRef = React.useRef<HTMLInputElement>();
  const [fileProgress, setFileProgress] = React.useState(null);

  const handleUpload = () => {
    inputRef.current.click();
  };

  const handleParseProgress = React.useCallback((ev: ProgressEvent) => {
    if (ev.lengthComputable) {
      setFileProgress(ev.total / ev.loaded);
    }
  }, []);

  const handleParseLoad = (ev: ProgressEvent<FileReader>): void => {
    if (ev.total / ev.loaded) {
      setFileProgress(null);
    }

    const json = JSON.parse(ev.target.result as string);
    parent.postMessage({ pluginMessage: { type: 'IMPORT_THEME', payload: json } }, '*');
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    (event) => {
      const { files } = event.target;

      if (files.length === 0) {
        return;
      }

      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onprogress = handleParseProgress;
      reader.onload = handleParseLoad;
      reader.readAsBinaryString(files[0]);
    },
    [handleParseProgress],
  );

  return (
    <React.Fragment>
      <input type="file" ref={inputRef} onChange={handleChange} accept=".json" hidden />
      <button type="button" onClick={handleUpload}>
        Upload theme
      </button>
      {fileProgress && (
        <div>
          <label htmlFor="upload-progress">Loading…</label>
          <progress id="upload-progress" value={fileProgress}>{`${fileProgress * 100}%`}</progress>
          <output>{`${fileProgress * 100}%`}</output>
        </div>
      )}
    </React.Fragment>
  );
};

ReactDOM.render(<App />, document.getElementById('mui-theme'));
