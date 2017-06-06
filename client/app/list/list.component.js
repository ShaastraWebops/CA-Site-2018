'use strict';
const angular = require('angular');
const uiRouter = require('angular-ui-router');


import routes from './list.routes';

export class ListComponent {
  /*@ngInject*/
  val = {};
  user = {};
  constructor($http, FileSaver) {
    this.$http = $http;
    this.FileSaver = FileSaver;
  }

  $onInit() {
    this.users = [];
    this.$http.get('/api/users/list').then(response => {
      if(response.status === 200) {
        this.users = response.data;
      }
    });
    this.export = function() {
      this.$http.get('/api/users/export').then(response => {
        var data = new Blob([response.data], { type: 'text/csv;charset=utf-8' });
        this.FileSaver.saveAs(data, 'users.csv');
      });
    };
  }
}

export default angular.module('caportalApp.list', [uiRouter])
  .config(routes)
  .component('list', {
    template: require('./list.html'),
    controller: ListComponent,
    controllerAs: 'listCtrl'
  })
  .name;