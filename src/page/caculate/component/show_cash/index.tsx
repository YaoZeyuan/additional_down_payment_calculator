export default ({ cash = 0 }: { cash: number }) => {
  // 保留2位小数
  return <div>{cash.toFixed(2)}</div>;
};
