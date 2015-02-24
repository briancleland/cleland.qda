# Code for marking text in Brackets

> var EditorManager = brackets.getModule("editor/EditorManager")
> var editor = EditorManager.getActiveEditor()
> var markedText = editor._codeMirror.markText({line:0, ch:3}, {line:1, ch:20}, { className: "cm-string" })
> markedText.clear()

https://kleverlogs.wordpress.com/tag/brackets/
http://codemirror.net/doc/manual.html#api_marker