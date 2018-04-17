var myApp = angular.module('myApp');

myApp.controller('UploadController', ['$scope', '$http', '$location', '$routeParams', 'Notification',function($scope, $http, $location, $routeParams,Notification) {

    var recorder = null;
    var chunks = [];
    $scope.isRecording = false;
    $scope.addFile = function (file) {
      console.log(file);
      $http.post('/upload', file, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then( function (response){
        console.log(response);
        console.log("file added");
        // $location.path('/cars');
      })
      .catch(function (data) {
          console.log(data);
          // Handle error here
    });
  };

  $scope.getFiles = function () {
    $http.get('/files')
      .then(function (res) {
        $scope.files = res.data;
        console.log(res.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  $scope.getFilePath = function(name) {
    return "http://localhost:3000/uploads/" + name;
  };

  $scope.getFiles();

  $scope.startRecord = function () {
    $scope.isRecording = true;
    Notification({message:'Recording started', delay: 1000});
    // request permission to access audio stream
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        // store streaming data chunks in array

        // create media recorder instance to initialize recording
        recorder = new MediaRecorder(stream);
        // function to be called when data is received

        recorder.ondataavailable = e => {
          // add stream data to chunks
          chunks.push(e.data);
          // if recorder is 'inactive' then recording has finished
        };
        // start recording with 1 second time between receiving 'ondataavailable' events
        recorder.start(1000);

        // setTimeout to stop recording after 4 seconds
    }).catch(console.error);
  }

  $scope.stopRecord = function () {
    $scope.isRecording = false;
    Notification({message:'Recording stopped', delay: 1000});
    recorder.onstop = function () {
      // convert stream data chunks to a 'webm' audio format as a blob
      const blob = new Blob(chunks, { type: 'audio/mp3' });

      const fd = new FormData();
      fd.append('audio', blob, 'blobby.mp3');
      fetch('/upload',{
          method: 'post',
          body: fd
        })
      .then(function(response) {
        Notification.success({message:'Record saved', delay: 1000});
        setTimeout(() => {
          $window.location.reload();
        }, 2000);
      })
      .catch(function(err){
        Notification.error({message:'Problems with saving record', delay: 1000});
      });
    };

    recorder.stop();
  }

}]);
