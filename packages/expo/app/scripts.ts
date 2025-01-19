const debugging = `
  const consoleLog = (type, log) => window.ReactNativeWebView.postMessage(JSON.stringify({'type': 'Console', 'data': {'type': type, 'log': log}}));
  console = {
      log: (log) => consoleLog('log', log),
      debug: (log) => consoleLog('debug', log),
      info: (log) => consoleLog('info', log),
      warn: (log) => consoleLog('warn', log),
      error: (log) => consoleLog('error', log),
    };
`;
const injectedJavaScript = `
    document.addEventListener('message', function(event) {
      const data = event.data;
      if (data.type === 'copy') {
        navigator.clipboard.writeText(data.text).then(function() {
          window.ReactNativeWebView.postMessage('Copied to clipboard');
        }).catch(function(error) {
          window.ReactNativeWebView.postMessage('Failed to copy: ' + error);
        });
      }
    });
  `;

const scripts = {
  debugging,
  injectedJavaScript,
};

export default scripts;
