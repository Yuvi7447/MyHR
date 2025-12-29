/**
 * Jest mock for @react-native-documents/viewer
 * Required because the package uses TurboModules which aren't available in Jest
 */

const errorCodes = Object.freeze({
  UNABLE_TO_OPEN_FILE_TYPE: 'UNABLE_TO_OPEN_FILE_TYPE',
  NULL_PRESENTER: 'NULL_PRESENTER',
});

const isErrorWithCode = (err) => {
  return err && typeof err === 'object' && typeof err.code === 'string';
};

const viewDocument = jest.fn(() => Promise.resolve(null));

module.exports = {
  viewDocument,
  errorCodes,
  isErrorWithCode,
};
