import {EChartsOption} from "echarts/types/dist/echarts";
  let chartOptions: EChartsOption
  let startX: number = 550;
  let data: [{ name: any; x: number; y: number }]
  let x: number[] = [0];

export const build = (entity: any, title: string) => {
    data = [{
      name: entity.aim,
      x: startX,
      y: 100
    }];
    addNodes(entity)
      let links = [];
      for (let i = 1; i <= entity.criteria.length; i++) {
        links.push({
          source: 0,
          target: i
        })
        for (let j = entity.criteria.length + 1; j <= entity.items.length + entity.criteria.length; j++) {
          links.push({
            source: i,
            target: j
          })
        }
      }
      chartOptions = {
        title: {
          text: title
        },
        tooltip: {},
        animationDurationUpdate: 0,
        series: [{
          type: 'graph',
          layout: 'none',
          symbolSize: 50,
          roam: false,
          label: {
            textBorderColor: '#000000',
            textBorderWidth: 5,
            show: true,
            fontSize: 16
          },
          symbolKeepAspect: true,
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          data: data,
          links: links,
          lineStyle: {
            opacity: 0.9,
            width: 2,
            dashOffset: 10,
            curveness: 0
          }
        }]
      }
    return chartOptions;
  }

const addNodes = (entity: any) => {
    let indexCrit;
    let indexItem;
    if (entity.criteria.length % 2 != 0) {
      x = [startX];
      indexCrit = 1;
    } else {
      x = [];
      indexCrit = 0;
    }
    let ic = 1;
    let index = 0;
    for (let i = indexCrit; i < entity.criteria.length/2; i++) {
      x.push(startX - (ic/(2-indexCrit) * 2*(startX/entity.criteria.length)));
      ic++
      index = i;
    }
    for (let i = 0; i < entity.criteria.length/2; i++) {
      data.push({
        name: entity.criteria[i],
        x: <number>x.pop(),
        y: 200
      })
    }
    ic = 1;
    for (let i = index+1; i < entity.criteria.length; i++) {
      x.push(startX + (ic/(2-indexCrit) * 2*(startX/entity.criteria.length)));
      ic++
    }
    for (let i = entity.criteria.length-1; i > index; i--) {
      data.push({
        name: entity.criteria[i],
        x: <number>x.pop(),
        y: 200
      })
    }
    ic = 1;
    if (entity.items.length % 2 != 0) {
      x = [startX];
      indexItem = 1;
    } else {
      x = [];
      indexItem = 0;
    }
    for (let i = indexItem; i < entity.items.length/2; i++) {
      x.push(startX - (ic/(2-indexItem) * 2*(startX/entity.items.length)));
      ic++
      index = i;
    }
    for (let i = 0; i < entity.items.length/2; i++) {
      data.push({
        name: entity.items[i],
        x: <number>x.pop(),
        y: 300
      })
    }
    ic = 1;
    for (let i = index+1; i < entity.items.length; i++) {
      x.push(startX + (ic/(2-indexItem) * 2*(startX/entity.items.length)));
      ic++
    }
    for (let i = entity.items.length - 1; i > index; i--) {
      data.push({
        name: entity.items[i],
        x: <number>x.pop(),
        y: 300
      })
    }
  }
