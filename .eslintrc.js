module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:flowtype/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": 9,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "plugins": [
        "flowtype"
    ],
    "settings": {
        "react": {
            "createClass": "createReactClass", // Regex for Component Factory to use,
                                               // default to "createReactClass"
            "pragma": "React",  // Pragma to use, default to "React"
            "version": "detect"
          }
    },
    "rules": {
        "indent": [
            "error",
            2,
            { "SwitchCase": 1 }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "no-console": "warn",
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};