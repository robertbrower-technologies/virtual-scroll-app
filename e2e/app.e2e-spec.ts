import { VirtualScrollAppPage } from './app.po';

describe('virtual-scroll-app App', () => {
  let page: VirtualScrollAppPage;

  beforeEach(() => {
    page = new VirtualScrollAppPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
