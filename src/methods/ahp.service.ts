import {BlankEvaluations} from '../models/models';
declare var require: any;
const AHP = require('./ahp/index');


export const ahpCalc = async(input: BlankEvaluations | undefined) => {
  let ahpContext: any;
  let ahpData: BlankEvaluations | undefined
  ahpContext = new AHP();
  ahpData = input;
  ahpContext.addItems(ahpData?.items);
  ahpContext.addCriteria(ahpData?.criteria);
  console.log('service ahp gets this');
  console.log(ahpData);
    for (let i = 0; i < (ahpData?.criteriaItemRank.length??0); i++) {
      ahpContext.rankCriteriaItem(ahpData?.criteria[i], ahpData?.criteriaItemRank[i]);
    }
    ahpContext.rankCriteria(ahpData?.criteriaRank);
    let result = ahpContext.run();
    let map = Object.entries(result.itemRankMetaMap);
    result.itemRankMetaMap = new Map(map);
    let itemRankMap = [];
    for (let i = 0; i < (input?.criteria.length??0); i++) {
      itemRankMap.push(result.itemRankMetaMap.get(input?.criteria[i]))
    }
    result.itemRankMetaMap = itemRankMap;
    return result
}
  
  

