var qdaSimpleMode = {

  // The start state contains the rules that are intially used
  start: [
    // The regex matches the token, the token property contains the type

//    {
//      regex: /((?:(?:(?:[A-Z][-'a-zA-Z]+|[A-Z]\.?),?(?:\s\&|\sand)?\s*){1,10})\(?(?:\d\d\d\d[a-z]?)[\)\.])([^\.\?]*[\.\?])([^\.\?]*[\.\?])/,
//      token: ["reference","ref-info-1","ref-info-2"]
//    },

//    {
//      regex: /((?:(?:(?:[A-Z][-'a-zA-Z]+|[A-Z]\.?),?(?:\s\&|\sand)?\s*){1,10})\(?(?:\d\d\d\d[a-z]?)[\)\.])/,
//      token: ["reference"]
//    },
    
//    {
//      regex: /(\s\s)(\s\s)/,
//      token: ["indent1","indent2"]
//    },
//    {
//      regex: /\s\s/,
//      token: "indent1"
//    },
    {
      regex: /"(?:[^\\]|\\.)*?"/,
      token: "string"
    },
    {
      regex: /\s-\s/, // capture mid-sentence hyphen
      token: null
      },
    {
      regex: /-\s/,
      token: "unordered-list"
      },
    {
      regex: /(\*\*){0,1}([^\*]*?){0,1}(\*\*)/,
      token: ["markup", "strong", "markup"]
      },
    {
      regex: /(\*)([^\*]*?)(\*)/,
      token: ["markup", "em", "markup"]
      },
    {
      regex: /(\[)([^\]]*?)(\])/,
      token: ["markup", "editorial", "markup"]
      },
    {
      regex: /(~[^~]+)~?/,
      token: "strikethrough"
      },
    {
      regex: /[A-Z]\w+\s(and|&)\s[A-Z]\w+\s\(\d\d\d\d[^\)]*\)/,
      token: ["citation"]
      },
    {
      regex: /([A-Z]\w+\s)?\(\d\d\d\d[^\)]*\)/,
      token: ["citation"]
      },
    {
      regex: /\([^\(]*\d\d\d\d[^\)]*\)/,
      token: ["citation"]
      },
//  THIS CITATION REGEX SHOULD WORK BUT DOESN'T: ([A-Z]\w+\s((and|&)\s)?)*\([^\(]*\d\d\d\d[^\)]*\)
    {
      regex: /https?:\/\/[^\s\)\]]*/,
      token: "link"
      },
    {
      regex: /\/\/\/.*/,
      token: "divider"
      },
    {
      regex: /\/\/.*/,
      token: "comment"
      },
    {
      regex: /#\w+/,
      token: "hashtag"
      },
    {
      regex: /(###)(\s.*)/,
      token: ["markup", "header-3"]
      },
    {
      regex: /(##)(\s.*)/,
      token: ["markup", "header-2"]
      },
    {
      regex: /(#)(\s.*)/,
      token: ["markup", "header-1"]
      },
    {
      regex: /---+/,
      token: "hr"
      },
    {
      regex: /(!\[.*?\])(\(.*?\))/,
      token: ["image-text","image-link"]
      },
    {
      regex: /Figure\s\d+/,
      token: "figure-title"
      },
    {
      regex: /Table\s\d+/,
      token: "table-title"
      },
    {
      regex: /[\{\[\(]/,
      indent: true
      },
    {
      regex: /[\}\]\)]/,
      dedent: true
      }
  ]
}