import { useTranslation } from "react-i18next";
import { AhpCalc } from "../components/calculation/AhpCalc";
import { NormCalc } from "../components/calculation/NormCalc";
import { AHP_METHOD, NORM_METHOD } from "../constants";
import { useAppSelector } from "../hook/redux";

export function CalculationPage () {
    const { t } = useTranslation();
    const { currentBlank } = useAppSelector(state => state.blank);

    return (
        <>
            {
                (currentBlank!.method === AHP_METHOD) &&
                <AhpCalc/>
            }
            {
                (currentBlank!.method === NORM_METHOD) &&
                <NormCalc/>
            }
        </>
    )
}