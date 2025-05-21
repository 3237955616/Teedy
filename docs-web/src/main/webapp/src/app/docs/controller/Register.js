'use strict';

/**
 * Register controller.
 */
angular.module('docs').controller('Register', function ($scope, $uibModalInstance, Restangular, $translate, $dialog) {
    $scope.username = '';
    $scope.password = '';
    $scope.confirmPassword = '';
    $scope.email = '';

    $scope.close = function (username) {
        $uibModalInstance.close(username);
    };

  // Register function
    $scope.register = function (password, confirmPassword, username, email) {
    console.log(password, confirmPassword, username, email);
    if (password !== confirmPassword) {
        var title = $translate.instant("注册出错");
        var msg = $translate.instant("密码和确认密码不匹配");
        var btns = [{result: 'ok', label: $translate.instant('ok'), cssClass: 'btn-primary'}];
        $dialog.messageBox(title, msg, btns);
        return;
    }

    // Register user
    console.log('Registering user:', username);
    Restangular.one('userRegistration').put({
        username: username,
        password: password,
        email: email
    }, '', {}, {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    ).then(function () {
        var title = $translate.instant("注册成功");
        var msg = $translate.instant("管理员审核后将激活您的帐号", { username: username });
        var btns = [{result: 'ok', label: $translate.instant('ok'), cssClass: 'btn-primary'}];
        $dialog.messageBox(title, msg, btns);
        $uibModalInstance.close(username);
    }).catch(function (error) {
        console.error('Registration failed:', error);
        var title = $translate.instant("注册出错");
        var msg = $translate.instant("出现错误,请稍后尝试");
        var btns = [{result: 'ok', label: $translate.instant('ok'), cssClass: 'btn-primary'}];
        $dialog.messageBox(title, msg, btns);
    });
  };
});