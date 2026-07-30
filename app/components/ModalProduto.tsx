'use client'

import { useState, useEffect } from 'react';
import { Produto } from '@prisma/client';
import { registrarVenda } from '../actions/vendas';

interface ModalProdutoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dados: {
    nome: string;
    categoria: string;
    quantidadeAtual: number;
    precoVenda: number;
    estoqueMinimo: number;
  }) => Promise<void>;
  produtoParaEditar?: Produto | null;
  categoriasExistentes: string[];
}

export default function ModalProduto({
  isOpen,
  onClose,
  onSave,
  produtoParaEditar,
  categoriasExistentes,
}: ModalProdutoProps) {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('');
  
  // Usamos string para permitir apagar completamente com Backspace sem forçar o 0
  const [quantidadeAtual, setQuantidadeAtual] = useState<string>('0');
  const [precoVenda, setPrecoVenda] = useState<string>('0');
  const [estoqueMinimo, setEstoqueMinimo] = useState<string>('5');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (produtoParaEditar) {
      setNome(produtoParaEditar.nome);
      setCategoria(produtoParaEditar.categoria);
      setNovaCategoria('');
      setQuantidadeAtual(String(produtoParaEditar.quantidadeAtual));
      setPrecoVenda(String(produtoParaEditar.precoVenda));
      setEstoqueMinimo(String(produtoParaEditar.estoqueMinimo));
    } else {
      setNome('');
      setCategoria(categoriasExistentes[0] || 'Geral');
      setNovaCategoria('');
      setQuantidadeAtual('0');
      setPrecoVenda('0');
      setEstoqueMinimo('5');
    }
  }, [produtoParaEditar, isOpen, categoriasExistentes]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const categoriaFinal = categoria === 'NOVA' ? novaCategoria.trim() : categoria;

    try {
      await onSave({
        nome: nome.trim(),
        categoria: categoriaFinal || 'Geral',
        quantidadeAtual: quantidadeAtual === '' ? 0 : Number(quantidadeAtual),
        precoVenda: precoVenda === '' ? 0 : Number(precoVenda),
        estoqueMinimo: estoqueMinimo === '' ? 0 : Number(estoqueMinimo),
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar produto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {produtoParaEditar ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
              Nome do Produto
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-800"
              placeholder="Ex: Camiseta Voluntários"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Categoria
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-800 bg-white"
              >
                {categoriasExistentes.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="NOVA">+ Criar Nova Categoria</option>
              </select>
            </div>

            {categoria === 'NOVA' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  required
                  value={novaCategoria}
                  onChange={(e) => setNovaCategoria(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-800"
                  placeholder="Ex: Papelaria"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Qtd. Atual
              </label>
              <input
                type="number"
                min="0"
                value={quantidadeAtual}
                onChange={(e) => setQuantidadeAtual(e.target.value)}
                onFocus={(e) => e.target.select()}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Preço Venda (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={precoVenda}
                onChange={(e) => setPrecoVenda(e.target.value)}
                onFocus={(e) => e.target.select()}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Estoque Mín.
              </label>
              <input
                type="number"
                min="0"
                value={estoqueMinimo}
                onChange={(e) => setEstoqueMinimo(e.target.value)}
                onFocus={(e) => e.target.select()}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}