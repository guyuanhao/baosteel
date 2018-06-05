'use strict';

describe('Controller: InfotablectrlCtrl', function () {

  // load the controller's module
  beforeEach(module('comosAngularjsApp'));

  var InfotablectrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InfotablectrlCtrl = $controller('InfotablectrlCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(InfotablectrlCtrl.awesomeThings.length).toBe(3);
  });
});
