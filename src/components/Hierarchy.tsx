import ReactEcharts from "echarts-for-react";
import { useTranslation } from "react-i18next";
import { build } from "../hierarchy";

export function Hierarchy(props: any) {

    const { t } = useTranslation();

    const getHierarchyData = () =>{
        return build(props.blank, t('hierarchy_title'))
    }

    return(
        <div className="h-[320px] w-[98%]">
            <ReactEcharts 
                notMerge={true}
                lazyUpdate={true} 
                option={getHierarchyData()}
            />
        </div>
    )
}