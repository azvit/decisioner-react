import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../hook/redux"
import styles from './calculation.module.css';

export function BlankDescription() {
    const { t } = useTranslation();
    const { currentBlank } = useAppSelector(state => state.blank)

    return(
        <div className={styles.blankDescriptionWindow}>
                <div><p className={styles.inlineText}>{t('method_input')} </p><p className="inline">{currentBlank!.method}</p></div>
                <div><p className={styles.inlineText}>{t('aim_input')} </p><p className="inline">{currentBlank!.blank.aim}</p></div>
                <div><p className={styles.inlineText}>{t('description_input')} </p><p className="inline">{currentBlank!.blank.description}</p></div>
        </div>
    )
}