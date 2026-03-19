const PRIMEIRO_ENCONTRO = new Date(2023, 2, 19, 0, 0, 0);

const SEGUNDOS_REFERENCIA = 1095 * 24 * 60 * 60;
const BASE = {
  batidas: 126144000,
  respiracoes: 22500000,
  nascimentos: 405000000,
  partidas: 180000000,
  distanciaKm: 2800000000,
  sonhos: 5400,
  piscadas: 189216000,
  passos: 6570000
};

const TAXA = {
  batidas: BASE.batidas / SEGUNDOS_REFERENCIA,
  respiracoes: BASE.respiracoes / SEGUNDOS_REFERENCIA,
  nascimentos: BASE.nascimentos / SEGUNDOS_REFERENCIA,
  partidas: BASE.partidas / SEGUNDOS_REFERENCIA,
  distanciaKm: BASE.distanciaKm / SEGUNDOS_REFERENCIA,
  sonhos: BASE.sonhos / SEGUNDOS_REFERENCIA,
  piscadas: BASE.piscadas / SEGUNDOS_REFERENCIA,
  passos: BASE.passos / SEGUNDOS_REFERENCIA
};

const porId = (id) => document.getElementById(id);
const inteiro = (valor) => Math.max(0, Math.floor(valor));
const inteiroBr = (valor) => inteiro(valor).toLocaleString("pt-BR");
const milhoesBr = (valor) => (Math.max(0, valor) / 1000000).toLocaleString("pt-BR", { maximumFractionDigits: 1 });
const bilhoesBr = (valor) => (Math.max(0, valor) / 1000000000).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
const cacheTexto = new Map();

function setTexto(id, valor, animar = false) {
  const el = porId(id);
  if (!el) return;

  const texto = String(valor);
  if (cacheTexto.get(id) === texto) return;

  el.textContent = texto;
  cacheTexto.set(id, texto);

  if (animar && el.classList.contains("value")) {
    el.classList.remove("tick");
    void el.offsetWidth;
    el.classList.add("tick");
  }
}

function adicionarAnos(data, anos) {
  return new Date(data.getFullYear() + anos, data.getMonth(), data.getDate(), data.getHours(), data.getMinutes(), data.getSeconds());
}

function adicionarMeses(data, meses) {
  return new Date(data.getFullYear(), data.getMonth() + meses, data.getDate(), data.getHours(), data.getMinutes(), data.getSeconds());
}

function diferencaCalendario(inicio, fim) {
  const finalSeguro = new Date(Math.max(inicio.getTime(), fim.getTime()));

  let anos = finalSeguro.getFullYear() - inicio.getFullYear();
  if (adicionarAnos(inicio, anos) > finalSeguro) anos -= 1;

  let cursor = adicionarAnos(inicio, anos);
  let meses = (finalSeguro.getFullYear() - cursor.getFullYear()) * 12 + (finalSeguro.getMonth() - cursor.getMonth());
  if (adicionarMeses(cursor, meses) > finalSeguro) meses -= 1;

  cursor = adicionarMeses(cursor, meses);
  const dias = inteiro((finalSeguro - cursor) / 86400000);

  return { anos, meses, dias };
}

function diasParaAniversario(agora) {
  let aniversario = new Date(agora.getFullYear(), PRIMEIRO_ENCONTRO.getMonth(), PRIMEIRO_ENCONTRO.getDate(), 0, 0, 0);
  if (aniversario < agora) {
    aniversario = new Date(agora.getFullYear() + 1, PRIMEIRO_ENCONTRO.getMonth(), PRIMEIRO_ENCONTRO.getDate(), 0, 0, 0);
  }
  return Math.ceil((aniversario - agora) / 86400000);
}

function atualizarMensagem(diff, totalDias) {
  const parteAnos = `${diff.anos} ano${diff.anos === 1 ? "" : "s"}`;
  const parteMeses = `${diff.meses} mês${diff.meses === 1 ? "" : "es"}`;
  const parteDias = `${diff.dias} dia${diff.dias === 1 ? "" : "s"}`;
  setTexto("mensagem-principal", `Já são ${parteAnos}, ${parteMeses} e ${parteDias} de história. ${totalDias.toLocaleString("pt-BR")} dias de parceria em construção.`);
}

function atualizar() {
  const agora = new Date();
  const segundos = Math.max(0, (agora - PRIMEIRO_ENCONTRO) / 1000);
  const totalDias = inteiro(segundos / 86400);
  const totalHoras = inteiro(segundos / 3600);
  const totalMinutos = inteiro(segundos / 60);
  const diff = diferencaCalendario(PRIMEIRO_ENCONTRO, agora);

  setTexto("data-de-hoje", `Hoje: ${agora.toLocaleDateString("pt-BR")}`);
  atualizarMensagem(diff, totalDias);

  setTexto("anos", inteiroBr(diff.anos), true);
  setTexto("meses", inteiroBr(diff.meses), true);
  setTexto("dias", inteiroBr(diff.dias), true);
  setTexto("horas", inteiroBr(totalHoras), true);
  setTexto("minutos", inteiroBr(totalMinutos), true);
  setTexto("segundos", inteiroBr(segundos), true);

  setTexto("batidas", inteiroBr(segundos * TAXA.batidas), true);
  setTexto("respiracoes", inteiroBr(segundos * TAXA.respiracoes), true);
  setTexto("piscadas", inteiroBr(segundos * TAXA.piscadas), true);

  setTexto("nascimentos", milhoesBr(segundos * TAXA.nascimentos), true);
  setTexto("partidas", milhoesBr(segundos * TAXA.partidas), true);
  setTexto("amanheceres", inteiroBr(totalDias), true);

  setTexto("voltas-terra", (segundos / 31557600).toLocaleString("pt-BR", { maximumFractionDigits: 2 }), true);
  setTexto("distancia", bilhoesBr(segundos * TAXA.distanciaKm), true);
  setTexto("ciclos-lunares", (segundos / (29.530588 * 86400)).toLocaleString("pt-BR", { maximumFractionDigits: 1 }), true);

  setTexto("sonhos", inteiroBr(segundos * TAXA.sonhos), true);
  setTexto("passos", inteiroBr(segundos * TAXA.passos), true);
  setTexto("proximo-aniversario", inteiroBr(diasParaAniversario(agora)), true);
}

atualizar();
setInterval(atualizar, 1000);
