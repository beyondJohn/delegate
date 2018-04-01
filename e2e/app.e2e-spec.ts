import { DelegatesPage } from './app.po';

describe('delegates App', () => {
  let page: DelegatesPage;

  beforeEach(() => {
    page = new DelegatesPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
