import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Populando banco...')

  await prisma.pedidoItem.deleteMany()
  await prisma.pedido.deleteMany()
  await prisma.produto.deleteMany()
  await prisma.categoria.deleteMany()
  await prisma.banner.deleteMany()

  // Banners
  await prisma.banner.createMany({
    data: [
      {
        titulo: 'Promocao de inauguracao - 20% em todas as pizzas',
        imagem: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=400&fit=crop',
        ativo: true,
        ordem: 1,
      },
      {
        titulo: 'Combo familia - pizza grande + refri 2L por R$59,90',
        imagem: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1200&h=400&fit=crop',
        ativo: true,
        ordem: 2,
      },
    ],
  })

  // Categorias
  const pizzasTrad = await prisma.categoria.create({
    data: {
      nome: 'Pizzas Tradicionais',
      slug: 'pizzas-tradicionais',
      cor: '#dc2626',
      imagem: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&h=400&fit=crop',
    },
  })

  const pizzasEsp = await prisma.categoria.create({
    data: {
      nome: 'Pizzas Especiais',
      slug: 'pizzas-especiais',
      cor: '#7c3aed',
      imagem: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
    },
  })

  const pizzasDoces = await prisma.categoria.create({
    data: {
      nome: 'Pizzas Doces',
      slug: 'pizzas-doces',
      cor: '#db2777',
      imagem: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=400&h=400&fit=crop',
    },
  })

  const brotos = await prisma.categoria.create({
    data: {
      nome: 'Brotos',
      slug: 'brotos',
      cor: '#ea580c',
      imagem: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    },
  })

  const bebidas = await prisma.categoria.create({
    data: {
      nome: 'Bebidas',
      slug: 'bebidas',
      cor: '#0891b2',
      imagem: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400&h=400&fit=crop',
    },
  })

  const sobremesas = await prisma.categoria.create({
    data: {
      nome: 'Sobremesas',
      slug: 'sobremesas',
      cor: '#ca8a04',
      imagem: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop',
    },
  })

  // Pizzas tradicionais
  await prisma.produto.createMany({
    data: [
      {
        nome: 'Margherita',
        descricao: 'Molho de tomate, mussarela, tomate fresco e manjericao',
        preco: 45.90,
        imagem: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=500&fit=crop',
        categoriaId: pizzasTrad.id,
      },
      {
        nome: 'Calabresa',
        descricao: 'Mussarela, calabresa fatiada e cebola',
        preco: 42.90,
        imagem: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop',
        categoriaId: pizzasTrad.id,
      },
      {
        nome: 'Portuguesa',
        descricao: 'Mussarela, presunto, ovo, cebola, azeitona e ervilha',
        preco: 48.90,
        imagem: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&h=500&fit=crop',
        categoriaId: pizzasTrad.id,
      },
      {
        nome: 'Quatro Queijos',
        descricao: 'Mussarela, provolone, parmesao e gorgonzola',
        preco: 52.90,
        imagem: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=500&fit=crop',
        categoriaId: pizzasTrad.id,
      },
      {
        nome: 'Frango Catupiry',
        descricao: 'Mussarela, frango desfiado e catupiry',
        preco: 46.90,
        imagem: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&h=500&fit=crop',
        categoriaId: pizzasTrad.id,
      },
      {
        nome: 'Mussarela',
        descricao: 'Mussarela, tomate e oregano',
        preco: 38.90,
        imagem: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&h=500&fit=crop',
        categoriaId: pizzasTrad.id,
      },
    ],
  })

  // Pizzas especiais
  await prisma.produto.createMany({
    data: [
      {
        nome: 'Carne Seca com Catupiry',
        descricao: 'Carne seca desfiada, cebola caramelizada e catupiry',
        preco: 58.90,
        imagem: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=500&h=500&fit=crop',
        categoriaId: pizzasEsp.id,
      },
      {
        nome: 'Pepperoni',
        descricao: 'Mussarela e pepperoni',
        preco: 54.90,
        imagem: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=500&fit=crop',
        categoriaId: pizzasEsp.id,
      },
      {
        nome: 'Bacon',
        descricao: 'Mussarela, bacon, cheddar e cebola roxa',
        preco: 56.90,
        imagem: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&h=500&fit=crop',
        categoriaId: pizzasEsp.id,
      },
      {
        nome: 'Vegetariana',
        descricao: 'Mussarela, brocolis, palmito, milho e champignon',
        preco: 49.90,
        imagem: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=500&h=500&fit=crop',
        categoriaId: pizzasEsp.id,
      },
      {
        nome: 'Camarao',
        descricao: 'Mussarela, camarao, alho frito e catupiry',
        preco: 68.90,
        imagem: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop',
        categoriaId: pizzasEsp.id,
      },
    ],
  })

  // Pizzas doces
  await prisma.produto.createMany({
    data: [
      {
        nome: 'Chocolate',
        descricao: 'Chocolate ao leite com granulado',
        preco: 42.90,
        imagem: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=500&h=500&fit=crop',
        categoriaId: pizzasDoces.id,
      },
      {
        nome: 'Banana com Canela',
        descricao: 'Banana, acucar, canela e leite condensado',
        preco: 38.90,
        imagem: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=500&h=500&fit=crop',
        categoriaId: pizzasDoces.id,
      },
      {
        nome: 'Romeu e Julieta',
        descricao: 'Goiabada com mussarela',
        preco: 40.90,
        imagem: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=500&fit=crop',
        categoriaId: pizzasDoces.id,
      },
      {
        nome: 'Morango com Nutella',
        descricao: 'Nutella, morango e leite condensado',
        preco: 48.90,
        imagem: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop',
        categoriaId: pizzasDoces.id,
      },
      {
        nome: 'Prestigio',
        descricao: 'Chocolate com coco ralado',
        preco: 44.90,
        imagem: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=500&fit=crop',
        categoriaId: pizzasDoces.id,
      },
    ],
  })

  // Brotos
  await prisma.produto.createMany({
    data: [
      {
        nome: 'Broto Calabresa',
        descricao: 'Mini pizza de calabresa com cebola',
        preco: 24.90,
        imagem: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=500&fit=crop',
        categoriaId: brotos.id,
      },
      {
        nome: 'Broto Frango',
        descricao: 'Mini pizza de frango com catupiry',
        preco: 26.90,
        imagem: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&h=500&fit=crop',
        categoriaId: brotos.id,
      },
      {
        nome: 'Broto Mussarela',
        descricao: 'Mini pizza de mussarela',
        preco: 22.90,
        imagem: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&h=500&fit=crop',
        categoriaId: brotos.id,
      },
      {
        nome: 'Broto Chocolate',
        descricao: 'Mini pizza doce de chocolate',
        preco: 24.90,
        imagem: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=500&h=500&fit=crop',
        categoriaId: brotos.id,
      },
    ],
  })

  // Bebidas
  await prisma.produto.createMany({
    data: [
      {
        nome: 'Coca-Cola 2L',
        descricao: 'Refrigerante 2 litros',
        preco: 12.90,
        imagem: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=500&h=500&fit=crop',
        categoriaId: bebidas.id,
      },
      {
        nome: 'Guarana 2L',
        descricao: 'Refrigerante 2 litros',
        preco: 10.90,
        imagem: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=500&h=500&fit=crop',
        categoriaId: bebidas.id,
      },
      {
        nome: 'Suco de Laranja',
        descricao: 'Suco natural 1L',
        preco: 14.90,
        imagem: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&h=500&fit=crop',
        categoriaId: bebidas.id,
      },
      {
        nome: 'Agua 500ml',
        descricao: 'Agua mineral sem gas',
        preco: 4.90,
        imagem: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500&h=500&fit=crop',
        categoriaId: bebidas.id,
      },
      {
        nome: 'Heineken 600ml',
        descricao: 'Cerveja long neck',
        preco: 15.90,
        imagem: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&h=500&fit=crop',
        categoriaId: bebidas.id,
      },
    ],
  })

  // Sobremesas
  await prisma.produto.createMany({
    data: [
      {
        nome: 'Petit Gateau',
        descricao: 'Bolinho de chocolate com sorvete',
        preco: 22.90,
        imagem: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=500&fit=crop',
        categoriaId: sobremesas.id,
      },
      {
        nome: 'Brownie',
        descricao: 'Brownie com sorvete e calda',
        preco: 19.90,
        imagem: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=500&h=500&fit=crop',
        categoriaId: sobremesas.id,
      },
      {
        nome: 'Acai 500ml',
        descricao: 'Acai com granola e banana',
        preco: 24.90,
        imagem: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500&h=500&fit=crop',
        categoriaId: sobremesas.id,
      },
    ],
  })

  const totalCat = await prisma.categoria.count()
  const totalProd = await prisma.produto.count()
  const totalBanner = await prisma.banner.count()

  console.log(`Pronto! ${totalBanner} banners, ${totalCat} categorias, ${totalProd} produtos`)
}

main()
  .catch((e) => {
    console.error('Erro:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
