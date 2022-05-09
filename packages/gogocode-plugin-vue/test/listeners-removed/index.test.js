const path = require('path');
const $ = require('@zcatpkg/gogocode');
const transform = require('../../src/listeners-removed');

test('listeners-removed', () => {
    expect(() => {
        const vuePath = path.join(__dirname, 'Comp.vue');
        const ast = $.loadFile(vuePath, { parseOptions: { language: 'vue' } });
        transform(ast, { gogocode: $ });
    }).not.toThrow();
})
