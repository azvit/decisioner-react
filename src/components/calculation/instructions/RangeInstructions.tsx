import { useTranslation } from 'react-i18next';
import styles from '../calculation.module.css';

export function RangeInstructions() {

    const { t } = useTranslation();

    return(
        <div className={styles.blankInstructions}>
            <p className="font-bold">{t('instruction_range_type1')}</p>
            <p>{t('instruction_range_type1_step1')}</p>
            <p>{t('instruction_range_final_step')}</p>
            <p className="font-bold">{t('instruction_range_type2')}</p>
            <p>{t('instruction_range_type2_step1')}</p>
            <p className={styles.textML}>  {t('instruction_range_type2_desc1')}</p>
            <p className={styles.textML}>  {t('instruction_range_type2_desc2')}</p>
            <p className={styles.textML}>  {t('instruction_range_type2_desc3')}</p>
            <p>{t('instruction_range_final_step')}</p>
        </div>
    )
}