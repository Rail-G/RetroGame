module.exports = {
    'env': {
      'browser': true,
      'es2021': true,
      'node': true
    },
    'extends': 'eslint:recommended',
    'overrides': [
      {
        'files': ['**/*.js'],
        'plugins': ['jest'],
        'extends': ['plugin:jest/recommended'],
        'rules': { 'jest/prefer-expect-assertions': 'off' }
      }
    ],
    'parserOptions': {
      'ecmaVersion': 'latest',
      'sourceType': 'module'
    },
    'rules': {}
}