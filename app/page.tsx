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
    <main className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <header className="flex justify-between items-center bg-slate-900 text-white p-6 rounded-2xl shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              CCVIDEIRA STORE - Candelária
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Gestão de Estoque
            </p>
          </div>
        </header>

        {/* Card: Valor Total do Estoque */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
            Valor Total em Estoque
          </span>
          <p className="text-3xl font-bold text-emerald-600 mt-1 font-mono">
            R$ {valorTotalEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Tabela de Produtos / Controle de Estoque */}
        <TabelaEstoque produtos={produtos} />

      </div>
    </main>
  );
}
