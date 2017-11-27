'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('samparksurvey', {
      url: '/samparksurvey',
      template: '<samparksurvey></samparksurvey>'
    });
}
