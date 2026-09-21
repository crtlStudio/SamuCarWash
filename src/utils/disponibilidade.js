import { HORARIO } from '../data/horario'

export function getHorasLivres({
  data,          // Date do dia escolhido
  duracaoMin,    // duração do serviço escolhido (60 ou 120)
  ocupados = [], // [{ inicio: Date, fim: Date }]
  passoMin = 60, // de quanto em quanto tempo podem começar as marcações
  agora = new Date(),
}) {
  // períodos de abertura desse dia da semana (vazio = fechado)
  const periodos = HORARIO[data.getDay()] ?? []
  const livres = []

  for (const p of periodos) {
    const abre = new Date(data)
    abre.setHours(p.abre, 0, 0, 0)
    const fecha = new Date(data)
    fecha.setHours(p.fecha, 0, 0, 0)

    for (
      let inicio = new Date(abre);
      inicio < fecha;
      inicio = new Date(inicio.getTime() + passoMin * 60000)
    ) {
      const fim = new Date(inicio.getTime() + duracaoMin * 60000)

      if (fim > fecha) break          // não cabe antes de fechar este período
      if (inicio < agora) continue    // já passou

      const choca = ocupados.some((o) => inicio < o.fim && fim > o.inicio)
      if (!choca) livres.push(inicio)
    }
  }

  return livres
}