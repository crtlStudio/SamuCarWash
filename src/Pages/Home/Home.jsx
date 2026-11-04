import { useEffect, useState } from 'react'
import styles from './Home.module.css'
import { Link } from 'react-router-dom'
import arrow from '../../Images/next.png'
import whats from '../../Images/whats.png'
import face from '../../Images/facebook.png'
import pin from '../../Images/location.png'
import linhas from '../../Images/linhas.png'
import CrtlStudio from '../../Components/crtlStudio'
import logo from '../../Images/fht1.jpeg'
import { supabase } from '../../lib/supabase'

function formatarDuracao(min) {
    if (min < 60) return `${min} min`
    const h = Math.floor(min / 60)
    const m = min % 60
    return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, '0')}`
}

export default function Home() {

const numero = '351914268161'
const url = `https://wa.me/${numero}`

const [packs, setPacks] = useState(undefined) // undefined = a carregar
const [aberto, setAberto] = useState(false)
const [escolhido, setEscolhido] = useState(null)

useEffect(() => {
    supabase
        .from('services')
        .select('id, slug, name, description, price, duration_minutes')
        .eq('active', true)
        .order('sort_order')
        .then(({ data, error }) => {
            if (error) {
                console.error('Erro ao carregar packs:', error)
                setPacks([])
                return
            }
            setPacks(data)
        })
}, [])

function escolher(p) {
    setEscolhido(p)
    setAberto(false)
}

  return (
    <div className={styles.Container}>

        <div className={styles.Content}>
            <img className={styles.Logo} src={logo} alt="Logo" />
        </div>

        <div className={styles.banner} translate="no">
            <span className={styles.bannerTexto}>6 Novos pack's</span>
        </div>

        <div className={styles.texto}>
            <h1>Nova marcação</h1>
        </div>

        <div className={styles.packsContent}>

            {packs === undefined && <p className={styles.aviso}>A carregar...</p>}

            {packs && packs.length === 0 && (
                <p className={styles.aviso}>Packs brevemente disponíveis.</p>
            )}

            {packs && packs.length > 0 && (
                <>
                    <button
                        type="button"
                        className={`${styles.dropBotao} ${aberto ? styles.dropBotaoAberto : ''}`}
                        onClick={() => setAberto((v) => !v)}
                    >
                        <span>{escolhido ? escolhido.name : 'Escolhe o teu pack'}</span>
                        <span className={`${styles.seta} ${aberto ? styles.setaAberta : ''}`}>▾</span>
                    </button>

                    {aberto && (
                        <ul className={styles.dropLista}>
                            {packs.map((p) => (
                                <li key={p.id}>
                                    <button
                                        type="button"
                                        className={styles.dropItem}
                                        onClick={() => escolher(p)}
                                    >
                                        <span>{p.name}</span>
                                        <span className={styles.dropPreco}>{p.price}€</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {escolhido && !aberto && (
                        <div className={styles.detalhe}>
                            <div className={styles.detalheTexto}>
                                <h3>{escolhido.name}</h3>
                                {escolhido.description && <p>{escolhido.description}</p>}
                                <p className={styles.detalheMeta}>
                                    <span className={styles.detalhePreco}>{escolhido.price}€</span>
                                    <span> · {formatarDuracao(escolhido.duration_minutes)}</span>
                                </p>
                            </div>

                            <Link to={`/marcar/${escolhido.slug}`} className={styles.marcar}>
                                <span>Marcar</span>
                                <img src={arrow} alt="" className={styles.marcarSeta} />
                            </Link>
                        </div>
                    )}
                </>
            )}

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
                    <a href='https://www.facebook.com/profile.php?id=61589358083659&locale=pt_PT'  
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
