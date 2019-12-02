// Selectors can compute derived data, allowing Redux to store the minimal possible state.
// Selectors are efficient. A selector is not recomputed unless one of its arguments change.
// Selectors are composable. They can be used as input to other selectors.
// call selectors as regular functions inside mapStateToProps
import { createSelector } from 'reselect';

const getMenus = state => state.common.menus;

const getLocation = (state, props) =>
  props ? props.history.location.pathname : window.location.pathname;

export const getSideMenus = createSelector(
  [getMenus],
  menus => menus || []
);

export const getMenuRouter = createSelector(
  [getMenus, getLocation],
  (allMenus, location) => {
    const menuRouter = [];
    const findMenu = menus => {
      let res = false;
      for (let i = 0; i < menus.length; i += 1) {
        const menu = menus[i];
        menuRouter.push(menu);
        if (menu.href === location) {
          return true;
        } else if (menu.children) {
          res = findMenu(menu.children);
          if (!res) {
            menuRouter.pop();
          } else {
            return true;
          }
        } else {
          menuRouter.pop();
        }
      }
      return res;
    };
    findMenu(allMenus);
    return menuRouter;
  }
);

export default getSideMenus;
