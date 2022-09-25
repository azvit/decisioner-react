export interface IAirport {
    id: number
    name: string
    ident: string
    local_code: string
    region: string
    type: string
    country: string
}

export interface IUser {
    _id: string,
    phone: string
    email: string
    name: string
    role: string
    degree: string
    academicStatus: string
    direction: string
    activitySphere: string
    expertiseHistory: string[]
}

export interface ServerResponse {
    message: string
}

export interface AuthData {
    login: string,
    password: string
}

export interface IBlank<T> {
    _id: string,
    creator: string,
    groupExpertise: string | null,
    isClosed: boolean,
    name: string,
    method: string,
    creationDate: Date,
    blank: BlankEvaluations,
    result: T
}

export interface BlankEvaluations {
    aim: string,
    description: string,
    items: string[],
    criteria: string[],
    itemsDescription: string[],
    criteriaDescription: string[],
    criteriaRank: any[],
    criteriaItemRank: any[][] 
}

interface ErrorContext {
    type: string,
    context: any
}

export interface BlankAhp {
    error: ErrorContext | null,
    rankingMatrix: [number[]],
    itemRankMetaMap: any,
    criteriaRankMetaMap: {
        ci: number,
        ri: number,
        cr: number,
        weightedVector: number[]
    },
    rankedScoresMap: any
    rankedScores: number[]
}

export interface BlankNorm {
    criteriaScores: number[],
    rankedScores: number[]
}

export interface BlankRange {
    rankedScores: number[],
    cArr: number[],
    aArr: number[],
    sumRank: number
}

export interface BlankForm {
    name: string,
    method: string,
    blank: {
        aim: string
        items: string[],
        itemsDescription: string[],
        description: string,
        criteria: string[],
        criteriaDescription: string[]
    }
}

export const matrixInputMap = new Map([
    [1, '1'],
    [2, '2'],
    [3, '3'],
    [4, '4'],
    [5, '5'],
    [6, '6'],
    [7, '7'],
    [8, '8'],
    [9, '9'],
    [0.5, '1/2'],
    [0.3333333333333333, '1/3'],
    [0.25, '1/4'],
    [0.2, '1/5'],
    [0.1666666666666667, '1/6'],
    [0.1428571428571429, '1/7'],
    [0.125, '1/8'],
    [0.1111111111111111, '1/9']
]);

export const matrixOutputMap = new Map([
    ['1', 1],
    ['2', 2],
    ['3', 3],
    ['4', 4],
    ['5', 5],
    ['6', 6],
    ['7', 7],
    ['8', 8],
    ['9', 9],
    ['1/2', 0.5],
    ['1/3', 0.3333333333333333],
    ['1/4', 0.25],
    ['1/5', 0.2],
    ['1/6', 0.1666666666666667],
    ['1/7', 0.1428571428571429],
    ['1/8', 0.125],
    ['1/9', 0.1111111111111111]
]);

export const matrixReverseMap = new Map([
    ['1', '1'],
    ['2', '1/2'],
    ['3', '1/3'],
    ['4', '1/4'],
    ['5', '1/5'],
    ['6', '1/6'],
    ['7', '1/7'],
    ['8', '1/8'],
    ['9', '1/9'],
    ['1/2', '2'],
    ['1/3', '3'],
    ['1/4', '4'],
    ['1/5', '5'],
    ['1/6', '6'],
    ['1/7', '7'],
    ['1/8', '8'],
    ['1/9', '9']
]);

export const matrixRangeRevereMap = new Map([
    ['0', '1'],
    ['1', '0'],
    ['0.5', '0.5']
])