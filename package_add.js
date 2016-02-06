var fs = require('fs');
var prompt = require('prompt');
var targets = process.argv.slice(2).join(' ');

var pkg = JSON.parse(fs.readFileSync('package.json'));

if (!pkg.scripts) {
  pkg.scripts = {};
}

var existingTest = pkg.scripts.test || '';

var eslintCommand = 'eslint ' + targets;

if (existingTest === 'echo "Error: no test specified" && exit 1') {
  existingTest = '';
}

var newTest = existingTest.length ?
  (eslintCommand + ' && ' + existingTest) :
  eslintCommand;

prompt.start();
prompt.get({
  properties: {
    test: {
      description: 'test script',
      default: newTest
    }
  }
}, function(err, res) {
  if (err) {
    return;
  }
  pkg.scripts.test = res.test;
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
});
