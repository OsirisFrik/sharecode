require('dotenv').config();

test('ENV', () => {
  let errs = [];
  let envs = [
    'SESSION_SECRET',
    'GH_CLIENT',
    'GH_SECRET',
    'GG_ANALYTICS'
  ]

  for (let i = 0; i < envs.length; i++) {
    if (typeof process.env[envs[i]] === 'undefined') {
      errs.push(`ENV ${envs[i]} DON'T FOUND`);
    }
  }

  return errs.length > 0 ? Promise.reject(errs) : Promise.resolve();
});
