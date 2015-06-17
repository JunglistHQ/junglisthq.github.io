(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _componentsSearchJs = require('./components/Search.js');

var _componentsSearchJs2 = _interopRequireDefault(_componentsSearchJs);

var _componentsEditorJs = require('./components/Editor.js');

var _componentsEditorJs2 = _interopRequireDefault(_componentsEditorJs);

var _componentsHelpJs = require('./components/Help.js');

var _componentsHelpJs2 = _interopRequireDefault(_componentsHelpJs);

var _dataStorageJs = require('./data/Storage.js');

var _dataStorageJs2 = _interopRequireDefault(_dataStorageJs);

var App = (function () {
  function App(el) {
    var _this = this;

    _classCallCheck(this, App);

    this.$el = $(el);

    this.storage = new _dataStorageJs2['default']();

    if (this.storage.isTextEmpty) {
      this.storage.clear();
      this.storage.load('fennec-fox', function () {
        return _this.init();
      });
    } else {
      this.init();
    }
  }

  _createClass(App, [{
    key: 'init',
    value: function init() {
      this.search = new _componentsSearchJs2['default'](this);
      this.editor = new _componentsEditorJs2['default'](this);
      this.help = new _componentsHelpJs2['default'](this);

      this.$switchButton = this.$el.find('button.button-switch');
      this.$switchButton.on('click', this.switchEditorModes.bind(this));

      this.$cancelButton = this.$el.find('button.button-cancel');
      this.$cancelButton.on('click', this.cancelEdit.bind(this));

      this.$helpButton = this.$el.find('button.button-help');
      this.$helpButton.on('click', this.toggleHelp.bind(this));
    }
  }, {
    key: 'cancelEdit',
    value: function cancelEdit() {
      this.switchEditorModes(false);
    }
  }, {
    key: 'switchEditorModes',
    value: function switchEditorModes() {
      var save = arguments[0] === undefined ? true : arguments[0];

      if (this.editor.previewMode) {
        this.search.hide();
        this.$switchButton.text('Save');
        this.editor.previewMode = false;
        this.$helpButton.hide();
        this.help.hide();
        this.$cancelButton.show();
      } else {
        this.search.show();
        this.$switchButton.text('Edit text');

        if (save) this.editor.save();

        this.editor.previewMode = true;
        this.editor.render();
        this.$helpButton.show();
        this.$cancelButton.hide();
      }
    }
  }, {
    key: 'toggleHelp',
    value: function toggleHelp() {
      if (this.help.visible) this.help.hide();else this.help.show();
    }
  }]);

  return App;
})();

$(function () {

  var app = new App(window.document.body);
});

},{"./components/Editor.js":2,"./components/Help.js":3,"./components/Search.js":6,"./data/Storage.js":10}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _PhotoPlaceholderJs = require('./PhotoPlaceholder.js');

var _PhotoPlaceholderJs2 = _interopRequireDefault(_PhotoPlaceholderJs);

var Editor = (function () {
  function Editor(app) {
    _classCallCheck(this, Editor);

    this.app = app;

    this.text = '';
    this.$editor = app.$el.find('main.editor');
    this.$previewMode = this.$editor.find('section.mode-preview');
    this.$editMode = this.$editor.find('section.mode-edit');
    this.placeholders = [];

    this.load();
    this.render();
  }

  _createClass(Editor, [{
    key: 'previewMode',
    get: function () {
      return this.$previewMode.is(':visible');
    },
    set: function (value) {
      if (value) {
        this.$editMode.hide();
        this.$previewMode.show();
      } else {

        this.$previewMode.hide();
        this.$editMode.show();

        this.ace = new ace.edit('editor');
        var mode = ace.require('ace/mode/markdown').Mode;
        this.ace.getSession().setMode(new mode());
        this.ace.getSession().setUseWrapMode(true);
        this.ace.setShowPrintMargin(false);
        this.ace.setTheme('ace/theme/dillinger');
        this.ace.renderer.setShowGutter(false);
        this.ace.setHighlightActiveLine(false);
        this.ace.setValue(this.text, -1);
        this.ace.on('change', (function () {}).bind(this));
      }
    }
  }, {
    key: 'load',
    value: function load() {
      this.text = this.app.storage.getItem('text');

      if (this.text == null) this.text = '';
    }
  }, {
    key: 'save',
    value: function save() {
      var _this = this;

      if (this.previewMode) {

        var index = 0;
        var text = '';

        this.$previewMode.find('.content > *').each(function (i, e) {
          var $e = $(e);

          switch ($e.get(0).tagName) {
            case 'H1':
              text += '#' + $e.text() + '\n\n';
              break;
            case 'H2':
              text += '##' + $e.text() + '\n\n';
              break;
            case 'H3':
              text += '###' + $e.text() + '\n\n';
              break;
            case 'H4':
              text += '####' + $e.text() + '\n\n';
              break;
            case 'H5':
              text += '#####' + $e.text() + '\n\n';
              break;
            case 'H6':
              text += '######' + $e.text() + '\n\n';
              break;
            case 'P':
              text += '' + $e.text() + '\n\n';
              break;
            case 'UL':
              $e.find('li').each(function (ii, el) {
                text += '* ' + $(el).text() + '\n';
              });
              text += '\n';
              break;
            case 'DIV':

              if ($e.hasClass('placeholder')) {
                var gridster = _this.placeholders[index].gridster;
                var data = gridster.serialize();
                console.log(data);
                if (data.length > 0) text += '[PLACEHOLDER-' + _this.placeholders[index].guid + ']\n\n';
                index++;
              }

              break;
          }

          _this.text = text;
        });

        this.app.storage.setItem('text', this.text);
      } else {
        this.text = this.ace.getValue();
        this.app.storage.setItem('text', this.text);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (this.previewMode) {

        var html = $('<div />');

        var elements = $(marked(this.text));
        var elements2 = [];

        for (var i = 0; i < elements.length; i++) {
          if (elements[i].nodeType != 1) continue;
          if (i == 0) {
            elements2.push(document.createElement('p'));
          }
          elements2.push(elements[i]);
        }

        elements = elements2;

        for (var i = 0; i < elements.length; i++) {
          if (elements[i].nodeType != 1) continue;

          var match,
              placeholder = null,
              regex = /\[PLACEHOLDER-([a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})\]/g;

          if (elements[i].tagName == 'P' && (match = regex.exec(elements[i].textContent)) != null) {} else {

            html.append(elements[i]);

            var next = i + 1 < elements.length ? elements[i + 1] : null;
            if (next != null && next.tagName == 'P' && (match = regex.exec(next.textContent)) != null) {
              placeholder = new _PhotoPlaceholderJs2['default'](this, match[1]);
            } else {
              placeholder = new _PhotoPlaceholderJs2['default'](this);
            }

            if (placeholder != null) {

              html.append(placeholder.$placeholder);
              placeholder.on('change', function () {
                return _this2.save();
              });
              this.placeholders.push(placeholder);
            }
          }
        }
        this.$previewMode.find('.content').html(html.get(0).childNodes);
        var start = window.performance.now();

        this.placeholders.map(function (placeholder) {
          return placeholder.render();
        });

        var end = window.performance.now();
        console.log('render: ' + (end - start));
      }
    }
  }]);

  return Editor;
})();

exports['default'] = Editor;
module.exports = exports['default'];

},{"./PhotoPlaceholder.js":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Help = (function () {
  function Help(app) {
    _classCallCheck(this, Help);

    this.app = app;
    this.$el = app.$el.find('section.help');
    this.$steps = this.$el.find('.help-step');

    this.$el.find('button').on('click', this.click.bind(this));
  }

  _createClass(Help, [{
    key: 'goto',
    value: function goto(step) {
      if (step > 0) {
        this.$steps.hide();
        this.$steps[step - 1].style.display = 'block';
      }
    }
  }, {
    key: 'click',
    value: function click(event) {
      var step = parseInt(event.target.getAttribute('data-goto-step')) || 0;
      this.goto(step);
    }
  }, {
    key: 'visible',
    get: function () {
      return this.$el.is(':visible');
    }
  }, {
    key: 'show',
    value: function show() {
      this.$el.show();
      this.goto(1);
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.$el.hide();
    }
  }]);

  return Help;
})();

exports['default'] = Help;
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.PhotoList = PhotoList;
exports.PhotoListItem = PhotoListItem;

function PhotoList($list, $scrollbar) {

  $list.sly(false);

  var options = {
    horizontal: 1,
    itemNav: 'basic',
    smart: 1,
    activateOn: 'click',
    mouseDragging: 0,
    touchDragging: 0,
    releaseSwing: 1,
    startAt: 0,
    scrollBar: $scrollbar,
    scrollBy: 1,
    speed: 300,
    elasticBounds: 1,
    easing: 'easeOutExpo',
    dragHandle: 1,
    dynamicHandle: 1,
    clickBar: 1
  };

  var sly = new Sly($list, options);
  sly.on('load move', function () {
    var start = this.rel.firstItem - 1;
    var end = this.rel.lastItem + 1;

    for (var i = start; i < end; i++) {
      if (!this.items[i] || this.items[i].lazyLoaded) continue;
      this.items[i].lazyLoaded = true;
      this.items[i].el.style.backgroundImage = 'url(\'' + this.items[i].el.getAttribute('data-src') + '\')';
    }
  });
  sly.init();
}

function PhotoListItem($list, data) {
  var $item = $('<li data-src=\'' + data.previews.thumbnail_preview.small_url + '\'></li>');
  $item.attr('data-id', data.id);

  $item.draggable({
    helper: 'clone',
    rever: true,
    appendTo: document.body,
    start: function start() {
      $('.placeholder ul').addClass('edit');
    },
    stop: function stop() {}
  });

  $list.append($item);
}

//$('.placeholder ul').removeClass('edit')

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _dataEnvatoJs = require('../data/Envato.js');

var _dataEnvatoJs2 = _interopRequireDefault(_dataEnvatoJs);

var _utilsGuidJs = require('../utils/Guid.js');

var _utilsGuidJs2 = _interopRequireDefault(_utilsGuidJs);

var Photo = (function () {
  function Photo(id, placeholder) {
    _classCallCheck(this, Photo);

    this.id = id;
    this.placeholder = placeholder;
    this.imageUrl = '';
    this.itemUrl = '';

    var photoTemplate = '\n        <li class="photo">\n          <img class="loading" src="static/images/loading3.gif" alt="loading">\n          <span class="control control-resize"><i class="fa fa-expand fa-flip-vertical"></i></span>\n          <span class="control control-remove"><i class="fa fa-trash"></i></span>\n          <span class="control control-info"><i class="fa fa-external-link"></i></span>\n        </li>';

    this.$photo = $(photoTemplate);
    this.$photo.find('.control-remove').on('click', this.remove.bind(this));
    this.$photo.find('.control-info').on('click', this.goToItem.bind(this));
  }

  _createClass(Photo, [{
    key: 'render',
    value: function render() {

      if (this.imageUrl == '') return;

      this.$photo.attr('data-img', this.imageUrl);
      this.$photo.attr('data-id', this.id);
      this.$photo.attr('data-url', this.itemUrl);
      this.$photo.find('img.loading').remove();
      this.$photo.css({
        'backgroundImage': 'url(\'' + this.imageUrl + '\')',
        'backgroundSize': 'cover',
        'backgroundPosition': 'center center'
      });
    }
  }, {
    key: 'remove',
    value: function remove(event) {
      var _this = this;

      this.placeholder.gridster.remove_widget(this.$photo, function () {
        if (_this.placeholder.gridster.$widgets.length == 0) _this.placeholder.gridster.$el.css('height', 'auto');
      });

      this.placeholder.save();
    }
  }, {
    key: 'goToItem',
    value: function goToItem() {
      var win = window.open('' + this.itemUrl + '?ref=Junglist', '_blank');
      win.focus();
    }
  }], [{
    key: 'createNew',
    value: function createNew(id, placeholder) {
      var photo = new Photo(id, placeholder);
      photo.placeholder.gridster.add_widget(photo.$photo, 1, 1);

      new _dataEnvatoJs2['default']().item(photo.id, function (data) {
        $('<img />').attr('src', data.item.live_preview_url).load(function () {
          photo.imageUrl = data.item.live_preview_url;
          photo.itemUrl = data.item.url;
          photo.render();
          photo.placeholder.save();
        });
      });

      return photo;
    }
  }, {
    key: 'restore',
    value: function restore(data, placeholder) {

      var photo = new Photo(data.id, placeholder);

      setTimeout(function () {
        placeholder.gridster.add_widget(photo.$photo, data.size_x, data.size_y, data.col, data.row);
        photo.imageUrl = data.img;
        photo.itemUrl = data.url;
        $('<img />').attr('src', photo.imageUrl).load(function () {
          photo.render();
        });
      }, 100);
    }
  }]);

  return Photo;
})();

var PhotoPlaceholder = (function () {
  function PhotoPlaceholder(editor) {
    var guid = arguments[1] === undefined ? null : arguments[1];

    _classCallCheck(this, PhotoPlaceholder);

    this.editor = editor;
    this.guid = guid == null ? (0, _utilsGuidJs2['default'])() : guid;

    this.$placeholder = $('<div class="placeholder gridster no-transitions"><ul></ul></div>');
  }

  _createClass(PhotoPlaceholder, [{
    key: 'over',
    value: function over(event, ui) {
      this.$placeholder.find('ul').addClass('over');
    }
  }, {
    key: 'out',
    value: function out(event, ui) {
      this.$placeholder.find('ul').removeClass('over');
    }
  }, {
    key: 'drop',
    value: function drop(event, ui) {

      Photo.createNew(parseInt(ui.draggable.attr('data-id')), this);
      this.$placeholder.find('ul').removeClass('over');
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      this.gridster = this.$placeholder.find('ul').gridster({
        widget_margins: [5, 5],
        widget_base_dimensions: [90, 90],
        autogenerate_stylesheet: false,
        min_cols: 8,
        min_rows: 20,
        resize: {
          enabled: true,
          max_size: [8, 50],
          min_size: [1, 1],
          handle_class: 'control-resize',
          stop: function stop() {
            return _this2.save();
          }
        },
        serialize_params: function serialize_params(e, wgd) {
          return {
            col: wgd.col,
            row: wgd.row,
            size_x: wgd.size_x,
            size_y: wgd.size_y,
            img: $(e).attr('data-img'),
            id: $(e).attr('data-id'),
            url: $(e).attr('data-url')
          };
        },
        draggable: {
          stop: function stop() {
            return _this2.save();
          }
        }
      }).data('gridster');

      this.$placeholder.droppable({
        drop: this.drop.bind(this),
        over: this.over.bind(this),
        out: this.out.bind(this)
      });

      if (!window.generated) {
        this.gridster.generate_stylesheet({ rows: 20, cols: 6 });
        window.generated = true;
      }

      var data = this.editor.app.storage.getItem('placeholder-' + this.guid);

      if (data != null) {
        data = Gridster.sort_by_row_and_col_asc(JSON.parse(data));
        data.map(function (item) {
          Photo.restore(item, _this2);
        });
      }

      setTimeout(function () {
        _this2.$placeholder.removeClass('no-transitions');
      }, 1000);
    }
  }, {
    key: 'save',
    value: function save() {

      var key = 'placeholder-' + this.guid;
      var photos = this.gridster.serialize();

      if (photos.length == 0) this.editor.app.storage.removeItem(key);else this.editor.app.storage.setItem(key, JSON.stringify(photos));

      this.notify('change', null);
    }
  }, {
    key: 'on',
    value: function on(eventType, cb) {
      this['_on' + eventType] = cb;
    }
  }, {
    key: 'notify',
    value: function notify(eventType, s) {
      if (this['_on' + eventType]) {
        this['_on' + eventType](s);
      }
    }
  }]);

  return PhotoPlaceholder;
})();

exports['default'] = PhotoPlaceholder;
module.exports = exports['default'];

},{"../data/Envato.js":9,"../utils/Guid.js":11}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _dataEnvatoJs = require('../data/Envato.js');

var _dataEnvatoJs2 = _interopRequireDefault(_dataEnvatoJs);

var _SearchInputJs = require('./SearchInput.js');

var _SearchInputJs2 = _interopRequireDefault(_SearchInputJs);

var _SearchResultsJs = require('./SearchResults.js');

var _SearchResultsJs2 = _interopRequireDefault(_SearchResultsJs);

var Search = (function () {
  function Search(app) {
    _classCallCheck(this, Search);

    this.app = app;
    this.$el = app.$el.find('.search');

    this.input = new _SearchInputJs2['default'](this);
    this.results = null;
    this.envato = new _dataEnvatoJs2['default']();

    this.state = {
      busy: false
    };
  }

  _createClass(Search, [{
    key: 'busy',
    get: function () {
      return this.state.busy;
    },
    set: function (value) {
      this.state.busy = value;
      this.input.busy = value;
    }
  }, {
    key: 'submit',
    value: function submit(term) {
      var _this = this;

      if (this.busy) return;

      this.busy = true;

      this.envato.search(term, function (response) {

        _this.results = new _SearchResultsJs2['default'](response.matches, response.total_hits, _this);
        _this.busy = false;
      });
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.input.hide();
      if (this.results != null) this.results.close();
    }
  }, {
    key: 'show',
    value: function show() {
      this.input.show();
    }
  }]);

  return Search;
})();

exports['default'] = Search;
module.exports = exports['default'];

},{"../data/Envato.js":9,"./SearchInput.js":7,"./SearchResults.js":8}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _dataEnvatoJs = require('../data/Envato.js');

var _dataEnvatoJs2 = _interopRequireDefault(_dataEnvatoJs);

var SearchInput = (function () {
  function SearchInput(search) {
    _classCallCheck(this, SearchInput);

    this.search = search;
    this.$el = search.$el;
    this.$text = this.$el.find('#search-text');
    this.$button = this.$el.find('#search-button');
    this.$loading = this.$el.find('.loading');

    this.$text.on('keypress', this.onKeyPress.bind(this));
    this.$button.on('click', this.onClick.bind(this));
  }

  _createClass(SearchInput, [{
    key: 'isValid',
    get: function () {
      return this.$text.val().length > 0;
    }
  }, {
    key: 'onKeyPress',
    value: function onKeyPress(event) {

      if (this.search.busy || !this.isValid || event.keyCode != 13) return;
      this.search.submit(this.$text.val());
    }
  }, {
    key: 'onClick',
    value: function onClick() {
      if (this.search.busy || !this.isValid) return;

      this.search.submit(this.$text.val());
    }
  }, {
    key: 'busy',
    set: function (busy) {
      if (busy) {
        this.$button.hide();
        this.$loading.show();
      } else {
        this.$loading.hide();
        this.$button.show();
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.$text.val('');
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.$el.hide();
    }
  }, {
    key: 'show',
    value: function show() {
      this.$el.show();
    }
  }]);

  return SearchInput;
})();

exports['default'] = SearchInput;
module.exports = exports['default'];

},{"../data/Envato.js":9}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _PhotoListJs = require('./PhotoList.js');

var SearchResults = (function () {
  function SearchResults(items, total, search) {
    _classCallCheck(this, SearchResults);

    this.items = items;
    this.total = total;
    this.search = search;
    this.$results = $('#search-results');
    this.$resultsNotFound = $('#search-results-not-found');
    this.$list = this.$results.find('ul');
    this.$scrollbar = this.$results.find('div.scrollbar');
    this.$photosFound = this.$results.find('.photos-found');
    this.$close = this.$results.find('.close');

    this.$close.on('click', this.close.bind(this));

    this.reset();
    this.render();
  }

  _createClass(SearchResults, [{
    key: 'reset',
    value: function reset() {
      this.$results.slideUp(100);
      this.$resultsNotFound.slideUp(100);
      this.$photosFound.empty();
      this.$list.empty();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      if (this.total > 0) {

        this.$results.slideDown();

        this.items.map(function (item) {
          return (0, _PhotoListJs.PhotoListItem)(_this.$list, item);
        });
        (0, _PhotoListJs.PhotoList)(this.$list.parent(), this.$scrollbar);

        this.$photosFound.html('' + this.total + ' Stock Photos & Images');
        $('.placeholder ul').addClass('edit');
        $('main.editor').addClass('search-results-active');
      } else {
        this.$resultsNotFound.slideDown();
      }
    }
  }, {
    key: 'close',
    value: function close() {
      this.$results.hide();
      this.search.input.reset();
      $('.placeholder ul').removeClass('edit');
      $('main.editor').removeClass('search-results-active');
    }
  }]);

  return SearchResults;
})();

exports['default'] = SearchResults;
module.exports = exports['default'];

},{"./PhotoList.js":4}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Envato = (function () {
  function Envato() {
    _classCallCheck(this, Envato);

    this.apiKey = "EEfrtvfncCFw4SJP6kuaXEkjA6XCtuGo";
    this.apiEndpoint = "https://api.envato.com/v1/";
  }

  _createClass(Envato, [{
    key: "req",
    value: function req(resource, data, _success) {

      var key = this.apiKey;

      $.ajax({
        url: "" + this.apiEndpoint + "" + resource,
        dataType: "json",
        data: data,
        beforeSend: function beforeSend(request) {
          request.setRequestHeader("Authorization", "Bearer " + key);
        },
        headers: {
          "Authorization": "Bearer " + key
        },
        success: function success(data, status) {
          if (typeof _success == "function") _success(data, status);
        }
      });
    }
  }, {
    key: "search",
    value: function search(term, callback) {

      this.req("discovery/search/search/item", { term: term, site: "photodune.net", page_size: 200 }, function (data) {
        if (typeof callback == "function") callback(data);
      });
    }
  }, {
    key: "item",
    value: function item(id, callback) {
      this.req("market/item:" + id + ".json", {}, function (data) {
        if (typeof callback == "function") callback(data);
      });
    }
  }]);

  return Envato;
})();

exports["default"] = Envato;
module.exports = exports["default"];

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Storage = (function () {
  function Storage() {
    _classCallCheck(this, Storage);

    this.backend = window.localStorage;
  }

  _createClass(Storage, [{
    key: 'getItem',
    value: function getItem(name) {
      return this.backend.getItem(name);
    }
  }, {
    key: 'setItem',
    value: function setItem(name, value) {
      this.backend.setItem(name, value);
    }
  }, {
    key: 'removeItem',
    value: function removeItem(name) {
      this.backend.removeItem(name);
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.backend.clear();
    }
  }, {
    key: 'load',
    value: function load(name, callback) {
      var _this = this;

      $.ajax({
        url: 'static/data/' + name + '.json',
        success: function success(response) {
          _this.setItem('text', response.text);
          response.placeholders.map(function (p) {
            _this.setItem('placeholder-' + p.name, JSON.stringify(p.items));
          });

          if (typeof callback == 'function') callback();
        }
      });
    }
  }, {
    key: 'isTextEmpty',
    get: function () {
      var text = this.backend.getItem('text');
      return text == null || text == '';
    }
  }]);

  return Storage;
})();

exports['default'] = Storage;
module.exports = exports['default'];

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = createGuid;

function createGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : r & 3 | 8;
    return v.toString(16);
  });
}

module.exports = exports['default'];

},{}]},{},[1]);
