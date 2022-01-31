import * as React from 'react';
import * as ReactDOM from 'react-dom';

const App = () => {
  const inputRef = React.useRef<HTMLInputElement>();
  const [fileProgress, setFileProgress] = React.useState(null);
  const fileLoaderRef = React.useRef<FileReader>(null);
  const submitEnabled = !fileProgress && fileLoaderRef.current?.result;

  const handleUpload = () => {
    inputRef.current.click();
  };

  const handleParseProgress = React.useCallback((ev: ProgressEvent) => {
    if (ev.lengthComputable) {
      setFileProgress(ev.total / ev.loaded);
    }
  }, []);

  const handleParseLoad = React.useCallback((ev: ProgressEvent<FileReader>) => {
    if (ev.total / ev.loaded === 1) {
      setFileProgress(null);
    }
  }, []);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    (event) => {
      const { files } = event.target;

      if (files.length === 0) {
        return;
      }

      fileLoaderRef.current = new FileReader();
      const reader = fileLoaderRef.current;
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onprogress = handleParseProgress;
      reader.onload = handleParseLoad;
      reader.readAsBinaryString(files[0]);
    },
    [handleParseProgress],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const json = JSON.parse(fileLoaderRef.current.result as string);

    parent.postMessage({ pluginMessage: { type: 'IMPORT_THEME', payload: json } }, '*');
  };

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Theme Upload</legend>
          <input
            type="file"
            ref={inputRef}
            onChange={handleChange}
            accept=".json"
            id="jsonFile"
            hidden
          />
          <div>
            <button type="button" onClick={handleUpload}>
              Upload theme
            </button>
          </div>
          {fileLoaderRef.current?.result ? 'JSON loaded' : 'No JSON loaded'}
        </fieldset>

        <button type="submit" disabled={!submitEnabled}>
          Import
        </button>
      </form>
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

ReactDOM.render(<App />, document.getElementById('plugin-root'));
