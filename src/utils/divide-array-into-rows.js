export default function(sourceArray, rowSize) {
  return sourceArray.reduce((acc, cur, index) => {
    if (index % rowSize === 0) {
      acc.push([cur]);
    } else {
      acc[acc.length-1].push(cur);
    }
    return acc;
  }, []);
}