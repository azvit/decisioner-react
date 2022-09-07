import { useTranslation } from 'react-i18next';
import styles from '../calculation.module.css';

export function NormInstructions() {

    const { t } = useTranslation();

    return(
        <div className={styles.blankInstructions}>
            <p className="font-bold">{t('instruction_act')}</p>
            <p>{t('instruction_norm_step_1')}</p>
            <p>{t('instruction_norm_step_2')}</p>
            <p>{t('instruction_norm_step_3')}</p>
        </div>
    )
}