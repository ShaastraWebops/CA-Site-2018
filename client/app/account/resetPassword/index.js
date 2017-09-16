'use strict';

import angular from 'angular';
import rpController from './resetPassword.controller';

export default angular.module('eventsPortalApp.resetpassword', [])
  .controller('rpController', rpController)
  .name;
