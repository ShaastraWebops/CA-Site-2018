'use strict';

import angular from 'angular';
import RoleController from './role.controller';

export default angular.module('eventsPortalApp.role', [])
  .controller('RoleController', RoleController)
  .name;
