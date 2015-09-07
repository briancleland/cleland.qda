define(function (require, exports, module) {

  var
    ProjectManager = brackets.getModule("project/ProjectManager"),
    FileSystem = brackets.getModule("filesystem/FileSystem");
  //    AppshellFileSystem = brackets.getModule("filesystem/impls/appshell/AppshellFileSystem");

  var $tree;
  var _find = require("lib/find");
  var dataFile;

  ///////////////////////////////////////////////////////////////////////////////////

  function addGroup() {
    var treeData = JSON.parse(treeJson());
    treeData.unshift({
      label: 'New group',
      type: 'group'
    });
    $tree.tree('loadData', treeData);
    saveTree();
  }

  ///////////////////////////////////////////////////////////////////////////////////

  function addSearch() {
    var treeData = JSON.parse(treeJson());
    treeData.unshift({
      label: 'New search',
      type: 'search'
    });
    $tree.tree('loadData', treeData);
    saveTree();
  }

  ///////////////////////////////////////////////////////////////////////////////////

  function addFilter() {
    var filter = $("#add-filter-button").data("filter");
    var new_filter = prompt("Enter filter string", filter);
    $("#add-filter-button").data("filter", new_filter);
  }

  ///////////////////////////////////////////////////////////////////////////////////

  function addTag(tagName, tagCount) {
    var treeData = JSON.parse(treeJson());
    treeData.unshift({
      label: tagName,
      type: 'tag',
      count: tagCount
    });
    $tree.tree('loadData', treeData);
    saveTree();
  }

  ///////////////////////////////////////////////////////////////////////////////////

  function updateTags(tagCounts) {
    for (var tagName in tagCounts) {
      var tagCount = tagCounts[tagName];
      var node = $tree.tree("getNodeByName", tagName)
      if (node) {
        $tree.tree(
          'updateNode',
          node, {
            label: tagName,
            type: "tag",
            count: tagCount
          }
        );
      } else {
        addTag(tagName, tagCount);
      }
    }
    saveTree();
    $tree.tree("reload"); // reload tree to update tag counts
  }

  ///////////////////////////////////////////////////////////////////////////////////


  function saveTree() {
    dataFile.write(treeJson());
  }

  ///////////////////////////////////////////////////////////////////////////////////

  function treeJson() {
    var treeData = $tree.tree('toJson');
    if (treeData) {
      return treeData;
    } else {
      return [];
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////

  function editRegex(node) {
    var new_regex = prompt("Please enter the new regex", node.regex);
    if (new_regex != null) {
      $tree.tree( 'updateNode', node, { regex: new_regex } );
      saveTree();
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////

  function rename(node) {
    var new_name = prompt("Please enter the new group name", node.name);
    if (new_name != null) {
      $tree.tree('updateNode', node, new_name);
      saveTree();
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////

  function createTree() {
    dataFile.read(function (err, data) {
      console.log(err);
      console.log(".treeData:", JSON.parse(data));
      $tree.tree({
        data: JSON.parse(data),
        dragAndDrop: true,
        onCreateLi: function (node, $li) {
          if (node.type == "group") {
            //$li.find('.jqtree-title').prepend('<i class="fa fa-folder"></i>');
            $li.find('.jqtree-title').addClass("tag-group");
            $li.find('.jqtree-title').after('<span class="tag-count">(' + node.children.length + ')</span>');
          } else if (node.type == "search") {
            $li.find('.jqtree-title').prepend('<i class="fa fa-question-circle"></i>');
            $li.find('.jqtree-title').addClass("search");
          } else {
            $li.find('.jqtree-title').prepend('<i class="fa fa-tag"></i>');
            $li.find('.jqtree-title').addClass("tag");
            $li.find('.jqtree-title').after('<span class="tag-count">(' + node.count + ')</span>');
          }
        },
        onCanMoveTo: function (moved_node, target_node, position) {
          if (target_node.type == 'tag' && position == 'inside') {
            return false;
          } else {
            return true;
          }
        }
      });
      _find.hashtags();
    });
  }

  ///////////////////////////////////////////////////////////////////////////////////

  function init() {
    $("#tree-holder").html("<div id='tree'><div>");
    $tree = $("#tree");
    require("lib/jqTreeContextMenu");
    var projectPath = ProjectManager.getInitialProjectPath();
    console.log("projectPath: " + projectPath);
    FileSystem.resolve(projectPath + ".treedata", function (err, file) {
      if (file) {
        dataFile = file;
        createTree();
      } else {
        dataFile = FileSystem.getFileForPath(projectPath + ".treedata");
        dataFile.write("[]", function(){
          createTree();
        });
      }
    });
    $("#add-group-button").click(function () {
      addGroup()
    });
    $("#add-search-button").click(function () {
      addSearch()
    });
    $("#add-filter-button").click(function () {
      addFilter()
    });
    // Save the tree when a node is moved
    $tree.bind(
      'tree.move',
      function (event) {
        // move first, _then_ save
        event.preventDefault();
        event.move_info.do_move();
        saveTree();
      }
    );
    // Save the tree when a node is opened or closed
    $tree.bind(
      'tree.open tree.close',
      function (event) {
        saveTree();
      }
    );
    // Find snippets when tag node is clicked
    $tree.bind(
      'tree.click',
      function (event) {
        if (event.node.type == "tag") {
          _find.snippets(event.node.name.split(" ")[0]);
        } else if (event.node.type == "search") {
          console.log("REGEX:", event.node.regex);
          _find.results(event.node.regex);
        }
      }
    );
    // Init the contextmenu
    $tree.jqTreeContextMenu($('#contextMenu'), {
      "edit": function (node) {
        editRegex(node);
        saveTree();
      },
      "rename": function (node) {
        rename(node);
        saveTree();
      },
      "delete": function (node) {
        if (confirm('Are you sure you want to delete this node?')) {
          $tree.tree('removeNode', node);
          saveTree();
        }
      }
    });
  };

  exports.init = init;
  exports.updateTags = updateTags;

});