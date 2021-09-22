import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const Input = styled('input')`
  display: none;
`;

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

  const handleExport = () => {
    alert('Not implemented yet.');
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Input type="file" ref={inputRef} onChange={handleChange} />
      <Stack m={2} spacing={2}>
        <Button variant="contained" onClick={handleUpload}>
          Upload theme
        </Button>
        <Button variant="contained" color="secondary" onClick={handleExport}>
          Export theme
        </Button>
      </Stack>
    </React.Fragment>
  );
};

ReactDOM.render(<App />, document.getElementById('react-page'));
