'use strict';

/**
 * Document view content controller.
 */
angular.module('docs').controller('DocumentViewContent', function ($scope, $rootScope, $stateParams, Restangular, $dialog, $state, Upload, $translate, $uibModal, $sce) {
  $scope.displayMode = _.isUndefined(localStorage.fileDisplayMode) ? 'grid' : localStorage.fileDisplayMode;
  $scope.openedFile = undefined;

  // 初始化翻译字典
  $scope.translationDict = {
    '你好': 'Hello',
    '早上好': 'Good morning',
    '下午好': 'Good afternoon',
    '晚上好': 'Good evening',
    '晚安': 'Good night',
    '再见': 'Goodbye',
    '很高兴见到你': 'Nice to meet you',
    '最近怎么样': 'How are you doing',
    '一切都好吗': 'How’s everything',
    '好久不见': 'Long time no see',
    '谢谢': 'Thank you',
    '非常感谢': 'Thank you very much',
    '不用谢': 'You’re welcome',
    '对不起': 'Sorry',
    '抱歉': 'Apologize',
    '没关系': 'It’s okay',
    '请原谅我': 'Forgive me, please',
    '请问': 'Excuse me',
    '请': 'Please',
    '打扰一下': 'Excuse me',
    '什么': 'What',
    '哪里': 'Where',
    '什么时候': 'When',
    '为什么': 'Why',
    '如何': 'How',
    '谁': 'Who',
    '多少': 'How many',
    '多少钱': 'How much',
    '是': 'Yes',
    '不是': 'No',
    '好的': 'Okay',
    '可以': 'Can',
    '帮助': 'Help',
    '麻烦': 'Trouble',
    '喜欢': 'Like',
    '讨厌': 'Hate',
    '饿了': 'Hungry',
    '渴了': 'Thirsty',
    '累了': 'Tired',
    '你叫什么名字': 'What’s your name',
    '我叫李明': 'My name is Li Ming',
    '你来自哪里': 'Where are you from',
    '我来自中国': 'I’m from China',
    '你会说中文吗': 'Can you speak Chinese',
    '我会说一点英文': 'I can speak a little English',
    '请重复一遍': 'Please repeat that',
    '请说得慢一点': 'Please speak slowly',
    '这是什么': 'What’s this',
    '那多少钱': 'How much is that',
    '我想要一杯咖啡': 'I’d like a cup of coffee',
    '请给我账单': 'Please give me the bill',
    '祝你好运': 'Good luck',
    '生日快乐': 'Happy birthday',
    '恭喜': 'Congratulations',
    '机场': 'Airport',
    '酒店': 'Hotel',
    '餐厅': 'Restaurant',
    '医院': 'Hospital',
    '洗手间在哪里': 'Where is the restroom',
    '地铁站': 'Subway station',
    '公交站': 'Bus stop',
    '警察局': 'Police station'
  };

  /**
   * 翻译文本函数
   */
  $scope.translateText = function(text) {
    if (!text) return '';
    
    // 首先尝试使用 $translate 服务进行整段翻译
    let translated = $translate.instant(text);
    
    // 如果 $translate 没有翻译结果，则使用本地字典进行逐词翻译
    if (translated === text) {
      // 按中文词语和非中文内容分割文本
      const segments = text.split(/([\u4e00-\u9fa5]+)/);
      
      // 对每个中文词语进行翻译
      translated = segments.map(segment => {
        // 如果是中文词语，尝试从字典翻译
        if (/[\u4e00-\u9fa5]/.test(segment)) {
          // 尝试查找最长匹配
          let result = '';
          let i = 0;
          
          while (i < segment.length) {
            let maxMatch = '';
            
            // 查找从i开始的最长匹配词
            for (let j = segment.length; j > i; j--) {
              const substr = segment.substring(i, j);
              if ($scope.translationDict[substr]) {
                maxMatch = substr;
                break;
              }
            }
            
            // 如果找到匹配，添加翻译并移动指针
            if (maxMatch) {
              result += $scope.translationDict[maxMatch];
              i += maxMatch.length;
            } else {
              // 没找到匹配，添加原文
              result += segment[i];
              i++;
            }
          }
          
          return result;
        }
        
        // 如果不是中文，直接返回
        return segment;
      }).join('');
    }
    
    // 信任HTML内容
    return $sce.trustAsHtml(translated);
  };

  /**
   * Watch for display mode change.
   */
  $scope.$watch('displayMode', function (next) {
    localStorage.fileDisplayMode = next;
  });

  /**
   * Configuration for file sorting.
   */
  $scope.fileSortableOptions = {
    forceHelperSize: true,
    forcePlaceholderSize: true,
    tolerance: 'pointer',
    start: function() {
      $(this).addClass('currently-dragging');
    },
    stop: function () {
      var _this = this;
      setTimeout(function(){
        $(_this).removeClass('currently-dragging');
      }, 300);

      // Send new positions to server
      $scope.$apply(function () {
        Restangular.one('file').post('reorder', {
          id: $stateParams.id,
          order: _.pluck($scope.files, 'id')
        });
      });
    }
  };

  /**
   * Load files from server.
   */
  $scope.loadFiles = function () {
    Restangular.one('file/list').get({ id: $stateParams.id }).then(function (data) {
      $scope.files = data.files;
    });
  };
  $scope.loadFiles();

  /**
   * Navigate to the selected file.
   */
  $scope.openFile = function (file, $event) {
    if ($($event.target).parents('.currently-dragging').length === 0) {
      $scope.openedFile = file;
      $state.go('document.view.content.file', { id: $stateParams.id, fileId: file.id });
    }
  };

  /**
   * Delete a file.
   */
  $scope.deleteFile = function (file) {
    var title = $translate.instant('document.view.content.delete_file_title');
    var msg = $translate.instant('document.view.content.delete_file_message');
    var btns = [
      {result: 'cancel', label: $translate.instant('cancel')},
      {result: 'ok', label: $translate.instant('ok'), cssClass: 'btn-primary'}
    ];

    $dialog.messageBox(title, msg, btns, function (result) {
      if (result === 'ok') {
        Restangular.one('file', file.id).remove().then(function () {
          // File deleted, decrease used quota
          $rootScope.userInfo.storage_current -= file.size;

          // Update local data
          $scope.loadFiles();
        });
      }
    });
  };

  /**
   * Upload a new version.
   */
  $scope.uploadNewVersion = function (files, file) {
    if (!$scope.document.writable || !files || files.length === 0) {
      return;
    }

    var uploadedfile = files[0];
    var previousFileId = file.id;
    file.id = undefined;
    file.progress = 0;
    file.name = uploadedfile.name;
    file.create_date = new Date().getTime();
    file.mimetype = uploadedfile.type;
    file.version++;
    $scope.uploadFile(uploadedfile, file, previousFileId);
  };

  /**
   * File has been drag & dropped.
   */
  $scope.fileDropped = function (files) {
    if (!$scope.document.writable) {
      return;
    }

    if (files && files.length) {
      // Sort by filename
      files = _.sortBy(files, 'name');

      // Adding files to the UI
      var newfiles = [];
      _.each(files, function (file) {
        var newfile = {
          progress: 0,
          name: file.name,
          create_date: new Date().getTime(),
          mimetype: file.type,
          status: $translate.instant('document.view.content.upload_pending')
        };
        $scope.files.push(newfile);
        newfiles.push(newfile);
      });

      // Uploading files sequentially
      var key = 0;
      var then = function() {
        if (files[key]) {
          $scope.uploadFile(files[key], newfiles[key++]).then(then);
        }
      };
      then();
    }
  };

  /**
   * Upload a file.
   */
  $scope.uploadFile = function(file, newfile, previousFileId) {
    // Upload the file
    newfile.status = $translate.instant('document.view.content.upload_progress');
    return Upload.upload({
      method: 'PUT',
      url: '../api/file',
      file: file,
      fields: {
        id: $stateParams.id,
        previousFileId: previousFileId
      }
    })
    .progress(function(e) {
      newfile.progress = parseInt(100.0 * e.loaded / e.total);
    })
    .success(function(data) {
      // Update local model with real data
      newfile.id = data.id;
      newfile.size = data.size;

      // New file uploaded, increase used quota
      $rootScope.userInfo.storage_current += data.size;
    })
    .error(function (data) {
      newfile.status = $translate.instant('document.view.content.upload_error');
      if (data.type === 'QuotaReached') {
        newfile.status += ' - ' + $translate.instant('document.view.content.upload_error_quota');
      }
    });
  };

  /**
   * Rename a file.
   */
  $scope.renameFile = function (file) {
    $uibModal.open({
      templateUrl: 'partial/docs/file.rename.html',
      controller: 'FileRename',
      resolve: {
        file: function () {
          return angular.copy(file);
        }
      }
    }).result.then(function (fileUpdated) {
      if (fileUpdated === null) {
        return;
      }

      // Rename the file
      Restangular.one('file/' + file.id).post('', {
        name: fileUpdated.name
      }).then(function () {
        file.name = fileUpdated.name;
      })
    });
  };

  /**
   * Process a file.
   */
  $scope.processFile = function (file) {
    Restangular.one('file/' + file.id).post('process').then(function () {
      file.processing = true;
    });
  };

  /**
   * Open versions history.
   */
  $scope.openVersions = function (file) {
    $uibModal.open({
      templateUrl: 'partial/docs/file.versions.html',
      controller: 'ModalFileVersions',
      size: 'lg',
      resolve: {
        file: function () {
          return file;
        }
      }
    })
  };
});