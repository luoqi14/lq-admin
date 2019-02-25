import { createSelector } from 'reselect';

const getNums = (state) => state.Tpl.nums;

const getTotal = createSelector(
  [getNums],
  (nums) => nums[0] + nums[1]
);

export default getTotal;
