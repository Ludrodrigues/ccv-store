-- CreateTable
CREATE TABLE "Produto" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "quantidadeAtual" INTEGER NOT NULL DEFAULT 0,
    "precoVenda" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "estoqueMinimo" INTEGER NOT NULL DEFAULT 5,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);
