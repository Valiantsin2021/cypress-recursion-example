const test = require('node:test')
const spok = require('spok').default

const res = {
  $topic: 'user function',
  file: '/Volumes/d/dev/js/async-hooks/ah-fs/test/read-one-file.js',
  line: 39,
  column: 17,
  inferredName: '',
  name: 'onread',
  location:
    'onread (/Volumes/d/dev/js/async-hooks/ah-fs/test/read-one-file.js:39:17)',
  propertyPaths: [
    'open.resource.context.callback',
    'close.resource.context.callback'
  ],
  args: {
    0: null,
    1: {
      type: 'Buffer',
      len: 6108,
      included: 18,
      val: {
        utf8: 'const test = requi',
        hex: '636f6e73742074657374203d207265717569'
      }
    },
    proto: 'Object'
  }
}

test('\nspok handles nested specifications', function (t) {
  spok(t, res, {
    $topic: 'result',
    file: spok.test(/read-one-file/),
    line: 39,
    column: 17,
    inferredName: '',
    name: 'onread',
    location: spok.startsWith('onread'),
    propertyPaths: [
      'open.resource.context.callback',
      'close.resource.context.callback'
    ],
    args: {
      0: null,
      1: {
        type: 'Buffer',
        len: spok.gt(1000),
        included: spok.lt(20),
        val: { utf8: spok.string, hex: '636f6e73742074657374203d207265717569' }
      },
      proto: 'Object'
    }
  })
})
const object = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  helloWorld: 'hello world',
  anyNum: 999,
  anotherNum: 888,
  anArray: [1, 2],
  anotherArray: [1, 2, 3],
  anObject: {}
}

// custom specification
function hasThreeElements(a) {
  return a.length === 3
}

test('my object meets the specifications', function (t) {
  spok(t, object, {
    $topic: 'spok-example',
    one: spok.ge(1),
    two: 2,
    three: spok.range(2, 4),
    four: spok.lt(5),
    helloWorld: spok.startsWith('hello'),
    anyNum: spok.type('number'),
    anotherNum: spok.number,
    anArray: spok.array,
    anotherArray: hasThreeElements,
    anObject: spok.ne(undefined)
  })
})

test('\n#my object meets the specifications - print description', function (t) {
  spok.printDescription = true
  spok(t, object, {
    $topic: 'spok-example',
    one: spok.ge(1),
    two: 2,
    three: spok.range(2, 4),
    four: spok.lt(5),
    helloWorld: spok.startsWith('hello'),
    anyNum: spok.type('number'),
    anotherNum: spok.number,
    anArray: spok.array,
    anotherArray: hasThreeElements,
    anObject: spok.ne(undefined)
  })
})
