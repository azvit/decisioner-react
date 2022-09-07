import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../hook/redux';
import styles from './calculation.module.css';

export function CritAndAltDescription() {

    const { t } = useTranslation();
    const { currentBlank } = useAppSelector(state => state.blank)

    return(
        <div className={styles.divContainerFlex}>
                <div className={styles.divHalfWidth}>
                    <table className={styles.table}>
                        <tr className="text-center">
                            <th className={styles.tableCellMini}>
                                {t('criterias')}
                            </th>
                            <th className={styles.blueBorder}>
                                {t('description')}
                            </th>
                        </tr>
                            {
                                currentBlank!.blank.criteria.map((criteria, index) => <tr>
                                    <td className={styles.tableCellMini}>
                                    <p className={styles.textML}>{criteria}</p>
                                    </td>
                                    <td className={styles.blueBorder}>
                                        <p className={styles.textML}>{currentBlank!.blank.criteriaDescription[index]}</p>
                                    </td>
                                </tr>)
                            }

                    </table>
                </div>
                <div className={styles.divHalfWidth}>
                    <table className={styles.table}>
                        <tr className="text-center">
                            <th className={styles.tableCellMini}>
                                {t('alternatives')}
                            </th>
                            <th className={styles.blueBorder}>
                                {t('description')}
                            </th>
                        </tr>
                            {
                                currentBlank!.blank.items.map((item, index) => <tr>
                                    <td className={styles.tableCellMini}>
                                        <p className={styles.textML}>{item}</p>
                                    </td>
                                    <td className={styles.blueBorder}>
                                        <p className={styles.textML}>{currentBlank!.blank.itemsDescription[index]}</p>
                                    </td>
                                </tr>)
                            }
                    </table>
                </div>
            </div>
    )
}