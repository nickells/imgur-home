app.factory('ImgurFactory', function ($http) {
	return {
		getImages: function (which) {
			$http.defaults.headers.common.Authorization = 'Client-ID fec98667bde0380';
			return $http.get('https://api.imgur.com/3/gallery/r/' + which + 'porn/top')
				.then(function (response) {
					console.log(response.data)
					return response.data
				}, function (err) {
					console.log("error", err)
				})
		}

	}
})