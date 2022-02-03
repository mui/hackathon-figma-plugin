import * as React from 'react';
import * as ReactDOM from 'react-dom';

const App = () => {
  const inputRef = React.useRef<HTMLInputElement>();
  const [jsonFile, setJsonFile] = React.useState(null);
  const fileLoaderRef = React.useRef<FileReader>(null);
  const submitEnabled = fileLoaderRef.current?.result;

  const handleUpload = () => {
    inputRef.current.click();
  };

  const handleParseLoad = React.useCallback((ev: ProgressEvent<FileReader>) => {
    setJsonFile(JSON.parse(fileLoaderRef.current.result as string));
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
      reader.onload = handleParseLoad;
      reader.readAsBinaryString(files[0]);
    },
    [handleParseLoad],
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
            <p>Select a JSON to import tokens from.</p>
            <button type="button" onClick={handleUpload} disabled={jsonFile}>
              Upload theme
            </button>
            {jsonFile && '✅'}
          </div>
        </fieldset>

        {jsonFile && (
          <fieldset>
            <legend>Categories</legend>
            <p>Choose which categories to import:</p>
            {Object.keys(jsonFile).map((item) => (
              <>
                <input
                  key={item + '-input'}
                  type="checkbox"
                  value={item}
                  id={item}
                  checked={true}
                  readOnly
                />
                <label key={item + '-label'} htmlFor={item}>
                  {item}
                </label>
              </>
            ))}
        </fieldset>
        )}

        <button type="submit" disabled={!submitEnabled}>
          Import
        </button>
      </form>
    </React.Fragment>
  );
};

ReactDOM.render(<App />, document.getElementById('plugin-root'));
