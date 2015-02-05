define(function (require, exports, module) {

  var _find = require("lib/find");
  var $tree;

  ///////////////////////////////////////////////////////////////////////////////////

  function addGroup() {
    var treeData = JSON.parse(treeJson());
    treeData.unshift({
      label: 'new_group',
      type: 'group'
    });
    $tree.tree('loadData', treeData);
    saveTree();
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
    localStorage.tree = $tree.tree('toJson');
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

  function rename(node) {
    var new_name = prompt("Please enter the new group name", node.name);
    if (new_name != null) {
      $tree.tree('updateNode', node, new_name);
      saveTree();
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////

  function init() {
    require("lib/jqTreeContextMenu");
    $tree = $("#tree");
    if (localStorage.tree) {
      treeData = JSON.parse(localStorage.tree);
    } else {
      treeData = [];
    }
    $tree.tree({
      data: treeData,
      dragAndDrop: true,
      onCreateLi: function (node, $li) {
        // Add 'icon' span before title
        if (node.type == "group") {
          $li.find('.jqtree-title').before('<span class="folder-icon"></span>');
          $li.find('.jqtree-title').addClass("tag-group");
        } else {
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
    $("#add-node-button").click(function () {
      addGroup()
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
    // Find snippets when tag node is clicked
    $tree.bind(
      'tree.click',
      function (event) {
        if (event.node.type == "tag") {
          _find.snippets(event.node.name.split(" ")[0]);
        }
      }
    );
    // Init the contextmenu
    $tree.jqTreeContextMenu($('#contextMenu'), {
      "edit": function (node) {
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
  exports.treeJson = treeJson;

});