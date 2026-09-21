import styles from './Home.module.css'
import { Link } from 'react-router-dom'
import interior from '../../Images/car-wash.png'
import exterior from '../../Images/upholstery.png'
import completa from '../../Images/full-service.png'
import arrow from '../../Images/next.png'
import whats from '../../Images/whats.png'
import face from '../../Images/facebook.png'
import pin from '../../Images/location.png'
import linhas from '../../Images/linhas.png'
import CrtlStudio from '../../Components/crtlStudio'


export default function Home() {

const numero = '351916037361'
const url = `https://wa.me/${numero}`


  return (
    <div className={styles.Container}>

        <div className={styles.Content}>
            <img className={styles.Logo} src="./src/Images/fht1.jpeg" alt="Logo" />
        </div>

        <div className={styles.texto}>
            <h1>Nova marcação</h1>
        </div>

        <div className={styles.cardContent}>

            <div className={styles.cardItem}>
                <div className={styles.iconContent}>
                    <img src={interior} alt='interior' className={styles.icon} />
                </div>

                <div className={styles.descrição}>
                    <h3> Lavagem interior</h3>
                    <p style={{color: 'rgb(209, 49, 49)', marginTop:'5px', fontSize:'0.7rem'}}>12€</p>
                </div>

               <Link to="/marcar/interior" className={styles.card}>
                    <div className={styles.arrowContent}>
                        <img src={arrow} alt="" className={styles.arrow} />
                    </div>
                </Link>
            </div>

            <div className={styles.cardItem}>
                <div className={styles.iconContent}>
                    <img src={exterior} alt='exterior' className={styles.icon} />
                </div>

                <div className={styles.descrição}>
                    <h3> Lavagem exterior</h3>
                    <p style={{color: 'rgb(214, 56, 56)', marginTop:'5px', fontSize:'0.8rem'}}> 12€</p>
                </div>

                <Link to="/marcar/exterior" className={styles.card}>
                    <div className={styles.arrowContent}>
                        <img src={arrow} alt="" className={styles.arrow} />
                    </div>
                </Link>
            </div>

            <div className={styles.cardItem1}>                
                <div className={styles.iconContent}>
                    <img src={completa} alt='completo' className={styles.icon} />
                </div>

                <div className={styles.descrição}>
                    <h3> Pack completo</h3>
                    <h3></h3>
                    <p style={{color: 'rgb(223, 122, 49)', marginTop:'5px', fontSize:'0.8rem'}}> 20€</p>
                </div>

                 <Link to="/marcar/completo" className={styles.card}>
                    <div className={styles.arrowContent}>
                        <img src={arrow} alt="" className={styles.arrow} />
                    </div>
                </Link>
            </div>

        </div>

        <div className={styles.contactosContent}>
            <div className={styles.bloco}>
                <div className={styles.redesContent}>
                    <button onClick={() => window.open(url, '_blank', 'noopener,noreferrer')} 
                        className={styles.button}>
                        <img src={whats} alt='whatsApp' className={styles.redes} />
                    </button>    
                </div>

                <div className={styles.link}>
                    <h3>Enviar<br></br> mensagem</h3>
                </div>
            </div>

            <div className={styles.bloco}>
                <div className={styles.redesContent}>
                    <a href='https://www.facebook.com/search/top?q=samu%20car%20wash&locale=pt_PT'  
                        target="_blank" rel="noopener noreferrer" >
                        <img src={face} alt='whatsApp' className={styles.redes} />
                    </a>                           
                </div>

                <div className={styles.link}>
                    <h3>Segue-nos</h3>
                </div>
            </div>

            <div className={styles.bloco1}>
                <div className={styles.redesContent}>
                    <a href='https://www.google.com/maps/place/R.+Nova+de+Gens+36,+Alfena/@41.2271113,-8.5267788,17z/data=!3m1!4b1!4m6!3m5!1s0xd2461a1be837b65:0xe23cbb1350c0981!8m2!3d41.2271113!4d-8.5241985!16s%2Fg%2F11c27d3cv5?entry=ttu&g_ep=EgoyMDI2MDkxNi4wIKXMDSoASAFQAw%3D%3D'  
                        target="_blank" rel="noopener noreferrer" >
                        <img src={pin} alt='whatsApp' className={styles.redes} />
                    </a>
                </div>

                <div className={styles.link}>
                    <h3>Onde<br></br> estamos</h3>
                </div>
            </div>
        </div>

        <div className={styles.linhasContent}>
             <img src={linhas} alt='linhas' className={styles.linhas} />
        </div>

        <CrtlStudio />
    </div>
  )
}