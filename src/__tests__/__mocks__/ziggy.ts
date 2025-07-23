// @ts-nocheck
const defaultWindow = {
  location: {
    host: "http://localhost.test",
  },
};

beforeAll(() => {
  delete window.location;
  window.location = {};
});

beforeEach(() => {
  window.location = { ...defaultWindow.location };
  global.window.location = window.location;
  window.route = vi.fn();
});
