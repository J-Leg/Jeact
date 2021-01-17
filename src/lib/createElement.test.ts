import { createElement, createValueElement, JeactElement, JeactValue, isJeactValue } from './createElement'

test('basic createElement', () => {
  const expected: JeactElement = {
    type: 'div',
    props: { children: [] },
  }
  expect(createElement("div")).toStrictEqual(expected)
})

test('basic createElement with child', () => {
  const child: JeactElement = { type: 'div', props: { children: [] }}
  const expected: JeactElement = {
    type: 'body',
    props: { children: [child] },
  }
  expect(createElement("body", null, child)).toStrictEqual(expected)
})

test('std createElement with nested child and id prop', () => {
  const childA: JeactElement = { type: 'div', props: { children: [] }}
  const childB: JeactElement = { type: 'div', props: { children: [createElement("p", {id: "bar"})] }}
  const additionalProp: object = { id: "foo" }

  const expected: JeactElement = {
    type: 'body',
    props: { 
      id: 'foo',
      children: [childA, childB]
    }
  }
  expect(createElement("body", additionalProp, childA, childB)).toStrictEqual(expected)
})

test('complex createElement with nested child JeactElement, JeactValues, and custom id', () => {
  const childA: JeactElement = { type: 'div', props: { children: [] }}
  const childB: JeactElement = { type: 'div', props: { children: [createElement("p", {id: "bar"})] }}
  const additionalProp: object = { id: "foo" }

  const expected: JeactElement = {
    type: 'body',
    props: { 
      id: 'foo',
      children: [childA, childB]
    }
  }
  expect(createElement("body", additionalProp, childA, childB)).toStrictEqual(expected)
})

test('basic createValueElement', () => {
  const expected: JeactValue = { nodeValue: 'foobar' }
  expect(createValueElement('foobar')).toStrictEqual(expected)
})

test('basic isJeactValue test', () => {
  const elem: JeactValue = createValueElement('foobar')
  expect(isJeactValue(elem)).toBeTruthy()
})

test('std isJeactValue test', () => {
  const childA: JeactElement = { type: 'div', props: { children: [] }}
  const childB: JeactElement = { type: 'div', props: { children: [createElement("p", {id: "bar"})] }}
  const additionalProp: object = { id: "foo" }
  const elem: JeactElement = createElement("body", additionalProp, childA, childB)
  expect(isJeactValue(elem)).toBeFalsy()
})

