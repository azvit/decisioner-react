  export const rangeRun = async (ranks: number[], sums: number[] = []) => {
    let sumRank = 0;
    let sArr = [];
    let aMax = Math.max.apply(null, ranks);
    console.log(aMax)
    for (let i = 0; i < ranks.length; i++) {
      sArr.push(aMax - Number(ranks[i]));
      sumRank += Number(ranks[i]);
    }
    console.log(sums);
    console.log({rankedScores: sArr, cArr: sums,  sumRank: sumRank})
    return {rankedScores: sArr, cArr: sums, aArr: ranks, sumRank: sumRank};
  }

  export const rangeRunWithCompares = async (matrix: [any[]]) => {
    let sums = [];
    let aArr = [];
    for (let i = 0; i < matrix.length; i++) {
      let rowSum = 0;
      for (let j = 0; j < matrix[0].length; j++) {
        if (j !== i) {
          rowSum += Number(matrix[i][j])
        }
      }
      sums.push(rowSum);
    }
    let cMax = Math.max.apply(null, sums);
    console.log(cMax)
    for (let i = 0; i < sums.length; i++) {
      aArr.push((cMax + 1) - sums[i])
    }
    console.log(aArr)
    console.log(sums)
    return rangeRun(aArr, sums);
  }

/*
runWithComparison (matrix: any[]) {
    let sumArr: number[] = [];
    let sum = 0;
    for (let i = 0; matrix.length; i++) {
      for (let j = 0; matrix.length; j++) {
        sum += Number(matrix[i]);
      }
      sumArr.push(sum);
      sum = 0;
    }
    let cMax = Math.max.apply(null, sumArr);
    let rankArr: number[] = [];
    for (let i = 0; sumArr.length; i++) {
      rankArr.push((cMax + 1) - sumArr[i])
    }
  }
 */
