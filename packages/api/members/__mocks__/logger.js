module.exports = {
  Logger: jest.fn().mockImplementation(() => ({
    addContext: jest.fn(),
    info: jest.fn().mockImplementation((message) => {
      console.log(JSON.stringify(message));
    }),
    debug: jest.fn().mockImplementation((message) => {
      console.log(JSON.stringify(message));
    }),
    warn: jest.fn().mockImplementation((message) => {
      console.log(JSON.stringify(message));
    }),
    error: jest.fn().mockImplementation((message) => {
      console.log(JSON.stringify(message));
    }),
  })),
};
