import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const produtos = [
  { nome: "Permanecendo no Curso", categoria: "ED.LAN", quantidadeAtual: 1, precoVenda: 20.0 },
  { nome: "Pessoas Certas, Lugar Certo", categoria: "ED.LAN", quantidadeAtual: 1, precoVenda: 20.0 },
  { nome: "Aliança de Sangue", categoria: "ED.LAN", quantidadeAtual: 1, precoVenda: 20.0 },
  { nome: "Uma Vida Abençoada", categoria: "ED.LAN", quantidadeAtual: 4, precoVenda: 47.9 },
  { nome: "Economia do Reino", categoria: "ED.LAN", quantidadeAtual: 9, precoVenda: 39.9 },
  { nome: "Venha e Veja (Pr. Saulo)", categoria: "ED.LAN", quantidadeAtual: 22, precoVenda: 59.9 },
  { nome: "Os Primeiros Passos", categoria: "CCVIDEIRA (autorais)", quantidadeAtual: 471, precoVenda: 9.9 },
  { nome: "Guerra Invisível", categoria: "CCVIDEIRA (autorais)", quantidadeAtual: 15, precoVenda: 49.9 },
  { nome: "Pelo Espírito", categoria: "CCVIDEIRA (autorais)", quantidadeAtual: 14, precoVenda: 45.0 },
  { nome: "Caderno de Estudo: Mentalidade de Vida Eterna", categoria: "CCVIDEIRA (autorais)", quantidadeAtual: 29, precoVenda: 15.0 },
  { nome: "Livro: Mentalidade de Vida Eterna", categoria: "CCVIDEIRA (autorais)", quantidadeAtual: 6, precoVenda: 45.0 },
  { nome: "Generosidade que Transforma", categoria: "CCVIDEIRA (autorais)", quantidadeAtual: 15, precoVenda: 39.9 },
  { nome: "De volta ao normal (CADERNO)", categoria: "CCVIDEIRA (autorais)", quantidadeAtual: 164, precoVenda: 9.9 },
  { nome: "De Volta ao Normal (LIVRO)", categoria: "CCVIDEIRA (autorais)", quantidadeAtual: 136, precoVenda: 20.0 },
  { nome: "Amar e Servir", categoria: "CCVIDEIRA (autorais)", quantidadeAtual: 20, precoVenda: 45.0 },
  { nome: "Devocional: Frutos do Espírito", categoria: "CCVIDEIRA (autorais)", quantidadeAtual: 86, precoVenda: 29.9 },
  { nome: "A Vontade de Deus para os Solteiros", categoria: "CCVIDEIRA (autorais)", quantidadeAtual: 36, precoVenda: 39.9 },
  { nome: "De Discípulo para Discípulo", categoria: "CCVIDEIRA (autorais)", quantidadeAtual: 72, precoVenda: 39.9 },
  { nome: "Não conselhos (Pr.Júlio)", categoria: "CCVIDEIRA (autorais)", quantidadeAtual: 18, precoVenda: 45.9 },
  { nome: "Moleskine Porta", categoria: "CADERNOS", quantidadeAtual: 45, precoVenda: 35.0 },
  { nome: "Moleskine Capa Branca", categoria: "CADERNOS", quantidadeAtual: 25, precoVenda: 35.0 },
  { nome: "Caderno Floral Pequeno", categoria: "CADERNOS", quantidadeAtual: 3, precoVenda: 49.9 },
  { nome: "Moleskine Mother", categoria: "CADERNOS", quantidadeAtual: 23, precoVenda: 35.0 },
  { nome: "Caderno Floral Grande", categoria: "CADERNOS", quantidadeAtual: 1, precoVenda: 69.9 },
  { nome: "Planner 'O ANO DA PRESENÇA'", categoria: "CADERNOS", quantidadeAtual: 8, precoVenda: 99.9 },
  { nome: "Imutável Azul Claro", categoria: "CADERNOS", quantidadeAtual: 17, precoVenda: 20.0 },
  { nome: "Imutável Preto", categoria: "CADERNOS", quantidadeAtual: 13, precoVenda: 29.0 },
  { nome: "Caderno capa mole", categoria: "CADERNOS", quantidadeAtual: 1, precoVenda: 25.0 },
  { nome: "Imutável Azul Bic", categoria: "CADERNOS", quantidadeAtual: 1, precoVenda: 20.0 },
  { nome: "Devocional de casal", categoria: "CADERNOS", quantidadeAtual: 6, precoVenda: 29.9 },
  { nome: "Jogos Kids", categoria: "KIDS", quantidadeAtual: 52, precoVenda: 14.9 },
  { nome: "Baldes de Pipoca", categoria: "KIDS", quantidadeAtual: 6, precoVenda: 15.0 },
  { nome: "Histórias Bíblicas", categoria: "KIDS", quantidadeAtual: 9, precoVenda: 9.9 },
  { nome: "Enquanto Ana Espera", categoria: "KIDS", quantidadeAtual: 1, precoVenda: 49.9 },
  { nome: "Lápis de cor (cx)", categoria: "KIDS", quantidadeAtual: 5, precoVenda: 20.0 },
  { nome: "Canecas 'Viver, amar & servir'", categoria: "PAPELARIA / VARIEDADES", quantidadeAtual: 13, precoVenda: 64.9 },
  { nome: "Home Spray Rara", categoria: "PAPELARIA / VARIEDADES", quantidadeAtual: 11, precoVenda: 20.0 },
  { nome: "Vela Imutável", categoria: "PAPELARIA / VARIEDADES", quantidadeAtual: 1, precoVenda: 20.0 },
  { nome: "Marcador de Texto Gel", categoria: "PAPELARIA / VARIEDADES", quantidadeAtual: 22, precoVenda: 5.0 },
  { nome: "Caneta Delta colorida", categoria: "PAPELARIA / VARIEDADES", quantidadeAtual: 19, precoVenda: 3.5 },
  { nome: "Borrachas chocolate", categoria: "PAPELARIA / VARIEDADES", quantidadeAtual: 2, precoVenda: 20.0 },
  { nome: "Caneta Tons Pásteis picnic", categoria: "PAPELARIA / VARIEDADES", quantidadeAtual: 19, precoVenda: 2.5 },
  { nome: "Lápis tons pastéis", categoria: "PAPELARIA / VARIEDADES", quantidadeAtual: 42, precoVenda: 2.5 },
  { nome: "Polly Luxi", categoria: "PAPELARIA / VARIEDADES", quantidadeAtual: 16, precoVenda: 10.0 },
  { nome: "Sacolas de presente CCV", categoria: "PAPELARIA / VARIEDADES", quantidadeAtual: 240, precoVenda: 7.0 },
  { nome: "Caneta colorida Gamer", categoria: "PAPELARIA / VARIEDADES", quantidadeAtual: 14, precoVenda: 2.5 },
  { nome: "Marcador Bic", categoria: "PAPELARIA / VARIEDADES", quantidadeAtual: 20, precoVenda: 5.0 },
  { nome: "Marcador Mini", categoria: "PAPELARIA / VARIEDADES", quantidadeAtual: 13, precoVenda: 2.0 },
  { nome: "Voluntários", categoria: "CAMISAS", quantidadeAtual: 5, precoVenda: 45.0 },
  { nome: "Voluntários VK", categoria: "CAMISAS", quantidadeAtual: 20, precoVenda: 45.0 },
  { nome: "Elas por elas Shine", categoria: "CAMISAS", quantidadeAtual: 13, precoVenda: 45.0 },
  { nome: "Elas por elas Le fruit", categoria: "CAMISAS", quantidadeAtual: 9, precoVenda: 45.0 },
  { nome: "Batismo", categoria: "CAMISAS", quantidadeAtual: 63, precoVenda: 45.0 },
  { nome: "Conferência (Promo)", categoria: "CAMISAS", quantidadeAtual: 7, precoVenda: 29.9 },
  { nome: "Camisa Infantil", categoria: "CAMISAS", quantidadeAtual: 6, precoVenda: 25.0 },
  { nome: "Ecobag", categoria: "CAMISAS", quantidadeAtual: 7, precoVenda: 15.0 },
  { nome: "Dia dos Pais", categoria: "CAMISAS", quantidadeAtual: 3, precoVenda: 20.0 },
  { nome: "Conferência", categoria: "CAMISAS", quantidadeAtual: 6, precoVenda: 69.9 },
  { nome: "Delivery", categoria: "CAMISAS", quantidadeAtual: 4, precoVenda: 20.0 },
  { nome: "Infantil Pri", categoria: "CAMISAS", quantidadeAtual: 6, precoVenda: 69.9 },
]

async function main() {
  console.log('Iniciando povoamento/atualização do banco de dados...')

  for (const prod of produtos) {
    const existente = await prisma.produto.findFirst({
      where: { nome: prod.nome },
    })

    if (existente) {
      await prisma.produto.update({
        where: { id: existente.id },
        data: {
          precoVenda: prod.precoVenda,
          quantidadeAtual: prod.quantidadeAtual,
          categoria: prod.categoria,
        },
      })
    } else {
      await prisma.produto.create({
        data: {
          nome: prod.nome,
          categoria: prod.categoria,
          quantidadeAtual: prod.quantidadeAtual,
          precoVenda: prod.precoVenda,
          estoqueMinimo: 5,
        },
      })
    }
  }

  console.log('✅ Todos os 60 produtos foram salvos e atualizados no banco de dados!')
}

main()
  .catch((e) => {
    console.error('Erro ao popular produtos:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })