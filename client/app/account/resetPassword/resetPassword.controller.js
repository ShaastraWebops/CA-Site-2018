'use strict';

export default class rpController {

  /*@ngInject*/
  constructor($http, $stateParams, $window, $location) {
    this.$http= $http;
    this.$stateParams = $stateParams;
    this.$window=$window;
    this.$location = $location;
    this.newPassword = '';
    this.confirmNewPassword = '';
    this.submitted = false;
  }


  reset(form) {
    this.submitted = true;
    this.message = 'Working...';
    if(form.$valid) {

      this.$http.post('/api/users/resetpass/' + this.$stateParams.email + '/' + this.$stateParams.token, { newPassword: this.newPassword })
        .then((message)=>{
          this.message = '';
          this.$window.alert('Successfully changed');
          this.$location.url('/login');
        })
        .catch((message)=>{
          this.message = 'Your token has been expired (or) is invalid'
        });
    }
  }
}
