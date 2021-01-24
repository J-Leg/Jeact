export interface JeactElement {
  type: string;
  props: {
    id?: string;
    value?: string
    children: JeactElement[];
  }
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
function createValueElement(value: string | number): JeactElement {
  if (typeof value == "string") { value.toString() }
  const v: string = value as string
  const res: JeactElement = { type: "TEXT", props: { value: v, children: [] }}
  return res
}

export { createValueElement, createElement }

