import styles from './Marcacao.module.css'
import { useParams, Navigate, Link } from 'react-router-dom'
import { HORARIO } from '../../data/horario'
import { getHorasLivres } from '../../utils/disponibilidade'
import { inicioDoDia, somarDias, segundaDaSemana, mesmoDia } from '../../utils/datas'
import arrow from '../../Images/next.png'
import carro from '../../Images/wash.png'
import relogio from '../../Images/wall-clock.png'
import { VEICULOS } from '../../data/veiculos'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'


export default function Marcacao() {

    const { servicoId } = useParams()
    const [servico, setServico] = useState(undefined)  // undefined = a carregar; null = não encontrado

    useEffect(() => {
        supabase
        .from('services')
        .select('*')
        .eq('slug', servicoId)
        .eq('active', true)
        .maybeSingle()
        .then(({ data, error }) => {
        if (error) console.error('Erro ao carregar serviço:', error)
        setServico(data) // null se não existir
        })
    }, [servicoId])

    const hoje = inicioDoDia(new Date())
    const primeiroDia = hoje.getDay() === 0 ? somarDias(hoje, 1) : hoje
    const primeiraSemana = segundaDaSemana(primeiroDia)

    const [dia, setDia] = useState(primeiroDia)
    const [semana, setSemana] = useState(primeiraSemana)
    const [hora, setHora] = useState(null)

    const [nome, setNome] = useState('')
    const [telemovel, setTelemovel] = useState('')
    const [marca, setMarca] = useState('')
    const [modelo, setModelo] = useState('')

    const [ocupados, setOcupados] = useState([])

    useEffect(() => {
        const inicioDia = new Date(dia)
        inicioDia.setHours(0, 0, 0, 0)
        const fimDia = new Date(dia)
        fimDia.setHours(23, 59, 59, 999)

        supabase
            .rpc('get_busy_slots', {
                p_from: inicioDia.toISOString(),
                p_to: fimDia.toISOString(),
            })
            .then(({ data, error }) => {
                if (error) {
                    console.error('Erro ao carregar horas ocupadas:', error)
                    return
                }
                setOcupados(
                    data.map((o) => ({
                        inicio: new Date(o.starts_at),
                        fim: new Date(o.ends_at),
                    }))
                )
            })
    }, [dia])

    const [aEnviar, setAEnviar] = useState(false)
    const [erro, setErro] = useState('')
    const [confirmada, setConfirmada] = useState(null) // guarda o resultado da marcação feita

    if (servico === undefined) return null // ainda a carregar
    if (servico === null) return <Navigate to="/" replace /> // não existe

    if (confirmada) {
    return (
            <div className={styles.sucessoContent}>
                <h2>Pré-reserva guardada</h2>
                <p>Aguarde confirmação.</p>
                <p>
                    {servico.name} · {hora.toLocaleDateString('pt-PT')} às{' '}
                    {hora.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <Link to="/" className={styles.voltar}>Voltar ao início</Link>
            </div>
        )
    }

    const podeConfirmar = hora !== null && nome.trim() !== '' && telemovel.trim() !== ''

    const dias = Array.from({ length: 7 }, (_, i) => somarDias(semana, i))
    const semanaAnteriorBloqueada = semana <= primeiraSemana

    function mudarSemana(n) {
        setSemana(somarDias(semana, 7 * n))
    }

    function escolherDia(d) {
        setDia(d)
        setHora(null) // ao mudar de dia, a hora escolhida deixa de valer
    }

    const horasLivres = getHorasLivres({
        data: dia,
        duracaoMin: servico.duration_minutes,
        passoMin: servico.duration_minutes,
        ocupados,
    })

    const DIAS_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']

    function mensagemDeErro(msg) {
        if (msg.includes('slot_taken')) return 'Essa hora acabou de ser marcada por outra pessoa. Escolhe outra.'
        if (msg.includes('outside_business_hours')) return 'Essa hora já não está disponível.'
        if (msg.includes('slot_blocked')) return 'Essa hora está bloqueada.'
        if (msg.includes('in_the_past')) return 'Escolhe uma hora no futuro.'
        return 'Não foi possível confirmar a marcação. Tenta outra vez.'
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!podeConfirmar) return

        setAEnviar(true)
        setErro('')

        const { data, error } = await supabase.rpc('create_booking', {
            p_service_slug: servicoId,
            p_starts_at: hora.toISOString(),
            p_name: nome.trim(),
            p_phone: telemovel.trim(),
            p_brand: marca,
            p_model: modelo,
        })

        setAEnviar(false)

        if (error) {
            setErro(mensagemDeErro(error.message))
            return
        }

        setConfirmada(data)
    }

    function escolherMarca(e) {
        setMarca(e.target.value)
        setModelo('') // ao mudar de marca, o modelo antigo deixa de valer
    }

  return (
    <>
    {/* Titulo e seta para voltar */}
    <section className={styles.header}>
        <div className={styles.arrowContent}>
            <Link to="/">
                <img src={arrow} alt='seta' className={styles.arrow} />
            </Link>
        </div>

        <div className={styles.tituloContent}>
            <h1 className={styles.tituloBranco}>Samu</h1>
            <h1 className={styles.tituloVermelho}>Car Wash</h1>
        </div>
    </section>

    {/* Card tipo de lavagem */}
    <section className={styles.cardTipo}>
        <div className={styles.carroContent}>
            <img src={carro} alt='carro' className={styles.carro} />
        </div>

        <div className={styles.tipoContent}>
            <h2 className={styles.servico}>{servico.name}</h2>
            <p className={styles.descricaoServivo}>{servico.description}</p>
        </div>

        <div className={styles.precoContent}>
            <p className={styles.preco}>{servico.price}€</p>

            <div className={styles.tempoContent}>
                <div className={styles.relogioContent}>
                    <img src={relogio} alt='relogio' className={styles.relogio} />
                </div>
                <p className={styles.tempo}>{servico.duration_minutes / 60}h</p>
            </div>
        </div>
    </section>

    {/* Card mês */}
    <section>
        <div className={styles.calendarioContent}>
            <button onClick={() => mudarSemana(-1)} disabled={semanaAnteriorBloqueada} className={styles.setas}>
                ‹
            </button>
            <span className={styles.mes}>
                {dias[3].toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => mudarSemana(1)} className={styles.setas}>
                ›
            </button>
      </div>
    </section>

    {/* Card dia */}
    <section className={styles.diaContent}>
        <h3 className={styles.titulo}>Escolha a data</h3>
        <div className={styles.dias}>
            {dias.map((d) => {
            const fechado = HORARIO[d.getDay()].length === 0
            const passado = d < hoje
            return (
                <button
                    key={d.toISOString()}
                    disabled={fechado || passado}
                    onClick={() => escolherDia(d)}
                    className={`${styles.dia} ${mesmoDia(d, dia) ? styles.ativo : ''}`}
                >
                    <span className={styles.diaSemana}>{DIAS_SEMANA[d.getDay()]}</span>
                    <span className={styles.diaNumero}>{d.getDate()}</span>
                </button>
                )
            })}
        </div>

    {/* Card horas */}
        <h3 className={styles.titulo}>Escolha a hora</h3>
            {horasLivres.length === 0 ? (
                <p className={styles.semHoras}>Sem horas disponíveis neste dia.</p>
            ) : (
            <div className={styles.horas}>
                {horasLivres.map((h) => {
                    const escolhida = hora && hora.getTime() === h.getTime()
                    return (
                        <button
                            key={h.toISOString()}
                            onClick={() => setHora(h)}
                            className={`${styles.hora} ${escolhida ? styles.ativo : ''}`}
                        >
                            {h.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                        </button>
                    )
                })}
            </div>
            )}
    </section>

    {/* Card dados */}
    <section className={styles.dadosContent}>
        <h3 className={styles.titulo}>Dados da marcação</h3>

        <form onSubmit={handleSubmit} className={styles.form}>

                <input className={styles.label}
                    id="nome"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome"
                    required
                />

                <input className={styles.label}
                    id="telemovel"
                    type="tel"
                    value={telemovel}
                    onChange={(e) => setTelemovel(e.target.value)}
                    placeholder="Telémovel"
                    required
                />


                <select className={styles.dropBox} value={marca} onChange={escolherMarca} required>
                    <option value="">Marca</option>
                        {Object.keys(VEICULOS).sort().map((m) => (
                    <option key={m} value={m}>{m}</option>
                ))}
                </select>

                <select
                    className={styles.dropBox}
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    disabled={!marca}
                    required
                >
                    <option value="">Modelo</option>
                        {(VEICULOS[marca] ?? []).map((m) => (
                    <option key={m} value={m}>{m}</option>
                    ))}
                </select>

                {erro && <p className={styles.erro}>{erro}</p>}

                <button
                    type="submit"
                    disabled={!podeConfirmar || aEnviar}
                    className={styles.confirmar}
                >
                    {aEnviar ? 'A confirmar...' : 'Confirmar marcação'}
                </button>
        </form>
    </section>
    </>
  )
}
