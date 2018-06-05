'use strict';

describe('Service: shareDataService', function () {

  // load the service's module
  beforeEach(module('comosAngularjsApp'));

  // instantiate service
  var shareDataService;
  beforeEach(inject(function (_shareDataService_) {
    shareDataService = _shareDataService_;
  }));

  it('should do something', function () {
    expect(!!shareDataService).toBe(true);
  });

});
