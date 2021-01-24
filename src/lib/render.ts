import { JeactElement } from './createElement'

type RequestIdleCallbackHandle = any;
type RequestIdleCallbackOptions = {
  timeout: number;
};
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: (() => number);
};

declare global {
  interface Window {
    requestIdleCallback: ((
      callback: ((deadline: RequestIdleCallbackDeadline) => void),
      opts?: RequestIdleCallbackOptions,
    ) => RequestIdleCallbackHandle);
    cancelIdleCallback: ((handle: RequestIdleCallbackHandle) => void);
  }
}


interface Fiber {
  dom: Node | null
  parent: Fiber | null
  child: Fiber | null
  sibling: Fiber | null
  type: string
  props: {
    id?: string
    value?: string
    children: JeactElement[]
  }
  prev: Fiber | null
  effectTag?: string
}

function createDom(f: Fiber): HTMLElement | Text {
  let dom: HTMLElement | Text
  if (f.type === "TEXT" && f.props.value) {
    dom = document.createTextNode(f.props.value)
  } else {
    dom = document.createElement(f.type)
  }
  return dom
}

let nextUnit: Fiber | null
let wipRoot: Fiber | null = null
let currentRoot: Fiber | null = null
let deletions: Fiber[]

function workLoop(deadline: any) {
  let shouldYield: boolean = false
  while (nextUnit && !shouldYield) { 
    nextUnit = performUnitOfWork(nextUnit) 
    shouldYield = deadline.timeRemaining() < 1
  }
  if (!nextUnit && wipRoot) { commitRoot() }
  window.requestIdleCallback(workLoop)
}

window.requestIdleCallback(workLoop)

function performUnitOfWork(f: Fiber): Fiber | null {
  if (!f.dom) { f.dom = createDom(f) }
  const elements = f.props.children
  reconcile(f, elements)

  if (f.child) { return f.child }
  let nextF: Fiber | null = f
  while (nextF) {
    if (nextF.sibling) { return nextF.sibling }
    nextF = nextF.parent
  }
  return null
}

function render(element: JeactElement, container: HTMLElement | null) {
  wipRoot = {
    dom: container,
    type: element.type,
    parent: null,
    child: null,
    sibling: null,
    props: {
      children: [element]
    },
    prev: currentRoot
  }
  deletions = []
  nextUnit = wipRoot 
}

function commitRoot() {
   // deletions.forEach(commit)
  if (wipRoot) { 
    commit(wipRoot.child) 
    currentRoot = wipRoot
    wipRoot = null
  }
}

const isProperty = (key: string) => key !== "children"
const isEvent = (key: string) => key.startsWith("on")
const isNew = (prev: any, next: any) => (key: any) => prev[key] !== next[key]
const isGone = (prev: any, next: any) => (key: any) => !(key in next)

function updateDom(dom: any, prevProps: any, nextProps: any) {
	// Remove old or changed event listeners
	Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => !(key in nextProps) || isNew(prevProps, nextProps) (key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.removeEventListener(eventType, prevProps[name])
    })
      
  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = ""
    })

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => { dom[name] = nextProps[name] })

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.addEventListener(eventType, prevProps[name])
    })
}

function commit(f: Fiber | null) {
  if (!f) { return }

  if (f.parent && f.parent.dom && f.effectTag === "PLACEMENT" && f.dom != null) {
    f.parent.dom.appendChild(f.dom)
  } else if (f.parent && f.parent.dom && f.effectTag === "DELETION" && f.dom != null) {
    f.parent.dom.removeChild(f.dom)
  } else if (f.prev && f.effectTag === "UPDATE" && f.dom != null) {
    updateDom(f.dom, f.prev.props, f.props)
  }
  
  commit(f.child)
  commit(f.sibling)
}

function reconcile(f: Fiber, elements: JeactElement[]) {
  let prevF: Fiber | null = f.prev && f.prev.child
  let idx: number = 0
  let prevSibling: Fiber | null = null

  while (idx < elements.length || prevF != null) {
    const e: JeactElement = elements[idx]

    const isSameType: boolean = (prevF != null && e != null && prevF.type === e.type)
    let newF: Fiber | null = null
    if (isSameType && prevF != null) {
      newF = {
        type: prevF.type,
        props: e.props,
        dom: prevF.dom,
        parent: f,
        sibling: null,
        child: null,
        prev: prevF,
        effectTag: "UPDATE",
      }
    }

    if (e && !isSameType) {
      newF= {
        type: e.type,
        props: e.props,
        dom: null,
        parent: f,
        sibling: null,
        child: null,
        prev: null,
        effectTag: "PLACEMENT",
      }
    }

    if (prevF && !isSameType) {
      prevF.effectTag = "DELETION"
      deletions.push(prevF)
    }

    if (prevF) { prevF = prevF.sibling }
    if (idx === 0) {
      f.child = newF
    } else if (e && prevSibling) {
      prevSibling.sibling = newF
    }
    prevSibling = newF
    idx++
  }
}


export { render }
