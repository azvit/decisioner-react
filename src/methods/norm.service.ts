
  export const normCalc = async (matrixCrit: any[], matrixItem: any[],) => {
    let result = [];
    let score: number = 0;
    let matrixNormCrit = [];
    let sum = 0;
    for (let i = 0; i < matrixCrit.length; i++) {
      sum += Number(matrixCrit[i])
    }
    console.log(sum);
    for (let i = 0; i < matrixCrit.length; i++) {
      matrixNormCrit.push(Number(matrixCrit[i])/sum);
    }
    for (let i = 0; i < matrixItem.length; i++) {
      for (let j = 0; j < matrixItem[i].length; j++) {
        score = score + (matrixNormCrit[j] * Number(matrixItem[i][j]));
      }
      result.push(score);
      score = 0;
    }
    return { rankedScores: result, criteriaScores: matrixNormCrit};
  }

