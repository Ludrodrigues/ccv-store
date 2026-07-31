// app/components/TabelaEstoque.tsx
'use client'

import { useState } from 'react';
import { Produto } from '@prisma/client';
import {
  alterarQuantidade,
  criarProduto,
  atualizarProduto,
  deletarProduto,
} from '../actions/produtos';
import ModalProduto from './ModalProduto';
import ModalVenda from './ModalVenda';

interface TabelaEstoqueProps {
  produtos: Produto[];
}

export default function TabelaEstoque({ produtos }: TabelaEstoqueProps) {
  const [busca, setBusca] = useState('');
  const [categoriaSel, setCategoriaSel] = useState('TODAS');
  const [modalProdutoAberto, setModalProdutoAberto] = useState(false);
  const [modalVendaAberto, setModalVendaAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);

  // Extrai categorias únicas para o filtro
  const categorias = Array.from(new Set(produtos.map((p) => p.categoria))).sort();

  // Filtra produtos conforme busca e categoria selecionada
  const produtosFiltrados = produtos.filter((p) => {
    const atendeBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
    const atendeCategoria = categoriaSel === 'TODAS' || p.categoria === categoriaSel;
    return atendeBusca && atendeCategoria;
  });

  const handleSalvarProduto = async (dados: {
    nome: string;
    categoria: string;
    quantidadeAtual: number;
    precoVenda: number;
    estoqueMinimo: number;
  }) => {
    if (produtoEditando) {
      await atualizarProduto(produtoEditando.id, dados);
    } else {
      await criarProduto(dados);
    }
  };

  const handleExcluir = async (id: string, nome: string) => {
    if (confirm(`Tem certeza que deseja excluir "${nome}"?`)) {
      await deletarProduto(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de Ações: Busca, Filtro e Botões */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <input
          type="text"
          placeholder="Buscar produto por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-800 text-sm"
        />

        <div className="flex flex-wrap gap-2">
          <select
            value={categoriaSel}
            onChange={(e) => setCategoriaSel(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-800 bg-white text-sm"
          >
            <option value="TODAS">Todas as Categorias</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            onClick={() => setModalVendaAberto(true)}
            className="px-4 py-2 bg-zinc-900 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm whitespace-nowrap"
          >
            Registrar Venda
          </button>

          <button
            onClick={() => {
              setProdutoEditando(null);
              setModalProdutoAberto(true);
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm whitespace-nowrap"
          >
            + Novo Produto
          </button>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Produto</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4 text-right">Preço</th>
                <th className="py-3 px-4 text-center">Quantidade</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
  {produtosFiltrados.length === 0 ? (
    <tr>
      <td colSpan={5} className="py-8 text-center text-slate-400">
        Nenhum produto encontrado.
      </td>
    </tr>
  ) : (
    produtosFiltrados.map((item) => {
      const estoqueBaixo = item.quantidadeAtual <= item.estoqueMinimo;

      return (
        <tr
          key={item.id}
          /* 
            MICROINTERAÇÃO DA LINHA:
            - group: Permite controlar estilos de elementos filhos no hover da linha.
            - border-l-4: Destaque discreto na borda esquerda sem criar falsa affordance de clique na linha inteira.
          */
          className="group hover:bg-slate-50/90 transition-all duration-150 border-l-4 border-l-transparent hover:border-l-slate-900"
        >
          <td className="py-3.5 px-4 font-medium text-slate-800 group-hover:text-slate-950 transition-colors">
            {item.nome}
          </td>
          <td className="py-3.5 px-4">
            <span className="inline-block px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100 rounded-full group-hover:bg-slate-200/70 transition-colors">
              {item.categoria}
            </span>
          </td>
          <td className="py-3.5 px-4 text-right font-mono text-slate-700 font-medium">
            {item.precoVenda > 0
              ? `R$ ${item.precoVenda.toFixed(2)}`
              : 'R$ 0,00'}
          </td>
          <td className="py-3.5 px-4 text-center">
            <span
              className={`inline-block px-3 py-1 text-xs font-bold rounded-full transition-transform group-hover:scale-105 duration-150 ${
                estoqueBaixo
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {item.quantidadeAtual} un
            </span>
          </td>
          <td className="py-3.5 px-4">
            <div className="flex items-center justify-center gap-1.5">
              {/* Botão Subtrair */}
              <button
                onClick={() => alterarQuantidade(item.id, -1)}
                className="w-8 h-8 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 active:scale-90 transition-all duration-150 font-bold flex items-center justify-center text-base shadow-sm"
                title="Remover 1 unidade (Ajuste Rápido)"
              >
                -
              </button>

              {/* Botão Adicionar */}
              <button
                onClick={() => alterarQuantidade(item.id, 1)}
                className="w-8 h-8 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 active:scale-90 transition-all duration-150 font-bold flex items-center justify-center text-base shadow-sm"
                title="Adicionar 1 unidade (Ajuste Rápido)"
              >
                +
              </button>

              {/* Botão Editar */}
              <button
                onClick={() => {
                  setProdutoEditando(item);
                  setModalProdutoAberto(true);
                }}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-800 hover:text-white hover:border-slate-800 active:scale-95 transition-all duration-150 shadow-sm"
                title="Editar dados do produto"
              >
                Editar
              </button>

              {/* Botão Excluir */}
              <button
                onClick={() => handleExcluir(item.id, item.nome)}
                className="px-2 py-1 text-xs font-semibold rounded-lg text-rose-500 hover:bg-rose-100 hover:text-rose-700 active:scale-90 transition-all duration-150"
                title="Excluir produto"
              >
                ✕
              </button>
            </div>
          </td>
        </tr>
      );
    })
  )}
</tbody>
          </table>
        </div>
      </div>

      {/* Modal de Cadastro e Edição de Produto */}
      <ModalProduto
        isOpen={modalProdutoAberto}
        onClose={() => {
          setModalProdutoAberto(false);
          setProdutoEditando(null);
        }}
        onSave={handleSalvarProduto}
        produtoParaEditar={produtoEditando}
        categoriasExistentes={categorias}
      />

      {/* Modal de Registro de Venda */}
      <ModalVenda
        isOpen={modalVendaAberto}
        onClose={() => setModalVendaAberto(false)}
        produtos={produtos}
      />
    </div>
  );
}