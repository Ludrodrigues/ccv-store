// app/actions/produtos.ts
'use server'

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

// Altera a quantidade (+1 ou -1)
export async function alterarQuantidade(id: string, delta: number) {
  const produto = await prisma.produto.findUnique({ where: { id } });
  if (!produto) return;

  const novaQtd = Math.max(0, produto.quantidadeAtual + delta);

  await prisma.produto.update({
    where: { id },
    data: { quantidadeAtual: novaQtd },
  });

  revalidatePath('/');
}

// Cria um novo produto
export async function criarProduto(data: {
  nome: string;
  categoria: string;
  quantidadeAtual: number;
  precoVenda: number;
  estoqueMinimo: number;
}) {
  await prisma.produto.create({ data });
  revalidatePath('/');
}

// Atualiza um produto existente
export async function atualizarProduto(
  id: string,
  data: {
    nome: string;
    categoria: string;
    quantidadeAtual: number;
    precoVenda: number;
    estoqueMinimo: number;
  }
) {
  await prisma.produto.update({
    where: { id },
    data,
  });

  revalidatePath('/');
}

// Deleta um produto
export async function deletarProduto(id: string) {
  await prisma.produto.delete({ where: { id } });
  revalidatePath('/');
}