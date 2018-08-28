require('babel-register');

const path = require('path');
const process = require('process');
const seleniumServer = require('selenium-server');
const chromedriver = require('chromedriver');

function resolve(dir) {
    return path.resolve(__dirname, dir);
}

const chromeOptions = [
    '--lang=en_GB,en',
    '--window-size=1920,1080',
    '--remote-debugging-port=9222',
    '--disable-web-security',
    '--ignore-certificate-errors'
];

if (process.env.NIGHTWATCH_HEADLESS === 'true') {
    chromeOptions.push('--headless');
}

module.exports = {
    src_folders: [resolve('specs')],
    output_folder: 'build/artifacts/e2e',

    selenium: {
        start_process: true,
        server_path: seleniumServer.path,
        host: '127.0.0.1',
        port: 4444,
        cli_args: {
            'webdriver.chrome.driver': chromedriver.path
        }
    },

    globals_path: resolve('globals.js'),

    test_settings: {
        default: {
            filter: '**/*.spec.js',
            launch_url: `${process.env.APP_URL}/admin`,
            selenium_port: 4444,
            selenium_host: 'localhost',
            globals: {
                waitForConditionTimeout: 5000
            },
            screenshots: {
                enabled: true,
                on_failure: true,
                path: 'build/artifacts/e2e/screenshots/'
            },
            desiredCapabilities: {
                browserName: 'chrome',
                javascriptEnabled: true,
                acceptSslCerts: true,
                chromeOptions: {
                    prefs: {
                        'intl.accept_languages': 'en_GB,en'
                    },
                    args: chromeOptions
                }
            }
        },
        docker: {
            filter: '**/*.spec.js',
            launch_url: 'http://docker.vm:8000/admin',
            selenium_host: 'selenium',
            selenium_port: 4444,
            selenium: {
                start_process: false
            },
            globals: {
                waitForConditionTimeout: 5000
            },
            screenshots: {
                enabled: true,
                on_failure: true,
                path: 'build/artifacts/e2e/screenshots/'
            },
            desiredCapabilities: {
                browserName: 'chrome',
                javascriptEnabled: true,
                acceptSslCerts: true,
                chromeOptions: {
                    prefs: {
                        'intl.accept_languages': 'en_GB,en'
                    },
                    args: [
                        '--lang=en_GB,en',
                        '--window-size=1920,1080',
                        '--remote-debugging-port=9222',
                        '--no-sandbox',
                        '--headless',
                        '--disable-web-security',
                        '--ignore-certificate-errors'
                    ]
                }
            }
        }
    }
};
