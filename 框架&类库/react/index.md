# React 源码解析

参考文档（17）： <https://react.iamkasong.com/#%E7%AB%A0%E8%8A%82%E5%88%97%E8%A1%A8>

该笔记主要以 react18 内容进行分析

## 流程

[初始化流程](./asset/reacInt.dio)

## 架构

1. Scheduler 调度器
   作用：调度器主要负责任务优先级，它会根据任务的优先级决定何时将任务交给 Reconciler 去处理。例如对于用户输入相关的紧急任务会赋予高优先级。

   实现细节： 任务切片，将一个时间渲染任务拆分成多个小片段，在每个空闲时间片段内执行一部分切片，这个地方类似于 requestIdlCallback 的方式，防止浏览器长时间阻塞。

2. Reconciler 协调器
   作用：负责找出变化的组件，Reconciler 中会通过 diff 算法对比前后的虚拟 Dom 树，标记虚拟 DOM 的变化。

   实现细节： 使用了 Fiber 架构，通过一种基于链表的遍历方式，变成了可以中断的循环过程，通过Fiber 中的 return 、 child 和 sibling 等指针来遍历虚拟Dom树，这种类似于链表的结构使得可以灵活的在节点之间移动。

3. Renderer 渲染器
   作用： 根据Reconciler 为虚拟Dom打的标记，同步执行对应的Dom操作

### Fiber

[https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiber.new.js#L117](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiber.new.js#L117)

#### fiber 结构

```TypeScript
  function FiberNode(
    tag: WorkTag,
    pendingProps: mixed,
    key: null | string,
    mode: TypeOfMode,
  ) {
    // 作为静态数据结构的属性
    this.tag = tag;
    this.key = key;
    this.elementType = null;
    this.type = null;
    this.stateNode = null;

    // 用于连接其他Fiber节点形成Fiber树，链表结构的关键
    // 指向父级节点
    this.return = null;
    // 指向子级节点
    this.child = null;
    // 相邻节点
    this.sibling = null;
    this.index = 0;

    this.ref = null;

    // 作为动态的工作单元的属性
    this.pendingProps = pendingProps;
    this.memoizedProps = null;
    this.updateQueue = null;
    // 用于存储相关的hook状态
    this.memoizedState = null;
    this.dependencies = null;

    this.mode = mode;

    this.effectTag = NoEffect;
    this.nextEffect = null;

    this.firstEffect = null;
    this.lastEffect = null;

    // 调度优先级相关
    this.lanes = NoLanes;
    this.childLanes = NoLanes;

    // 指向该fiber在另一次更新时对应的fiber
    this.alternate = null;

    if (enableProfilerTimer) {
      // Note: The following is done to avoid a v8 performance cliff.
      //
      // Initializing the fields below to smis and later updating them with
      // double values will cause Fibers to end up having separate shapes.
      // This behavior/bug has something to do with Object.preventExtension().
      // Fortunately this only impacts DEV builds.
      // Unfortunately it makes React unusably slow for some applications.
      // To work around this, initialize the fields below with doubles.
      //
      // Learn more about this here:
      // https://github.com/facebook/react/issues/14365
      // https://bugs.chromium.org/p/v8/issues/detail?id=8538
      this.actualDuration = Number.NaN;
      this.actualStartTime = Number.NaN;
      this.selfBaseDuration = Number.NaN;
      this.treeBaseDuration = Number.NaN;

      // It's okay to replace the initial doubles with smis after initialization.
      // This won't trigger the performance cliff mentioned above,
      // and it simplifies other profiler code (including DevTools).
      this.actualDuration = 0;
      this.actualStartTime = -1;
      this.selfBaseDuration = 0;
      this.treeBaseDuration = 0;
    }

    if (__DEV__) {
      // This isn't directly used but is handy for debugging internals:
      this._debugID = debugCounter++;
      this._debugSource = null;
      this._debugOwner = null;
      this._debugNeedsRemount = false;
      this._debugHookTypes = null;
      if (!hasBadMapPolyfill && typeof Object.preventExtensions === 'function') {
        Object.preventExtensions(this);
      }
    }
  }
```

#### fiber 架构是如何实现暂停和恢复的

我们知道，当组件发生更新后，会经过 Scheduler 分配优先级，然后 Reconciler 会对新老虚拟dom节点进行对比

暂停触发： 这个时候是通过遍历 fiber 节点的方式，在每次遍历 Fiber 树的过程中，会定期检查是否有给你个高优先级的任务需要执行，如果有就会暂停当前的遍历任务

恢复任务： 基于 fiber 结构的特点，每个 fiber 节点都保留了节点状态和完整的上下文信息，所以可以准确的找到上次暂停的位置继续后续的遍历处理虚拟 Dom 的更新。

```TypeScript
  // performSyncWorkOnRoot会调用该方法
  function workLoopSync() {
    while (workInProgress !== null) {
      performUnitOfWork(workInProgress);
    }
  }

  // performConcurrentWorkOnRoot会调用该方法
  function workLoopConcurrent() {
    while (workInProgress !== null && !shouldYield()) {
      performUnitOfWork(workInProgress);
    }
  }
```

#### 是什么是双缓存

在更新过程中会同时存在两个DOM 树，即 currentFiber 和 workInProgressFiber，通过遍历旧的虚拟 DOM 树 currentFiber 和新的组件状态构建 workInProgressFiber,利用fiber节点信息来确定如何处理每一个节点

currentFiber <-> alternate <-> workInProgressFiber

### 从 JSX 到 ReactElement

示例：

```TypeScript
  // 编译前
  export function App() {
    return (
      <div key="key">hello world!</div>
    )
  }

  // 编译后
  export default function App() {
    return jsx("div",{
      class:"",
      children:"hello world"
    }, "key")
  }
```

可以看到编译后都会被 jsx 这个方法进行转化，看一下jsx 做了什么

[https://github.com/facebook/react/blob/main/packages/react/src/jsx/ReactJSXElement.js#L293](https://github.com/facebook/react/blob/main/packages/react/src/jsx/ReactJSXElement.js#L293)

```TypeScript
// 最新版本中改为了 jsxPro
  export function jsx(type, config, maybeKey) {
    let propName;
    const props = {};
    let key = null;
    let ref = null;
    if (maybeKey !== undefined) {
      key = '' + maybeKey;
    }
    // key不为undefined即返回true
    /* 这里是为了从props里面捞key，因为key不一定
    会明文写出，有可能作为{...props}中的键存在
    这种情况下，babel是转不出key的
    */
    if (hasValidKey(config)) {
      key = '' + config.key;
    }
    // ref不为undefined即返回true
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    // 记录传入props
    for (propName in config) {
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
    // 记录html元素类型固有的props
    if (type && type.defaultProps) {
      const defaultProps = type.defaultProps;
      for (propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }
    // 新建ReactElement
    return ReactElement(
      type,
      key,
      ref,
      undefined,
      undefined,
      ReactCurrentOwner.current,
      props,
    );
  }

  const ReactElement = function (type, key, ref, self, source, owner, props) {
    const element = {
      // 标记这是个 React Element
      $$typeof: REACT_ELEMENT_TYPE,

      type: type,
      key: key,
      ref: ref,
      props: props,
      _owner: owner,
    };

    return element;
  };
```

### JSX 与 Fiber 节点

JSX 是描述当前组件内容的数据结构，它并不包含 schedule、 reconcile 、 Renderer 所需要的想关信息，例如 更新的优先级，组件的state, 组件更新的标记，这些内容都存储在fiber 节点当中

JSX是如何转换成 Fiber 的呢，这中间发生了什么

1. createRoot

```TypeScript
export function createRoot(
  container: Element | DocumentFragment,  
  // options配置默认是不传  
  options?: CreateRootOptions,
): RootType {    
 // ......省略掉一些warn和配置项相关的代码    
 // 创建并初始化根节点FiberRootNode 
  const root = createContainer(
    container,
    ConcurrentRoot,
    null,
    isStrictMode,
    concurrentUpdatesByDefaultOverride,
    identifierPrefix,
    onRecoverableError,
    transitionCallbacks,  
  );
  /* 将DOM元素当前对应的Fiber节点设置为root.current，  它是刚刚创建出的FiberRootNode对应的RootFiber  （初始化出的一个空fiber树) */  
  markContainerAsRoot(root.current, container);
  // 避免传入DOM元素是注释节点的情况  
    const rootContainerElement: Document | Element | DocumentFragment =    
    container.nodeType === COMMENT_NODE      
      ? (container.parentNode: any)      
      : container;

    /* 监听传入DOM元素的所有事件，也就是事件委托机制 */  
    listenToAllSupportedEvents(rootContainerElement);

    /**
     * 初始化一个ReactDOMRoot对象，  这个对象上的internalRoot属性是我们  刚才创建的 
     * FiberRootNode
     */ 
    return new ReactDOMRoot(root);}

    // render方法源码如下所示
    ReactDOMRoot.prototype.render = function(
        children: ReactNodeList,
    ): void {  
      // 我们创建出的FiberRootNode  
      const root = this._internalRoot;  
      if (root === null) {   
        throw new Error('Cannot update an unmounted root.'); 
      }  
      /* 用于渲染初始化视图，记住这个函数,它会将  ReactElement转化为Fiber树挂载到我们的FiberRootNode上，  作为FiberRootNode.current并关联真实DOM元素以实现视图  的渲染，我们后面会细聊 */ 
    updateContainer(children, root, null, null);
  };
```

- createRoot主要用于创建并初始化FiberRootNode并将其current属性指向的RootFiber（此时为空的fiber树）关联对应到我们传入的真实DOM元素上
- 在createRoot过程中我们还监听了真实DOM元素的所有事件，进行了事件委托
- render函数的作用主要用于渲染更新视图

2. updateContainer  由上可知，当调用 render 函数的时候才是真正渲染组件更新视图即<App/>

```TypeScript
  // 主要在组件挂载初始化时使用
  export function updateContainer(  
    element: ReactNodeList,  
    container: OpaqueRoot,  
    parentComponent: ?React$Component<any, any>,  
    callback: ?Function,): Lane { 
     // 当前的RootFiber，此时为空  
    const current = container.current;  
    const eventTime = requestEventTime();  
    const lane = requestUpdateLane(current);  
    const context = getContextForSubtree(parentComponent);  
    if (container.context === null) {    
      container.context = context;  
    } else {   
         container.pendingContext = context;  
    }  
      // 创建一个更新，这个更新是用来做初始化的渲染的  
    const update = createUpdate(eventTime, lane);  
    // 更新的载荷是我们传入的React元素，即<App/>  
    update.payload = {element};
    // 如有传入callback，将它附在update上  
    callback = callback === undefined ? null : callback; 
    if (callback !== null) {    
      update.callback = callback;  
    }
  // 将更新加入当前fiber节点的updateQueue中  
  enqueueUpdate(current, update, lane);
 /** 
  * 开始在调度更新，
  * 其实只有一个更新，就是element  （也就是我们传入的App）的初始化
 */
  const root = scheduleUpdateOnFiber(current, lane, eventTime);  
  if (root !== null) {     
  /** 对于低优先级任务的处理，     
   * 在当前初始化场景下不太会出现这种case 
   * */    
    entangleTransitions(root, current, lane);  }  return lane;
  }
```

### 调度更新

### 时间分片

### Diff 原理

### Renderer commit
