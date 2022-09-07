import { useTranslation } from 'react-i18next';
import styles from '../calculation.module.css';

export function AhpInstructions() {

    const { t } = useTranslation();

    return(
        <div className={styles.blankInstructions}>
            <p className="font-bold">{t('instruction_act')}</p>
            <p>{t('instruction_ahp_step_1')}</p>
            <p className={styles.textML}>  {t('instruction_ahp_1')}</p>
            <p className={styles.textML}>  {t('instruction_ahp_3')}</p>
            <p className={styles.textML}>  {t('instruction_ahp_5')}</p>
            <p className={styles.textML}>  {t('instruction_ahp_7')}</p>
            <p className={styles.textML}>  {t('instruction_ahp_9')}</p>
            <p className={styles.textML}>  {t('instruction_ahp_between')}</p>
            <p>{t('instruction_ahp_step_2')}</p>
        </div>
    )
}