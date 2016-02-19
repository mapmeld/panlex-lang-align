
var panlex = require('panlex');
panlex.setUserAgent('lang-align', '1.0.0');

var knownExCodes = {};

function wordForIt(englishWord, language, callback) {
  function byExCode(ex) {
    panlex.query('/ex', { uid: language, trex: ex }, function (err, data) {
      if (err) {
        callback(err);
      } else if (!data || !data.result || !data.result.length || !data.result[0] || !data.result[0].ex) {
        callback(null, null);
      } else {
        callback(null, data.result[0].tt);
      }
    });
  }

  if (knownExCodes[englishWord]) {
    return byExCode(knownExCodes[englishWord]);
  }
  panlex.query('/ex', { uid: 'eng-000', tt: englishWord }, function (err, data) {
    if (err) {
      callback(err);
    } else if (!data || !data.result || !data.result.length || !data.result[0] || !data.result[0].ex) {
      callback('no English word matches');
    } else {
      knownExCodes[englishWord] = data.result[0].ex;
      byExCode(data.result[0].ex);
    }
  });
}

module.exports = {
  wordForIt: wordForIt
};
