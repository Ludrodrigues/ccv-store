// app/actions/vendas.ts
'use server'

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export interface ItemCarrinho {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
}

export async function registrarVenda(formaPagamento: string, itens: ItemCarrinho[]) {
  if (!itens || itens.length === 0) {
    throw new Error('A venda precisa conter ao menos um item.');
  }

  const valorTotal = itens.reduce(
    (acc, item) => acc + item.quantidade * item.precoUnitario,
    0
  );

  // Transação atômica
  await prisma.$transaction(async (tx) => {
    for (const item of itens) {
      const produto = await tx.produto.findUnique({
        where: { id: item.produtoId },
      });

      if (!produto) {
        throw new Error(`Produto não encontrado.`);
      }

      if (produto.quantidadeAtual < item.quantidade) {
        throw new Error(
          `Estoque insuficiente para "${produto.nome}". Quantidade disponível: ${produto.quantidadeAtual}`
        );
      }

      // 1. Subtrai do estoque
      await tx.produto.update({
        where: { id: item.produtoId },
        data: {
          quantidadeAtual: produto.quantidadeAtual - item.quantidade,
        },
      });
    }

    // 2. Registra a venda
    await tx.venda.create({
      data: {
        formaPagamento,
        valorTotal,
        itens: {
          create: itens.map((item) => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
          })),
        },
      },
    });
  });

  revalidatePath('/');
}