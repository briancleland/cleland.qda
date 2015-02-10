define(function (require, exports, module) {
  'use strict';
  var
    CommandManager = brackets.getModule("command/CommandManager"),
    Commands = brackets.getModule("command/Commands"),
    DocumentManager = brackets.getModule("document/DocumentManager"),
    PanelManager = brackets.getModule("view/PanelManager"),
    KeyBindingManager = brackets.getModule("command/KeyBindingManager"),
    LanguageManager = brackets.getModule("language/LanguageManager"),
    ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
    Menus = brackets.getModule("command/Menus"),
    AppInit = brackets.getModule("utils/AppInit"),
    NativeApp = brackets.getModule("utils/NativeApp");

  var CodeMirror = brackets.getModule("thirdparty/CodeMirror2/lib/codemirror");
  var SimpleMode = require("lib/codemirror/simple");

  var DO_HASHTAGS = "findHashtags.run";
  var panelHtml = require("text!html/panel.html");
  var panel;

  require("lib/qdaSimpleMode");
  require("lib/jqtree/tree.jquery");
  var _tree = require("lib/tree");
  var _find = require("lib/find");

  function _qdaBrowser() {
    if (panel.isVisible()) {
      panel.hide();
    } else {
      panel.show();
      _find.hashtags();
    }
  }
  
  CommandManager.register("Find Hashtags", DO_HASHTAGS, _qdaBrowser);

  AppInit.appReady(function () {
    var viewMenu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
    viewMenu.addMenuItem(DO_HASHTAGS);
    ExtensionUtils.loadStyleSheet(module, "css/qda.css");
    ExtensionUtils.loadStyleSheet(module, "lib/jqtree/jqtree.css");
    ExtensionUtils.loadStyleSheet(module, "css/font-awesome/css/font-awesome.min.css");
    panel = PanelManager.createBottomPanel(DO_HASHTAGS, $(panelHtml), 300);
    $("#snippets-panel-close").click(function () {
      panel.hide();
    });
    // Create and configure QDA Codemmirror mode
    CodeMirror.defineSimpleMode("qda", qdaSimpleMode);
    CodeMirror.defineMIME("text/x-qda", "qda");
    var lang = LanguageManager.getLanguage("markdown");
    lang.removeFileExtension("md");
    LanguageManager.defineLanguage("qda", {
      name: "QDA",
      mode: "qda",
      fileExtensions: ["md", "qd", "qda"],
      blockComment: ["{-", "-}"],
      lineComment: ["--"]
    });
    // Init jqtree
    _tree.init();
  });


});