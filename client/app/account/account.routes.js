'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('login', {
    url: '/login',
    template: require('./login/login.html'),
    controller: 'LoginController',
    controllerAs: 'vm',
    authenticate: false
  })
    .state('logout', {
      url: '/logout?referrer',
      referrer: 'main',
      template: '',
      controller($state, Auth) {
        'ngInject';

        var referrer = $state.params.referrer || $state.current.referrer || 'main';
        Auth.logout();
        $state.go(referrer);
      }
    })
    .state('signup', {
      url: '/signup',
      template: require('./signup/signup.html'),
      controller: 'SignupController',
      controllerAs: 'vm',
      authenticate: false
    })
    .state('forgotpassword',{
      url:'/forgotpassword',
      template: require('./forgotPassword/forgotPassword.html'),
      controller: 'fpController',
      controllerAs:'vm'
    })
    .state('resetpassword', {
        url: '/resetpassword/:email/:token',
        // url: '/resetpassword',
        template: require('./resetPassword/resetPassword.html'),
        controller: 'rpController',
        controllerAs:'vm'
      })
    .state('settings', {
      url: '/settings',
      template: require('./settings/settings.html'),
      controller: 'SettingsController',
      controllerAs: 'vm',
      authenticate: true
    });
}
