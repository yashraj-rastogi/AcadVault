const { execSync } = require('child_process');
const fs = require('fs');
try {
  const result = execSync('npx tsc --noEmit', {encoding: 'utf8', stdio: 'pipe'});
  fs.writeFileSync('ts_errors.txt', result);
} catch (e) {
  fs.writeFileSync('ts_errors.txt', e.stdout.toString() || e.stderr.toString());
}
