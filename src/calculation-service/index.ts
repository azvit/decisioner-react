export const round = (value: number) => {
    return +value.toFixed(3);
}

export const isMax = (n: number, array: number[]) => {
    return n === Math.max.apply(null, array);
}

export const isMaxItem = (n: number, j: number, arrayItem: [number[]]) => {
    let array = [];
    for (let i = 0; i < arrayItem.length; i++) {
        array.push(arrayItem[i][j])
    }
    return n === Math.max.apply(null, array);
}

export const getOptions = (data: any) => {
    return {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: data
            }
        ]
    }
}