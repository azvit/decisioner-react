import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../hook/redux"
import styles from './calculation.module.css';

export function GroupExpertiseDescription() {
    const { t } = useTranslation();
    const { currentGroupExpertise } = useAppSelector(state => state.groupExpertise)

    return(
        <div className={styles.groupDescriptionWindow}>
                <div><p className={styles.inlineText}>{t('method_input')} </p><p className="inline">{t(`${currentGroupExpertise!.template.method}`)}</p></div>
                <div><p className={styles.inlineText}>{t('aim_input')} </p><p className="inline">{currentGroupExpertise!.template.aim}</p></div>
                <div><p className={styles.inlineText}>{t('description_input')} </p><p className="inline">{currentGroupExpertise!.template.description}</p></div>
        </div>

    )
}