'use strict';

describe('Component: SamparksurveyComponent', function() {
  // load the controller's module
  beforeEach(module('caSite2018App.samparksurvey'));

  var SamparksurveyComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    SamparksurveyComponent = $componentController('samparksurvey', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
