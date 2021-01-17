export interface JeactElement {
  type: string;
  props: {
    id?: string;
    children: (JeactElement | JeactValue)[];
  }
}

export interface JeactValue {
  nodeValue: string;
}

/**
 * Returns whether element is an instance of JeactValue
 *
 * @remarks
 * This is to compensate for the non-existent runtime type checks
 *
 * @param elem - input element
 * @returns boolean indicating if elem is an instance of JeactValue
 */
function isJeactValue(elem: JeactElement | JeactValue): elem is JeactValue {
  return elem.hasOwnProperty('nodeValue') 
}

/**
 * Create a Jeact element 
 *
 * @remarks
 * Simplified clone of a React element
 *
 * @param type - type of the element
 * @param props - optional additional props 
 * @param children - an array of children with type JeactElement or JeactValue
 * @returns newly created JeactElement
 */
function createElement(type: string, props?: object, ...children: any[]): JeactElement {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => typeof child === "object" ? child : createValueElement(child))
    },
  }
}

/**
 * Create a Jeact value element 
 *
 * @remarks
 * A root element that has no children 
 *
 * @param value - value of the element
 * @returns newly created JeactValue
 */
function createValueElement(value: string | number): JeactValue {
  if (typeof value == "string") { value.toString() }
  const v: string = value as string
  const res: JeactValue = { nodeValue: v }
  return res
}

export { createValueElement, createElement, isJeactValue }

