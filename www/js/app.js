(function() { // IIFE wrapper of app
//---------------------------

var app = angular.module('reddit-app', ['ionic', 'angularMoment'])


app.controller('ReddditCtrl', function($http, $scope) {

  $scope.stories = [];
  function loadStories(params, callback) {
    $http.get('https://www.reddit.com/r/funny/new/.json', {params: params})
      .success( function(response){
        var stories = [];
        angular.forEach(response.data.children, function(child) {
          var story = child.data;
          if(!story.thumbnail || story.thumbnail === 'self' || story.thumbnail == 'default' || story.thumbnail == 'nsfw') {
            story.thumbnail = 'http://www.redditstatic.com/icon.png';
          }
          stories.push(child.data);
        });
        callback(stories);
        // $scope.$broadcast('scroll.infiniteScrollComplete');
      })
  }

  $scope.loadOlderStories = function() {
    var params = {};
    if ($scope.stories.length > 0) {
      params['after'] = $scope.stories[$scope.stories.length - 1].name;
    }
      loadStories(params, function(olderStories) {
        $scope.stories = $scope.stories.concat(olderStories);
        $scope.$broadcast('scroll.infiniteScrollComplete');

      });
    };

    $scope.loadNewerStories = function() {
      var params = {'before': $scope.stories[0].name};
      loadStories(params, function(newerStories) {
        $scope.stories = newerStories.concat($scope.stories);
        $scope.$broadcast('scroll.refreshComplete');

      });
    };
  
    $scope.openUrl = function(url) {
      window.open(url, '_blank');
    };



}); // END of app.controller

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.cordova && window.cordova.InAppBrowser) {
      window.open = window.cordova.InAppBrowser.open;
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
//---------------------------
}()); // IIFE wrapper of app