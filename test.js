
var langAlign = require('./index.js');



/*var testwords = {
  language: ['Marshallese', 'Kyrgyz'],
  electric: {
    computer: ['computer']
  }
};*/

var csv = require('fast-csv');
csv.fromFile

var allwords = {};

function processLanguages() {
  // compare: Kyrgyz and Marshallese language coverage
  var languages = ['kir-000', 'mah-000'];

  languages.map(function(lang) {
    var wordMap = {};

    function checkTree(tree, callback) {
      if (tree.length) {
        // actually an array
        checkWord(0, tree, callback);
      } else {
        // branches
        var branches = Object.keys(tree);
        checkWord(0, branches, function() {
          function checkBranch(b) {
            if (b >= branches.length) {
              return callback();
            }
            checkTree(tree[branches[b]], function() {
              setTimeout(function() {
                checkBranch(b + 1);
              }, 1000);
            });
          }
          checkBranch(0);
        });
      }

      function checkWord(w, list, callback) {
        if (w >= list.length) {
          return callback();
        }
        langAlign.wordForIt(list[w], lang, function (err, word) {
          if (err) {
            throw err;
          }
          wordMap[list[w]] = word;
          setTimeout(function() {
            checkWord(w + 1, list, callback);
          }, 1000);
        });
      }
    }

    checkTree(allwords, function() {
      console.log(wordMap);
    });
  });
}
