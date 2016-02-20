
var langAlign = require('./index.js');

/*var testwords = {
  language: ['Marshallese', 'Kyrgyz'],
  electric: {
    computer: ['computer']
  }
};*/

var allwords = {};

var csv = require('fast-csv');

csv.fromPath('buck-combined-full.csv', { headers: true })
  .on('data', function (row) {
    var mword = row.entry.replace('b', '').replace(/'/g, '');
    if (mword.indexOf(', ') > -1) {
      mword = mword.split(', ')[1];
    }
    if (mword.indexOf(' or ') > -1) {
      mword = mword.split(' or ')[0];
    }
    var blacklist = ['(', ')', '/'];
    for (var b = 0; b < blacklist.length; b++) {
      if (mword.indexOf(blacklist[b]) > -1) {
        return;
      }
    }
    var category = row.buck_category.replace('b', '');
    if (!allwords[category]) {
      allwords[category] = [];
    }
    allwords[category].push(mword);
  })
  .on('end', function() {
    // compare: Kyrgyz and Marshallese language coverage
    //var languages = ['kir-000', 'mah-000'];
    var languages = ['mya-000', 'lug-000'];
    processLanguages(languages);
  });

function processLanguages(languages) {
  languages.map(function(lang) {
    var wordMap = {};

    function checkTree(tree, callback) {
      if (tree.length) {
        // actually an array
        console.log(tree);
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
        if (w >= list.length || !(isNaN(list[w].replace(/'/g, '') * 1))) {
          return callback();
        }
        langAlign.wordForIt(list[w], lang, function (err, word) {
          if (err) {
            console.log('no English word:' + list[w]);
          } else {
            wordMap[list[w]] = word;
          }
          setTimeout(function() {
            checkWord(w + 1, list, callback);
          }, 1000);
        });
      }
    }

    checkTree(allwords, function() {
      var sections = Object.keys(allwords);
      for (var s = 0; s < sections.length; s++) {
        var score = 0;
        for (var word in allwords[sections[s]]) {
          if (wordMap[allwords[sections[s]][word]]) {
            score++;
          }
        }
        console.log((s+1) + ":" + lang + ": " + score);
      }
    });
  });
}
