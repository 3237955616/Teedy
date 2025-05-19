// Load pending registrations
$scope.loadPendingRegistrations = function() {
    $http.get('/api/users?status=PENDING')
        .success(function(data) {
            $scope.pendingRegistrations = data.users;
        });
};

// Approve a user registration
$scope.approveUser = function(userId) {
    $http.put('/api/registration/' + userId + '/approve')
        .success(function() {
            $scope.loadPendingRegistrations();
        });
};

// Reject a user registration
$scope.rejectUser = function(userId) {
    $http.put('/api/registration/' + userId + '/reject')
        .success(function() {
            $scope.loadPendingRegistrations();
        });
};

// Initialize when controller loads
$scope.loadPendingRegistrations();