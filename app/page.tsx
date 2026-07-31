// app/page.tsx
import { prisma } from '../lib/prisma';
import TabelaEstoque from './components/TabelaEstoque';

// Desativa o cache estático para recalcular os valores a cada atualização de página
export const revalidate = 0;

export default async function Page() {
  // Busca os produtos direto do banco de dados
  const produtos = await prisma.produto.findMany({
    orderBy: { nome: 'asc' },
  });

  // Soma do valor total financeiro em estoque (Quantidade × Preço de Venda)
  const valorTotalEstoque = produtos.reduce(
    (acc, p) => acc + p.quantidadeAtual * p.precoVenda,
    0
  );

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* CABEÇALHO */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-zinc-900 border border-zinc-800 p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
          {/* Efeito Glow */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-56 h-56 bg-gradient-to-br from-teal-500/20 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

          {/* Lado Esquerdo: Logo + Títulos */}
          <div className="flex items-center gap-5 z-10">
            <div className="w-20 h-20 rounded-2xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
              <img
                src="/logo_ccv.png"
                alt="Logo da CCVIDEIRA"
                className="w-full h-full object-contain p-2"
              />
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                CCVIDEIRA STORE
              </h1>
              <p className="text-zinc-400 text-sm mt-1 font-medium">
                Gestão de Estoque
              </p>
            </div>
          </div>

          {/* Lado Direito: Tag de Localização */}
          <div className="z-10 flex items-center gap-2 bg-zinc-800/60 border border-zinc-700/60 px-4 py-2 rounded-full">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
            <span className="text-xs font-semibold text-zinc-300">Candelária</span>
          </div>
        </header>

        {/* GRID DE MÉTRICAS (CARD 1 ALONGADO E COR BRANCA) */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          
          {/* Card 1: Valor Total (Ocupa 2 colunas de 4 = 50% de largura) */}
          <div className="sm:col-span-2 relative bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-lg hover:border-zinc-700 transition-all duration-200 overflow-hidden text-center flex flex-col items-center justify-center">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-300" />
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Valor Em Estoque
            </span>
            <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-3 font-mono text-white">
              R$ {valorTotalEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Card 2: Unidades Físicas (Ocupa 1 coluna = 25% de largura) */}
          <div className="sm:col-span-1 relative bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-lg hover:border-zinc-700 transition-all duration-200 overflow-hidden text-center flex flex-col items-center justify-center">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-300" />
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Total de Unidades
            </span>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-3 font-mono text-zinc-100">
              {produtos.reduce((acc, p) => acc + p.quantidadeAtual, 0)}{' '}
              <span className="text-xs sm:text-sm font-normal text-zinc-500">peças</span>
            </p>
          </div>

          {/* Card 3: Variedade Cadastrada (Ocupa 1 coluna = 25% de largura) */}
          <div className="sm:col-span-1 relative bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-lg hover:border-zinc-700 transition-all duration-200 overflow-hidden text-center flex flex-col items-center justify-center">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-300" />
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Produtos Distintos
            </span>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-3 font-mono text-zinc-100">
              {produtos.length}{' '}
              <span className="text-xs sm:text-sm font-normal text-zinc-500">itens</span>
            </p>
          </div>

        </div>

        {/* Tabela de Produtos / Controle de Estoque */}
        <TabelaEstoque produtos={produtos} />

      </div>
    </main>
  );
}
