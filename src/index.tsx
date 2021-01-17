/** @jsx Jeact.createElement */
import { createElement } from './lib/createElement'
import { render } from './lib/render'

const Jeact = {
  createElement,
  render
};

/** @jsx Jeact.createElement */
const elem = (
  <h1>"Hello World"</h1>
);

const container = document.getElementById("root")
Jeact.render(elem, container)

