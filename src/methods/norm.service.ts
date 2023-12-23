
  export const normCalc = async (matrixItem: any[],) => {
    let result = [];
    let score: number = 0;
    let matrixNormCrit = [];
    let sum = 0;
    console.log(sum);
    for (let i = 0; i < matrixItem.length; i++) {
      for (let j = 0; j < matrixItem[i].length; j++) {
        score = score + Number(matrixItem[i][j]);
      }
      result.push(score);
      score = 0;
    }
    return { rankedScores: result};
  }

