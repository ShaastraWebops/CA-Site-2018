'use strict';

export default class fpController {
  /*@ngInject*/
  constructor($http, $state, $window) {
    this.$state = $state;
    this.$window=$window;

    this.$http = $http;
    this.submitted = false;
    this.message = '';
    this.email='';
    // this.$state.go('main');

  }


  forgotPassword(form) {
    this.submitted = true;
    this.message = 'Working...';

    if(form.$valid) {
      this.$http.post('/api/users/forgotpass', { email: this.email })
      .then((message) => {
          this.$window.alert('Mail Sent to ' + this.email + ' with further Instructions');

              this.email = '';
              this.submitted = false;
              this.message = '';


      })
      .catch((message) =>{
        this.message = 'Email does not exist (or) some error has occurred';
        this.email = '';
      });
    }
  }
}
