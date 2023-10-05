/* eslint-disable no-continue */
/* eslint-disable prefer-destructuring */

import * as P from '@react-pdf/primitives';
import { isNil, omit, compose } from '@react-pdf/fns';

import isFixed from '../node/isFixed';
import splitText from '../text/splitText';
import splitNode from '../node/splitNode';
import canNodeWrap, { NON_WRAP_TYPES } from '../node/getWrap';
import getWrapArea from '../page/getWrapArea';
import getContentArea from '../page/getContentArea';
import createInstances from '../node/createInstances';
import shouldNodeBreak from '../node/shouldBreak';
import resolveTextLayout from './resolveTextLayout';
import resolveInheritance from './resolveInheritance';
import { resolvePageDimensions } from './resolveDimensions';

const isText = node => node.type === P.Text;

// Prevent splitting elements by low decimal numbers
const SAFTY_THRESHOLD = 0.001;

const assingChildren = (children, node) =>
  Object.assign({}, node, { children });

const getTop = node => node.box?.top || 0;

const allFixed = nodes => nodes.every(isFixed);

const isDynamic = node => !isNil(node.props?.render);

const relayoutPage = compose(
  resolveTextLayout,
  resolveInheritance,
  resolvePageDimensions,
);

const warnUnavailableSpace = node => {
  console.warn(
    `Node of type ${node.type} can't wrap between pages and it's bigger than available page height`,
  );
};

const warnFallbackSpace = node => {
  console.warn(
    `Node of type ${node.type} can't wrap between pages and it's bigger than available page height, falling back to wrap`,
  );
};

const breakableChild = (children, height, path = '') => {
  for (let i = 0; i < children.length; i += 1) {
    if (children[i].type === 'TEXT_INSTANCE') continue;

    if (shouldNodeBreak(children[i], children.slice(i + 1, height))) {
      return {
        child: children[i],
        path: `${path}/${i}`,
      };
    }

    if (children[i].children && children[i].children.length > 0) {
      const breakable = breakableChild(
        children[i].children,
        height,
        `${path}/${i}`,
      );
      if (breakable) return breakable;
    }
  }
  return null;
};

const splitByFirstChildBreak = (
  firstBreakableChild,
  currentNode,
  currentPath,
  height,
) => {
  const preBreakChildren = [];
  const postBreakChildren = [];

  const nextIndex = Number(currentPath.split('/').pop());

  const [preBreakNode, postBreakNode] = splitNode(currentNode, height);

  let preBreakLines = [];
  let preBreakHeight = 0;
  let postBreakLines = [];
  let postBreakHeight = 0;

  for (let i = 0; i < currentNode.children.length; i += 1) {
    const subjectNode = currentNode.children[i];
    if (i < nextIndex) {
      preBreakChildren.push(subjectNode);
      if (subjectNode.lines) {
        preBreakLines = preBreakLines.concat(subjectNode.lines);
      }
      if (subjectNode.box) preBreakHeight += subjectNode.box.height;
    } else if (i === nextIndex) {
      if (currentPath === firstBreakableChild.path) {
        const theBrokenChild = subjectNode;

        const props = Object.assign({}, theBrokenChild.props, {
          wrap: true,
          break: false,
        });

        const next = Object.assign({}, theBrokenChild, {
          props,
        });

        if (next.lines) postBreakLines = preBreakLines.concat(next.lines);
        if (next.box) postBreakHeight += next.box.height;

        postBreakChildren.push(next);
      } else {
        const [
          nestedPreBreakChild,
          nestedPostBreakChild,
        ] = splitByFirstChildBreak(
          firstBreakableChild,
          subjectNode,
          currentPath +
            firstBreakableChild.path
              .replace(currentPath, '')
              .split('/')
              .slice(0, 2)
              .join('/'),
          height,
        );

        if (nestedPreBreakChild) {
          preBreakChildren.push(nestedPreBreakChild);
          if (nestedPreBreakChild.lines) {
            postBreakLines = preBreakLines.concat(nestedPreBreakChild.lines);
          }
          if (nestedPreBreakChild.box.height)
            postBreakHeight += nestedPreBreakChild.box.height;
        }
        if (nestedPostBreakChild) {
          postBreakChildren.push(nestedPostBreakChild);
          if (nestedPostBreakChild.lines) {
            postBreakLines = postBreakLines.concat(nestedPostBreakChild.lines);
          }
          if (nestedPostBreakChild.box)
            postBreakHeight += nestedPostBreakChild.box.height;
        }
      }
    } else {
      if (subjectNode.lines) {
        postBreakLines = preBreakLines.concat(subjectNode.lines);
      }
      if (subjectNode.box) postBreakHeight += subjectNode.box.height;
      postBreakChildren.push(subjectNode);
    }
  }

  const preBreakBox = Object.assign({}, preBreakNode.box, {
    height: preBreakHeight,
  });

  const postBreakBox = Object.assign({}, postBreakNode.box, {
    height: postBreakHeight,
  });

  const finalPreBreakNode = Object.assign({}, preBreakNode, {
    box: preBreakBox,
    lines: preBreakLines,
  });

  const finalPostBreakNode = Object.assign({}, postBreakNode, {
    box: postBreakBox,
    lines: postBreakLines,
  });

  delete finalPostBreakNode.lines;
  delete finalPreBreakNode.lines;
  // use relayout to recompute lines to work with text I believe
  // this will need to be done differently.

  return [
    preBreakChildren.length === 0
      ? null
      : assingChildren(preBreakChildren, finalPreBreakNode),
    assingChildren(postBreakChildren, finalPostBreakNode),
  ];
};

const splitNodes = (height, contentArea, nodes) => {
  const currentChildren = [];
  const nextChildren = [];

  for (let i = 0; i < nodes.length; i += 1) {
    const child = nodes[i];
    const futureNodes = nodes.slice(i + 1);
    const futureFixedNodes = futureNodes.filter(isFixed);
    const nodeTop = getTop(child);
    const nodeHeight = child.box.height;
    const isOutside = height <= nodeTop;

    const shouldBreak = shouldNodeBreak(child, futureNodes, height);
    const shouldSplit = height + SAFTY_THRESHOLD < nodeTop + nodeHeight;
    const canWrap = canNodeWrap(child);
    const fitsInsidePage = nodeHeight <= contentArea;

    if (isFixed(child)) {
      nextChildren.push(child);
      currentChildren.push(child);
      continue;
    }

    if (isOutside) {
      const box = Object.assign({}, child.box, {
        top: child.box.top - height,
      });
      const next = Object.assign({}, child, { box });
      nextChildren.push(next);
      continue;
    }

    if (!fitsInsidePage && !canWrap) {
      if (NON_WRAP_TYPES.includes(child.type)) {
        // We don't want to break non wrapable nodes, so we just let them be.
        // They will be cropped, user will need to fix their ~image usage?
        currentChildren.push(child);
        nextChildren.push(...futureNodes);
        warnUnavailableSpace(child);
      } else {
        // This should fallback to allow minPresence ahead to dictate where we should break and such.
        const props = Object.assign({}, child.props, {
          wrap: true,
          break: false,
        });
        const next = Object.assign({}, child, { props });

        currentChildren.push(...futureFixedNodes);
        nextChildren.push(next, ...futureNodes);
        warnFallbackSpace(child);
      }

      break;
    }

    if (shouldBreak || (!canWrap && shouldSplit)) {
      const box = Object.assign({}, child.box, {
        top: child.box.top - height,
      });
      const props = Object.assign({}, child.props, {
        wrap: true,
        break: false,
      });
      const next = Object.assign({}, child, { box, props });

      currentChildren.push(...futureFixedNodes);
      nextChildren.push(next, ...futureNodes);
      break;
    }

    const firstBreakableChild =
      child.children &&
      child.children.length > 0 &&
      breakableChild(child.children, height);

    if (firstBreakableChild) {
      const [currentPageNode, nextPageNode] = splitByFirstChildBreak(
        firstBreakableChild,
        child,
        firstBreakableChild.path
          .split('/')
          .slice(0, 2)
          .join('/'),
        height,
      );

      if (currentPageNode) {
        const newNodeTop = getTop(currentPageNode);
        const newNodeHeight = currentPageNode.box.height;
        const newShouldSplit =
          height + SAFTY_THRESHOLD < newNodeTop + newNodeHeight;

        if (newShouldSplit) {
          const [currentSplitChild, nextSplitChild] = split(
            currentPageNode,
            height,
            contentArea,
          );

          if (currentSplitChild) {
            currentChildren.push(currentSplitChild);
            currentChildren.push(...futureFixedNodes);
          }

          if (nextSplitChild) {
            const box = Object.assign({}, nextSplitChild.box, {
              top: child.box.top - height,
            });
            const next = Object.assign({}, nextSplitChild, {
              box,
            });

            nextChildren.push(next);
          }

          const props = Object.assign({}, nextPageNode.props, {
            break: true,
          });
          const next = Object.assign({}, nextPageNode, {
            props,
            afterNextSplitChild: true,
          });

          nextChildren.push(next, ...futureNodes);

          break;
        } else {
          currentChildren.push(currentPageNode);
        }
      }

      currentChildren.push(...futureFixedNodes);

      const box = Object.assign({}, nextPageNode.box, {
        top: child.box.top - height,
      });
      const next = Object.assign({}, nextPageNode, { box });

      nextChildren.push(next, ...futureNodes);

      break;
    }

    if (shouldSplit) {
      const [currentChild, nextChild] = split(child, height, contentArea);

      // All children are moved to the next page, it doesn't make sense to show the parent on the current page
      if (child.children.length > 0 && currentChild.children.length === 0) {
        const box = Object.assign({}, child.box, {
          top: child.box.top - height,
        });
        const next = Object.assign({}, child, { box });

        currentChildren.push(...futureFixedNodes);
        nextChildren.push(next, ...futureNodes);
        break;
      }

      if (currentChild) {
        currentChildren.push(currentChild);
        currentChildren.push(...futureFixedNodes);
      }
      if (nextChild) nextChildren.push(nextChild);

      nextChildren.push(...futureNodes);

      break;
    }

    currentChildren.push(child);
  }

  return [currentChildren, nextChildren];
};

const splitChildren = (height, contentArea, node) => {
  const children = node.children || [];
  const availableHeight = height - getTop(node);
  return splitNodes(availableHeight, contentArea, children);
};

const splitView = (node, height, contentArea) => {
  const [currentNode, nextNode] = splitNode(node, height);
  const [currentChilds, nextChildren] = splitChildren(
    height,
    contentArea,
    node,
  );

  return [
    assingChildren(currentChilds, currentNode),
    assingChildren(nextChildren, nextNode),
  ];
};

const split = (node, height, contentArea) =>
  isText(node) ? splitText(node, height) : splitView(node, height, contentArea);

const shouldResolveDynamicNodes = node => {
  const children = node.children || [];
  return isDynamic(node) || children.some(shouldResolveDynamicNodes);
};

const resolveDynamicNodes = (props, node) => {
  const isNodeDynamic = isDynamic(node);

  // Call render prop on dynamic nodes and append result to children
  const resolveChildren = (children = []) => {
    if (isNodeDynamic) {
      const res = node.props.render(props);
      return createInstances(res)
        .filter(Boolean)
        .map(n => resolveDynamicNodes(props, n));
    }

    return children.map(c => resolveDynamicNodes(props, c));
  };

  // We reset dynamic text box so it can be computed again later on
  const resetHeight = isNodeDynamic && isText(node);
  const box = resetHeight ? { ...node.box, height: 0 } : node.box;

  const children = resolveChildren(node.children);
  const lines = isNodeDynamic ? null : node.lines;

  return Object.assign({}, node, { box, lines, children });
};

const resolveDynamicPage = (props, page, fontStore) => {
  if (shouldResolveDynamicNodes(page)) {
    const resolvedPage = resolveDynamicNodes(props, page);
    return relayoutPage(resolvedPage, fontStore);
  }

  return page;
};

const splitPage = (page, pageNumber, fontStore) => {
  const wrapArea = getWrapArea(page);
  const contentArea = getContentArea(page);
  const dynamicPage = resolveDynamicPage({ pageNumber }, page, fontStore);
  const height = page.style.height;

  const [currentChilds, nextChilds] = splitNodes(
    wrapArea,
    contentArea,
    dynamicPage.children,
  );

  const relayout = node => relayoutPage(node, fontStore);

  const currentBox = { ...page.box, height };
  const currentPage = relayout(
    Object.assign({}, page, { box: currentBox, children: currentChilds }),
  );

  if (nextChilds.length === 0 || allFixed(nextChilds))
    return [currentPage, null];

  const nextBox = omit('height', page.box);
  const nextProps = omit('bookmark', page.props);

  const nextPage = relayout(
    Object.assign({}, page, {
      props: nextProps,
      box: nextBox,
      children: nextChilds,
    }),
  );

  return [currentPage, nextPage];
};

const resolvePageIndices = (fontStore, page, pageNumber, pages) => {
  const totalPages = pages.length;

  const props = {
    totalPages,
    pageNumber: pageNumber + 1,
    subPageNumber: page.subPageNumber + 1,
    subPageTotalPages: page.subPageTotalPages,
  };

  return resolveDynamicPage(props, page, fontStore);
};

const assocSubPageData = subpages => {
  return subpages.map((page, i) => ({
    ...page,
    subPageNumber: i,
    subPageTotalPages: subpages.length,
  }));
};

const dissocSubPageData = page => {
  return omit(['subPageNumber', 'subPageTotalPages'], page);
};

const paginate = (page, pageNumber, fontStore) => {
  if (!page) return [];

  if (page.props?.wrap === false) return [page];

  let splittedPage = splitPage(page, pageNumber, fontStore);

  const pages = [splittedPage[0]];
  let nextPage = splittedPage[1];

  while (nextPage !== null) {
    splittedPage = splitPage(nextPage, pageNumber + pages.length, fontStore);

    pages.push(splittedPage[0]);
    nextPage = splittedPage[1];
  }

  return pages;
};

/**
 * Performs pagination. This is the step responsible of breaking the whole document
 * into pages following pagiation rules, such as `fixed`, `break` and dynamic nodes.
 *
 * @param {Object} node
 * @param {Object} fontStore font store
 * @returns {Object} layout node
 */
const resolvePagination = (doc, fontStore) => {
  let pages = [];
  let pageNumber = 1;

  for (let i = 0; i < doc.children.length; i += 1) {
    const page = doc.children[i];
    let subpages = paginate(page, pageNumber, fontStore);

    subpages = assocSubPageData(subpages);
    pageNumber += subpages.length;
    pages = pages.concat(subpages);
  }

  pages = pages.map((...args) =>
    dissocSubPageData(resolvePageIndices(fontStore, ...args)),
  );

  return assingChildren(pages, doc);
};

export default resolvePagination;
