$scope.loadRequests = function() {
    $http.get('/api/registration')
        .success(function(data) {
            $scope.requests = data;
        });
};

$scope.approveRequest = function(request) {
    $http.put('/api/registration/' + request.id, { status: 'APPROVED' })
        .success(function() {
            alert('User approved!');
        });
};