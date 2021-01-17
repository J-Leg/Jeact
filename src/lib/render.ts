import { JeactElement, JeactValue, isJeactValue } from './createElement'

/**
 * Render JSX to the DOM 
 *
 * @remarks
 * For now simply adding nodes to the DOM 
 *
 * @param element - element in the tree 
 */
function render(element: JeactElement | JeactValue, container: any) {
  let domNode: any;
  if (isJeactValue(element)) {
    let e: JeactValue = element as JeactValue
    domNode = document.createTextNode(e.nodeValue)
  } else {
    let e: JeactElement = element as JeactElement
    domNode = document.createElement(e.type)
    if (e.props) {
      e.props.children.forEach(child => render(child, domNode))
      domNode["id"] = e.props.id
    }
  }

  container.appendChild(domNode)

}

export { render }
