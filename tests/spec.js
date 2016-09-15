describe('find the rooms/0 page', function() {
  it('should display rooms/0', function() {
    browser.get('http://localhost:3000/#/rooms/0');
  });

  it('should display room-box', function() {
    element(by.id('room-box')).isDisplayed()
  });

  it ('should be an empty string in the inputBox', function(){
    expect(element(by.id('primaryInputBox')).getText()).
    toEqual('');
  });

  it('should send [poke it] into the inputBox and respond [Poke what?]', function() {
    var el = element(by.id('primaryInputBox'))
    var submit = element(by.id('submit'))
    var output = element(by.id('gameMessage'))
    el.click();
    el.sendKeys("poke it");

    browser.wait(function() {
      return element(by.binding('gameMessage')).isPresent();
    }, 50000);

    submit.click();
    expect(output.getAttribute('innerHTML')).toEqual(' I don\'t detect ...it?');

  })
});
