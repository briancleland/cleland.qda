define(function (require, exports, module) {

  var
    CommandManager = brackets.getModule("command/CommandManager"),
    Commands = brackets.getModule("command/Commands"),
    EditorManager = brackets.getModule("editor/EditorManager"),
    ProjectManager = brackets.getModule("project/ProjectManager"),
    FileFilters = brackets.getModule("search/FileFilters"),
    FileUtils = brackets.getModule("file/FileUtils"),
    FindInFiles = brackets.getModule("search/FindInFiles");

  var
    _tree = require("lib/tree"),
    markedText;

  function openFile(path, startCh, startLine, endCh, endLine) {
    CommandManager.execute(Commands.CMD_ADD_TO_WORKINGSET_AND_OPEN, {
      fullPath: path
    });
    var editor = EditorManager.getCurrentFullEditor();
    editor.setCursorPos({
      line: startLine - 1,
      ch: startCh
    })
    editor.centerOnCursor();
    if (markedText) {
      markedText.clear();
    }
    markedText = editor._codeMirror.markText({
      line: startLine - 1,
      ch: startCh
    }, {
      line: endLine - 1,
      ch: endCh
    }, {
      className: "highlighted"
    });
  }

  function snippets(tagName) {
    var queryInfo = {
      query: "(\"|\\*)([^\"\\*]*)(\"|\\*)\\s+(#\\w+\\s+)*(" + tagName + ")\\s",
      caseSensitive: false,
      isRegexp: true
    };
    var scope = ProjectManager.getProjectRoot();
    var basePath = ProjectManager.getInitialProjectPath();
    FindInFiles.doSearchInScope(queryInfo, scope).then(function (results) {
      var output = "";
      for (var path in results) {
        var filename = path.split("/").pop();
        if (results.hasOwnProperty(path)) {
          output += "<li><div class='filename'>" + filename + "</div>";
          var relativePath = FileUtils.getRelativeFilename(basePath, path);
          output += "<div class='path'>" + relativePath + "</div>";
          var matches = results[path]["matches"];
          for (var i = 0; i < matches.length; i++) {
            var startCh = matches[i]["start"]["ch"];
            var startLine = matches[i]["start"]["line"] + 1;
            var endCh = matches[i]["end"]["ch"];
            var endLine = matches[i]["end"]["line"] + 1;
            var text = matches[i]["line"];
            output += "<div class='snippet-text' ";
            output += "data-path='" + path + "' ";
            output += "data-start-ch='" + startCh + "' ";
            output += "data-start-line='" + startLine + "' ";
            output += "data-end-ch='" + endCh + "' ";
            output += "data-end-line='" + endLine + "'>";
            output += "<span class='line-number'>" + startLine + ":</span> " + text + "</div>";
          }
          output += "</li>";
        }
      }
      $("#snippets").html(output);
      $('#filter-text').fastLiveFilter('#snippets');
      $(".snippet-text").click(function () {
        console.log(path);
        $(".snippet-text").removeClass("selected");
        $(this).addClass("selected");
        var path = $(this).data("path");
        var startCh = $(this).data("startCh");
        var startLine = $(this).data("startLine");
        var endCh = $(this).data("endCh");
        var endLine = $(this).data("endLine");
        openFile(path, startCh, startLine, endCh, endLine);
      })
    }, function (err) {
      console.log(err);
    });
  }
  
  function results(regex) {
    var queryInfo = {
      query: regex,
      caseSensitive: false,
      isRegexp: true
    };
    var scope = ProjectManager.getProjectRoot();
    var basePath = ProjectManager.getInitialProjectPath();
    FindInFiles.doSearchInScope(queryInfo, scope).then(function (results) {
      var output = "";
      for (var path in results) {
        var filename = path.split("/").pop();
        if (results.hasOwnProperty(path)) {
          output += "<li><div class='filename'>" + filename + "</div>";
          var relativePath = FileUtils.getRelativeFilename(basePath, path);
          output += "<div class='path'>" + relativePath + "</div>";
          var matches = results[path]["matches"];
          for (var i = 0; i < matches.length; i++) {
            var startCh = matches[i]["start"]["ch"];
            var startLine = matches[i]["start"]["line"] + 1;
            var endCh = matches[i]["end"]["ch"];
            var endLine = matches[i]["end"]["line"] + 1;
            var text = matches[i]["line"];
            output += "<div class='snippet-text' ";
            output += "data-path='" + path + "' ";
            output += "data-start-ch='" + startCh + "' ";
            output += "data-start-line='" + startLine + "' ";
            output += "data-end-ch='" + endCh + "' ";
            output += "data-end-line='" + endLine + "'>";
            output += "<span class='line-number'>" + startLine + ":</span> " + text + "</div>";
          }
        output += "</li>";
        }
      }
      $("#snippets").html(output);
      $('#filter-text').fastLiveFilter('#snippets');
      $(".snippet-text").click(function () {
        console.log(path);
        $(".snippet-text").removeClass("selected");
        $(this).addClass("selected");
        var path = $(this).data("path");
        var startCh = $(this).data("startCh");
        var startLine = $(this).data("startLine");
        var endCh = $(this).data("endCh");
        var endLine = $(this).data("endLine");
        openFile(path, startCh, startLine, endCh, endLine);
      })
    }, function (err) {
      console.log(err);
    });
  }

  function hashtags() {
    var queryInfo = {
      //      query: "\\*|\"([^\\*]*)\\*|\"((\\s+#\\w+)+)",
      query: "(\"|\\*)([^\"\\*]*)(\"|\\*)((\\s+#\\w+)+)",
      // NEED TO MAKE SURE GETTING ALL TAGS, NOT JUST FIRST ONE
      caseSensitive: false,
      isRegexp: true
    };
    var scope = ProjectManager.getProjectRoot();
    console.log("SCOPE:", scope); 
    FindInFiles.doSearchInScope(queryInfo, scope).then(function (results) {
      var tagCounts = {};
      for (var filename in results) { // for each file
        if (results.hasOwnProperty(filename)) {
          var matches = results[filename]["matches"];
          console.log("MATCHES:", matches);
          for (var i = 0; i < matches.length; i++) { // for each match
            var allTags = matches[i]["result"][4];
            var tagNames = allTags.match(/\S+/g);
            for (var j = 0; j < tagNames.length; j++) { // for each tagName
              var tagName = tagNames[j];
              if (tagCounts.hasOwnProperty(tagName)) {
                tagCounts[tagName] = tagCounts[tagName] + 1;
              } else {
                tagCounts[tagName] = 1;
              } //end if tagCounts
            } // end for tagNames
          }
        }
      }
      _tree.updateTags(tagCounts);
    }, function (err) {
      console.log(err);
    });
  }

  exports.snippets = snippets;
  exports.results = results;
  exports.hashtags = hashtags;

});