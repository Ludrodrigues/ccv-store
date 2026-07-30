'use client'

import { useState } from 'react';
import { Produto } from '@prisma/client';
import { registrarVenda } from '../actions/vendas';

interface ModalVendaProps {
  isOpen: boolean;
  onClose: () => void;
  produtos: Produto[];
}

interface ItemCarrinhoLocal {
  produto: Produto;
  quantidade: number;
}

export default function ModalVenda({ isOpen, onClose, produtos }: ModalVendaProps) {
  const [carrinho, setCarrinho] = useState<ItemCarrinhoLocal[]>([]);
  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState('');
  const [quantidadeInput, setQuantidadeInput] = useState('1');
  const [formaPagamento, setFormaPagamento] = useState('PIX');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const adicionarAoCarrinho = () => {
    const prod = produtos.find((p) => p.id === produtoSelecionadoId);
    if (!prod) return;

    const qtd = Number(quantidadeInput);
    if (qtd <= 0) return;

    if (qtd > prod.quantidadeAtual) {
      alert(`Quantidade em estoque insuficiente (${prod.quantidadeAtual} disponíveis).`);
      return;
    }

    const itemExistente = carrinho.find((item) => item.produto.id === prod.id);
    if (itemExistente) {
      const novaQtd = itemExistente.quantidade + qtd;
      if (novaQtd > prod.quantidadeAtual) {
        alert(`Estoque máximo excedido (${prod.quantidadeAtual} disponíveis).`);
        return;
      }
      setCarrinho(
        carrinho.map((item) =>
          item.produto.id === prod.id ? { ...item, quantidade: novaQtd } : item
        )
      );
    } else {
      setCarrinho([...carrinho, { produto: prod, quantidade: qtd }]);
    }

    setProdutoSelecionadoId('');
    setQuantidadeInput('1');
  };

  const removerDoCarrinho = (id: string) => {
    setCarrinho(carrinho.filter((item) => item.produto.id !== id));
  };

  const totalVenda = carrinho.reduce(
    (acc, item) => acc + item.produto.precoVenda * item.quantidade,
    0
  );

  const handleFinalizarVenda = async () => {
    if (carrinho.length === 0) return;

    setLoading(true);
    try {
      const payloadItens = carrinho.map((item) => ({
        produtoId: item.produto.id,
        quantidade: item.quantidade,
        precoUnitario: item.produto.precoVenda,
      }));

      await registrarVenda(formaPagamento, payloadItens);
      setCarrinho([]);
      onClose();
      alert('Venda registrada e estoque atualizado com sucesso!');
    } catch (err: any) {
      alert(err.message || 'Erro ao registrar venda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Registrar Nova Venda</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Seleção de Produtos e Adição */}
<div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
  <div>
    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
      Selecionar Produto
    </label>
    <select
      value={produtoSelecionadoId}
      onChange={(e) => setProdutoSelecionadoId(e.target.value)}
      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 bg-white text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
    >
      <option value="">-- Escolha um produto --</option>
      {produtos.map((p) => (
        <option key={p.id} value={p.id} disabled={p.quantidadeAtual <= 0}>
          {p.nome} ({p.quantidadeAtual} em estoque) - R$ {p.precoVenda.toFixed(2)}
        </option>
      ))}
    </select>
  </div>

  <div className="flex gap-2 items-center">
    <div className="w-28">
      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
        Qtd.
      </label>
      <input
        type="number"
        min="1"
        value={quantidadeInput}
        onChange={(e) => setQuantidadeInput(e.target.value)}
        onFocus={(e) => e.target.select()}
        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 text-center text-sm font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none bg-white"
      />
    </div>

    <div className="flex-1 self-end">
      <button
        type="button"
        onClick={adicionarAoCarrinho}
        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
      >
        + Adicionar ao Carrinho
      </button>
    </div>
  </div>
</div>

          {/* Carrinho de Itens */}
          <div className="border border-slate-200 rounded-xl p-3 max-h-40 overflow-y-auto space-y-2 bg-slate-50">
            {carrinho.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                Nenhum item adicionado à venda.
              </p>
            ) : (
              carrinho.map((item) => (
                <div
                  key={item.produto.id}
                  className="flex justify-between items-center text-sm border-b border-slate-200 pb-2 last:border-0 last:pb-0"
                >
                  <span className="text-slate-800 font-medium">
                    {item.quantidade}x {item.produto.nome}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600 font-semibold font-mono">
                      R$ {(item.produto.precoVenda * item.quantidade).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removerDoCarrinho(item.produto.id)}
                      className="text-rose-500 font-bold hover:text-rose-700 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Forma de Pagamento */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
              Forma de Pagamento
            </label>
            <select
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl text-slate-800 bg-white text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
            >
              <option value="PIX">PIX</option>
              <option value="ESPÉCIE">Espécie</option>
              <option value="CARTAO_DEBITO">Cartão de Débito</option>
              <option value="CARTAO_CREDITO">Cartão de Crédito</option>
            </select>
          </div>

          {/* Total e Ações */}
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <div>
              <span className="text-xs text-slate-500 uppercase block font-semibold">Total</span>
              <span className="text-2xl font-bold text-slate-900 font-mono">
                R$ {totalVenda.toFixed(2)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleFinalizarVenda}
              disabled={loading || carrinho.length === 0}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Processando...' : 'Finalizar Venda'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}