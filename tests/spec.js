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

  it('should send [poke fish] into the inputBox and respond [Poke what?]', function() {
    element(by.id('primaryInputBox')).sendKeys('poke fish');
    expect(element(by.binding('gameMessage')).getText()).
    toEqual('Poke what?');
  })
});
// element(by.model('yourName')).sendKeys('Julie');
// var greeting = element(by.binding('yourName'));
// expect(greeting.getText()).toEqual('Hello Julie!');
