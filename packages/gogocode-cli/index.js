#!/usr/bin/env node

'use strict'
const chalk = require('chalk');
const program = require('commander');
const pkg = require('./package.json');
const check = require('./src/util/check');
const transform = require('./src/commands/transform');
const path = require('path');
const fs = require('fs');


(async () => {

    await check.checkUpdate();

    program
        .command(`init`)
        .description('init a plugin project')
        .action((options) => {
            require('./src/commands/init')(options)
        });

    program.option('-t, --transform <package name or path>', 'plugin path or npm package name, supports multiple plugins, separated by commas')
        .option('-o, --out <path>', 'output file path, if not input use src path instead')
        .option('-s, --src <path>', 'source file path')
        .option('-d, --dry', 'dry run (no changes are made to files)')
        .option('-p, --params <key=value>','params direct to plugin, eg: format=true#test=false, use \'#\' to join params')
        .option('-i, --info', 'show transform log info')
        .option('-f, --force', 'force transform')
        .option('-c, --config', 'config')
        .action((options) => {
            if (options.config) {
                if (typeof options.config === 'boolean') {
                    options.config = 'gogocode.config.js'
                }
                let configPath = ''
                if (path.isAbsolute(options.config)) {
                    configPath = options.config
                } else {
                    configPath = path.join(process.cwd(), options.config)
                }
                if (fs.existsSync(configPath)) {
                    const config = require(configPath)
                    options.out = config.out || options.out
                    options.src = config.src || options.src
                    options.dry = config.dry || options.dry
                    options.info = config.info || options.info
                    options.force = config.force || options.force
                    options.params = config.params || {}
                    if (config.includeRules) {
                        options.params['include-rules'] = config.includeRules.join(',')
                    }
                    if (config.excludeRules) {
                        options.params['exclude-rules'] = config.excludeRules.join(',')
                    }
                    options.include = config.include
                    options.exclude = config.exclude
                } else {
                    options.config = null
                }
            }

            transform(options).then(() => { console.log(); }).catch(() => {
                process.exit(1);
            });
        })

    program
        .version(pkg.version)
        .description(chalk.green('GoGoCode  代码转换从未如此简单  https://gogocode.io'));

    //默认展示帮助信息
    if (process.argv && process.argv.length < 3) {
        program.help();
    }
   
    program.parse(process.argv);

   
})();
