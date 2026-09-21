// Devolve o mesmo dia, às 00:00
export function inicioDoDia(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

// Soma (ou subtrai, com número negativo) dias a uma data
export function somarDias(d, n) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

// Devolve a segunda-feira da semana da data recebida
export function segundaDaSemana(d) {
  const x = inicioDoDia(d)
  const dia = x.getDay() // 0 = domingo ... 6 = sábado
  return somarDias(x, dia === 0 ? -6 : 1 - dia)
}

// Diz se duas datas são o mesmo dia
export function mesmoDia(a, b) {
  return a.toDateString() === b.toDateString()
}