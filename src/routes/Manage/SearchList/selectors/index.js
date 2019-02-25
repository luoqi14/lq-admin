import { createSelector } from 'reselect';

const getMenus = (state) => state.common.menus;

const getTopMenu = createSelector(
  [getMenus],
  () => undefined
);

export default getTopMenu;
