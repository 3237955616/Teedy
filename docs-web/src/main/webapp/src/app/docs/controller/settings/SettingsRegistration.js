angular.module('docs').controller('SettingsRegistration', function($scope, Restangular) {

  /**
   * Load registrations from server.
   */
  $scope.loadRequests = function() {
    Restangular.one('userRegistration/list').get({
        sort_column: 1,
        asc: true
    }).then(function(data) {
        console.log('Loaded registration requests:', data);
        $scope.requests = data.requests;
    });
  };
  
  $scope.loadRequests();

  // 批准注册请求
  $scope.approveRequest = function(request) {
    Restangular.one('userRegistration/approveRegistration').put({
        id: request.id,
    }).then(function() {
        alert('Approve成功');
        $scope.loadRequests();
    }, function(error) {
        console.error('Failed to approve:', error);
        alert('Approve失败');
    });

    Restangular.one('user').customPUT({
        username: request.username,
        password: request.password,
        email: request.email,
        storage_quota: "10"
    }, '', {}, {
        'Content-Type': 'application/x-www-form-urlencoded'
    }).then(function() {
        console.log('user/register', request);
    }, function(error) {
        console.error('Failed to register: ', error);
        alert('注册失败，请重试');
    });
  };

  // 拒绝注册请求
  $scope.rejectRequest = function(request) {
    alert('请稍后尝试');
  };

});