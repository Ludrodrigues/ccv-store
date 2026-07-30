// app/page.tsx
import { prisma } from '../lib/prisma';
import TabelaEstoque from './components/TabelaEstoque';

export const revalidate = 0;

export default async function Home() {
  const produtos = await prisma.produto.findMany({
    orderBy: { nome: 'asc' },
  });

  // Calcula a soma total de unidades físicas de todos os produtos
  const totalUnidades = produtos.reduce((acc, item) => acc + item.quantidadeAtual, 0);

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-md">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">CCV Store</h1>
            <p className="text-slate-400 text-sm">Controle de Estoque</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="bg-slate-800 px-4 py-2 rounded-xl text-xs text-slate-300 font-mono border border-slate-700">
              Tipos cadastrados: <span className="text-blue-400 font-bold">{produtos.length}</span>
            </div>
            <div className="bg-slate-800 px-4 py-2 rounded-xl text-xs text-slate-300 font-mono border border-slate-700">
              Unidades em estoque: <span className="text-emerald-400 font-bold">{totalUnidades}</span>
            </div>
          </div>
        </header>

        {/* Tabela de Produtos */}
        <TabelaEstoque produtos={produtos} />
      </div>
    </main>
  );
}
