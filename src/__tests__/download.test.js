describe('download module test suite', () => {
  let download;
  let axios;
  let tc;
  beforeEach(() => {
    jest.resetModules();
    jest.mock('@actions/io', () => ({}));
    jest.mock('@actions/tool-cache');
    jest.mock('@actions/core');
    jest.mock('axios');
    tc = require('@actions/tool-cache');
    axios = require('axios');
    download = require('../download');
    axios.mockImplementationOnce(async () => ({
      data: {
        assets: [
          {
            name: 'client-windows.tar.gz',
            browser_download_url: 'http://invalid'
          },
          {name: 'client-linux.tar.gz', browser_download_url: 'http://valid'},
          {name: 'server-linux.tar.gz', browser_download_url: 'http://invalid'}
        ]
      }
    }));
  });
  test('download, should download valid Linux version', async () => {
    // Given
    const inputs = {ocVersion: '4.6.0-0.okd-2020-12-12-135354'};
    tc.downloadTool.mockImplementationOnce(async () => {});
    // When
    await download(inputs);
    // Then
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url:
          'https://api.github.com/repos/openshift/okd/releases/tags/4.6.0-0.okd-2020-12-12-135354'
      })
    );
    expect(tc.downloadTool).toHaveBeenCalledWith('http://valid');
  });
  test('download with token, should download valid Linux version', async () => {
    // Given
    const inputs = {
      ocVersion: '4.6.0-0.okd-2020-12-12-135354',
      githubToken: 'secret-token'
    };
    tc.downloadTool.mockImplementationOnce(async () => {});
    // When
    await download(inputs);
    // Then
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url:
          'https://api.github.com/repos/openshift/okd/releases/tags/4.6.0-0.okd-2020-12-12-135354',
        headers: {Authorization: 'token secret-token'}
      })
    );
    expect(tc.downloadTool).toHaveBeenCalledWith('http://valid');
  });
});
