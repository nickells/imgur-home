app.config(function ($stateProvider) {
	$stateProvider.state('home', {
		url: '/:category',
		templateUrl: 'js/home/home.html',
		controller: 'HomeCtrl',
		resolve: {
			pics: function (ImgurFactory, $stateParams) {
				var category = $stateParams.category

				//prevents results loading from /r/porn 
				if (!category) category = 'earth'
				return ImgurFactory.getImages(category.toString())
				.then(function(res){
					return res.data
				})
			}
		}
	});
});

app.controller('HomeCtrl', function ($scope, pics, $interval, ImgurFactory) {

	$scope.categories = ImgurFactory.categories;


	if (pics.length == 0) {
		console.log('oops')
		$scope.showError = true;
	}

	//limits to images that fit well on the screen
	var landscapesOnly = pics.filter(function (elem) {
		return (elem.width > elem.height) && (elem.animated == false);
	})

	var randIndex = function () {
		return _.random(0, landscapesOnly.length)
	}

	//set initial pic for interval
	$scope.picOfTheHour = landscapesOnly[randIndex()]
	$scope.picOfTheHourPreload = landscapesOnly[randIndex()]

	$scope.date = new Date

	//change every so often. this doesn't persist yet. future plans to stick it in the session
	$interval(function () {
		$scope.picOfTheHour = landscapesOnly[randIndex()]
		$scope.picOfTheHourPreload = landscapesOnly[randIndex()+1]
	}, 3600000)

	$interval(function () {
		$scope.date = new Date
			// console.log($scope.date)
	}, 60000)

	$scope.newImage = function () {
		$scope.picOfTheHour = landscapesOnly[randIndex()] || landscapesOnly[1]
			// console.log($scope.picOfTheHour)
	}


	//loading screen, thanks Stefan Henze
	$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		if (toState.resolve) {
			$scope.showSpinner();
		}
	});
	$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
		if (toState.resolve) {
			$scope.hideSpinner();
		}
	});

	$scope.loading = false;

	$scope.showSpinner = function () {
		console.log("hey!!")
		$scope.loading = true;
	}

	$scope.hideSpinner = function () {
		$scope.loading = false;
	}

})