import styles from './crtlStudio.module.css'
import crtl from '../Images/Logo_sFundo.png'


export default function CrtlStudio (){
    return(
        <>
        <div className={styles.crtlContent}>
            <div className={styles.crtlText}>
                <h3>Desenvolvido por</h3>
            </div>
        <div className={styles.crtlLogo}>
            <img src={crtl} alt='crtlstudio Logo' className={styles.myLogo} />
                </div>
        </div>
        </>
    )
}