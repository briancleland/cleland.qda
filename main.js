define(function (require, exports, module) {
  'use strict';
  var
    CommandManager = brackets.getModule("command/CommandManager"),
    Commands = brackets.getModule("command/Commands"),
    DocumentManager = brackets.getModule("document/DocumentManager"),
    ProjectManager = brackets.getModule("project/ProjectManager"),
    EditorManager = brackets.getModule("editor/EditorManager"),
    PanelManager = brackets.getModule("view/PanelManager"),
    KeyBindingManager = brackets.getModule("command/KeyBindingManager"),
    LanguageManager = brackets.getModule("language/LanguageManager"),
    ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
    Menus = brackets.getModule("command/Menus"),
    AppInit = brackets.getModule("utils/AppInit"),
    NativeApp = brackets.getModule("utils/NativeApp");

  var CodeMirror = brackets.getModule("thirdparty/CodeMirror2/lib/codemirror");
  var SimpleMode = require("lib/codemirror/simple");

  var DO_BOLD = "cleland.qda.boldText";
  var DO_ITALIC = "cleland.qda.italicText";
  var DO_QDA = "qda.run";
  var panelHtml = require("text!html/panel.html");
  var panel;

  require("lib/qdaSimpleMode");
  require("lib/qdaHint");
  require("lib/jquery.fastLiveFilter");
  require("lib/jqtree/tree.jquery");
  var _tree = require("lib/tree");
  var _find = require("lib/find");

  function _qdaBrowser() {
    if (panel.isVisible()) {
      panel.hide();
    } else {
      panel.show();
      _tree.init();
//      _find.hashtags();
    }
  }

  function boldText() {
    var currentDoc = DocumentManager.getCurrentDocument();
    var editor = EditorManager.getCurrentFullEditor();
    var text = editor.getSelectedText();
    var selection = editor.getSelection();
    currentDoc.replaceRange("**" + text + "**", selection.start, selection.end);
  }

  function italicText() {
    var currentDoc = DocumentManager.getCurrentDocument();
    var editor = EditorManager.getCurrentFullEditor();
    var text = editor.getSelectedText();
    var selection = editor.getSelection();
    currentDoc.replaceRange("*" + text + "*", selection.start, selection.end);
  }

  CommandManager.register("QDA Browser", DO_QDA, _qdaBrowser);
  CommandManager.register("Bold Text", DO_BOLD, boldText);
  CommandManager.register("Italic Text", DO_ITALIC, italicText);

  AppInit.appReady(function () {
    var viewMenu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
    viewMenu.addMenuItem(DO_QDA);
    KeyBindingManager.removeBinding("Cmd-B");
    KeyBindingManager.removeBinding("Cmd-I");
    KeyBindingManager.addBinding(DO_BOLD, {
      key: "Cmd-B",
      displayKey: "Cmd-B"
    });
    KeyBindingManager.addBinding(DO_ITALIC, {
      key: "Cmd-I",
      displayKey: "Cmd-I"
    });
    ExtensionUtils.loadStyleSheet(module, "css/qda.css");
    ExtensionUtils.loadStyleSheet(module, "lib/jqtree/jqtree.css");
    ExtensionUtils.loadStyleSheet(module, "css/font-awesome/css/font-awesome.min.css");
    panel = PanelManager.createBottomPanel(DO_QDA, $(panelHtml), 300);
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
    ProjectManager.on("projectOpen", function() { 
      _tree.init() 
    });
    DocumentManager.on('documentSaved', function() { 
      _tree.init()
    }); 
  });


});