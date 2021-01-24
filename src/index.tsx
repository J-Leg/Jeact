/** @jsx Jeact.createElement */
import { createElement } from './lib/createElement'
import { render } from './lib/render'

const Jeact = {
  createElement,
  render
};

/** @jsx Jeact.createElement */
const elem = (
  <div>
    <h1>"Hello World"</h1>
    <h2>from jeact</h2>
  </div>
);

const container: HTMLElement | null = document.getElementById("root")
Jeact.render(elem, container)

