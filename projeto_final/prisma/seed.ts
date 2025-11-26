import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed do banco de dados...')

  // Limpar dados existentes
  await prisma.pedidoItem.deleteMany()
  await prisma.pedido.deleteMany()
  await prisma.produto.deleteMany()
  await prisma.categoria.deleteMany()
  await prisma.banner.deleteMany()

  // Criar Banners
  console.log('Criando banners...')
  await prisma.banner.createMany({
    data: [
      {
        titulo: 'Promocao de Inauguracao - 20% OFF em todas as pizzas',
        imagem: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=400&fit=crop',
        ativo: true,
        ordem: 1,
      },
      {
        titulo: 'Combo Familia - Pizza Grande + Refrigerante 2L',
        imagem: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1200&h=400&fit=crop',
        ativo: true,
        ordem: 2,
      },
    ],
  })

  // Criar Categorias
  console.log('Criando categorias...')
  const pizzasTradicionais = await prisma.categoria.create({
    data: {
      nome: 'Pizzas Tradicionais',
      slug: 'pizzas-tradicionais',
      cor: '#e63946',
      imagem: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&h=400&fit=crop',
    },
  })

  const pizzasEspeciais = await prisma.categoria.create({
    data: {
      nome: 'Pizzas Especiais',
      slug: 'pizzas-especiais',
      cor: '#9d4edd',
      imagem: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
    },
  })

  const pizzasDoces = await prisma.categoria.create({
    data: {
      nome: 'Pizzas Doces',
      slug: 'pizzas-doces',
      cor: '#f72585',
      imagem: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=400&h=400&fit=crop',
    },
  })

  const brotos = await prisma.categoria.create({
    data: {
      nome: 'Brotos',
      slug: 'brotos',
      cor: '#ff9f1c',
      imagem: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    },
  })

  const bebidas = await prisma.categoria.create({
    data: {
      nome: 'Bebidas',
      slug: 'bebidas',
      cor: '#00b4d8',
      imagem: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400&h=400&fit=crop',
    },
  })

  const sobremesas = await prisma.categoria.create({
    data: {
      nome: 'Sobremesas',
      slug: 'sobremesas',
      cor: '#fb8500',
      imagem: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop',
    },
  })

  // Criar Produtos - Pizzas Tradicionais
  console.log('Criando pizzas tradicionais...')
  await prisma.produto.createMany({
    data: [
      {
        nome: 'Pizza Margherita',
        descricao: 'Molho de tomate, mussarela, tomate fresco, manjericão e azeite de oliva',
        preco: 45.90,
        imagem: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=500&fit=crop',
        categoriaId: pizzasTradicionais.id,
      },
      {
        nome: 'Pizza Calabresa',
        descricao: 'Molho de tomate, mussarela, calabresa fatiada e cebola',
        preco: 42.90,
        imagem: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop',
        categoriaId: pizzasTradicionais.id,
      },
      {
        nome: 'Pizza Portuguesa',
        descricao: 'Molho de tomate, mussarela, presunto, ovos, cebola, azeitona e ervilha',
        preco: 48.90,
        imagem: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&h=500&fit=crop',
        categoriaId: pizzasTradicionais.id,
      },
      {
        nome: 'Pizza Quatro Queijos',
        descricao: 'Molho de tomate, mussarela, provolone, parmesão e gorgonzola',
        preco: 52.90,
        imagem: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=500&fit=crop',
        categoriaId: pizzasTradicionais.id,
      },
      {
        nome: 'Pizza Frango com Catupiry',
        descricao: 'Molho de tomate, mussarela, frango desfiado e catupiry',
        preco: 46.90,
        imagem: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&h=500&fit=crop',
        categoriaId: pizzasTradicionais.id,
      },
      {
        nome: 'Pizza Mussarela',
        descricao: 'Molho de tomate, mussarela, tomate e orégano',
        preco: 38.90,
        imagem: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&h=500&fit=crop',
        categoriaId: pizzasTradicionais.id,
      },
    ],
  })

  // Criar Produtos - Pizzas Especiais
  console.log('Criando pizzas especiais...')
  await prisma.produto.createMany({
    data: [
      {
        nome: 'Pizza de Carne Seca',
        descricao: 'Molho de tomate, mussarela, carne seca desfiada, cebola caramelizada e catupiry',
        preco: 58.90,
        imagem: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=500&h=500&fit=crop',
        categoriaId: pizzasEspeciais.id,
      },
      {
        nome: 'Pizza Pepperoni',
        descricao: 'Molho de tomate, mussarela e pepperoni importado',
        preco: 54.90,
        imagem: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=500&fit=crop',
        categoriaId: pizzasEspeciais.id,
      },
      {
        nome: 'Pizza Bacon Supreme',
        descricao: 'Molho de tomate, mussarela, bacon crocante, cheddar e cebola roxa',
        preco: 56.90,
        imagem: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&h=500&fit=crop',
        categoriaId: pizzasEspeciais.id,
      },
      {
        nome: 'Pizza Vegetariana',
        descricao: 'Molho de tomate, mussarela, brócolis, palmito, milho, ervilha e champignon',
        preco: 49.90,
        imagem: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=500&h=500&fit=crop',
        categoriaId: pizzasEspeciais.id,
      },
      {
        nome: 'Pizza Camarão',
        descricao: 'Molho de tomate, mussarela, camarões, alho frito e catupiry',
        preco: 68.90,
        imagem: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop',
        categoriaId: pizzasEspeciais.id,
      },
    ],
  })

  // Criar Produtos - Pizzas Doces
  console.log('Criando pizzas doces...')
  await prisma.produto.createMany({
    data: [
      {
        nome: 'Pizza de Chocolate',
        descricao: 'Chocolate ao leite derretido com granulado',
        preco: 42.90,
        imagem: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=500&h=500&fit=crop',
        categoriaId: pizzasDoces.id,
      },
      {
        nome: 'Pizza de Banana com Canela',
        descricao: 'Banana, açúcar, canela e leite condensado',
        preco: 38.90,
        imagem: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=500&h=500&fit=crop',
        categoriaId: pizzasDoces.id,
      },
      {
        nome: 'Pizza Romeu e Julieta',
        descricao: 'Goiabada cremosa com queijo mussarela',
        preco: 40.90,
        imagem: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=500&fit=crop',
        categoriaId: pizzasDoces.id,
      },
      {
        nome: 'Pizza de Morango com Nutella',
        descricao: 'Nutella, morangos frescos e leite condensado',
        preco: 48.90,
        imagem: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop',
        categoriaId: pizzasDoces.id,
      },
      {
        nome: 'Pizza de Prestígio',
        descricao: 'Chocolate ao leite com coco ralado',
        preco: 44.90,
        imagem: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=500&fit=crop',
        categoriaId: pizzasDoces.id,
      },
    ],
  })

  // Criar Produtos - Brotos
  console.log('Criando brotos...')
  await prisma.produto.createMany({
    data: [
      {
        nome: 'Broto de Calabresa',
        descricao: 'Mini pizza com calabresa e cebola',
        preco: 24.90,
        imagem: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=500&fit=crop',
        categoriaId: brotos.id,
      },
      {
        nome: 'Broto de Frango',
        descricao: 'Mini pizza com frango desfiado e catupiry',
        preco: 26.90,
        imagem: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&h=500&fit=crop',
        categoriaId: brotos.id,
      },
      {
        nome: 'Broto de Mussarela',
        descricao: 'Mini pizza com mussarela e orégano',
        preco: 22.90,
        imagem: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&h=500&fit=crop',
        categoriaId: brotos.id,
      },
      {
        nome: 'Broto de Chocolate',
        descricao: 'Mini pizza doce com chocolate ao leite',
        preco: 24.90,
        imagem: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=500&h=500&fit=crop',
        categoriaId: brotos.id,
      },
    ],
  })

  // Criar Produtos - Bebidas
  console.log('Criando bebidas...')
  await prisma.produto.createMany({
    data: [
      {
        nome: 'Coca-Cola 2L',
        descricao: 'Refrigerante Coca-Cola 2 litros',
        preco: 12.90,
        imagem: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=500&h=500&fit=crop',
        categoriaId: bebidas.id,
      },
      {
        nome: 'Guaraná Antarctica 2L',
        descricao: 'Refrigerante Guaraná Antarctica 2 litros',
        preco: 10.90,
        imagem: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=500&h=500&fit=crop',
        categoriaId: bebidas.id,
      },
      {
        nome: 'Suco de Laranja 1L',
        descricao: 'Suco natural de laranja',
        preco: 14.90,
        imagem: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&h=500&fit=crop',
        categoriaId: bebidas.id,
      },
      {
        nome: 'Água Mineral 500ml',
        descricao: 'Água mineral sem gás',
        preco: 4.90,
        imagem: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500&h=500&fit=crop',
        categoriaId: bebidas.id,
      },
      {
        nome: 'Cerveja Heineken 600ml',
        descricao: 'Cerveja Heineken Long Neck',
        preco: 15.90,
        imagem: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&h=500&fit=crop',
        categoriaId: bebidas.id,
      },
    ],
  })

  // Criar Produtos - Sobremesas
  console.log('Criando sobremesas...')
  await prisma.produto.createMany({
    data: [
      {
        nome: 'Petit Gateau',
        descricao: 'Bolinho de chocolate com recheio cremoso, acompanha sorvete',
        preco: 22.90,
        imagem: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=500&fit=crop',
        categoriaId: sobremesas.id,
      },
      {
        nome: 'Brownie com Sorvete',
        descricao: 'Brownie de chocolate com sorvete de creme e calda',
        preco: 19.90,
        imagem: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=500&h=500&fit=crop',
        categoriaId: sobremesas.id,
      },
      {
        nome: 'Açaí 500ml',
        descricao: 'Açaí cremoso com granola, banana e leite condensado',
        preco: 24.90,
        imagem: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500&h=500&fit=crop',
        categoriaId: sobremesas.id,
      },
    ],
  })

  console.log('Seed concluido com sucesso!')
  console.log('Resumo:')
  console.log(`   - ${await prisma.banner.count()} banners`)
  console.log(`   - ${await prisma.categoria.count()} categorias`)
  console.log(`   - ${await prisma.produto.count()} produtos`)
}

main()
  .catch((e) => {
    console.error('Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

