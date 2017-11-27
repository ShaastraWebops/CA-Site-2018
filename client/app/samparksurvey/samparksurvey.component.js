'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './samparksurvey.routes';

export class SamparksurveyComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('caSite2018App.samparksurvey', [uiRouter])
  .config(routes)
  .component('samparksurvey', {
    template: require('./samparksurvey.html'),
    controller: SamparksurveyComponent,
    controllerAs: 'samparksurveyCtrl'
  })
  .name;
