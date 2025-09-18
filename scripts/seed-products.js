const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedProducts() {
  try {
    console.log('🌱 Iniciando seed de produtos...');

    // Criar categorias
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: 'eletronicos' },
        update: {},
        create: {
          name: 'Eletrônicos',
          slug: 'eletronicos',
          description: 'Produtos eletrônicos e tecnologia',
          isActive: true,
        },
      }),
      prisma.category.upsert({
        where: { slug: 'roupas' },
        update: {},
        create: {
          name: 'Roupas',
          slug: 'roupas',
          description: 'Vestuário e acessórios',
          isActive: true,
        },
      }),
      prisma.category.upsert({
        where: { slug: 'casa-jardim' },
        update: {},
        create: {
          name: 'Casa e Jardim',
          slug: 'casa-jardim',
          description: 'Produtos para casa e jardim',
          isActive: true,
        },
      }),
      prisma.category.upsert({
        where: { slug: 'esportes' },
        update: {},
        create: {
          name: 'Esportes',
          slug: 'esportes',
          description: 'Artigos esportivos e fitness',
          isActive: true,
        },
      }),
    ]);

    console.log('✅ Categorias criadas:', categories.length);

    // Criar produtos
    const products = [
      // Eletrônicos
      {
        title: 'Smartphone Samsung Galaxy S24',
        slug: 'smartphone-samsung-galaxy-s24',
        sku: 'SAMSUNG-S24-128GB',
        description: 'Smartphone Samsung Galaxy S24 com 128GB, tela de 6.2" e câmera tripla de 50MP',
        price: 299900, // R$ 2.999,00
        categoryId: categories[0].id,
        tags: ['smartphone', 'samsung', 'android'],
        isActive: true,
      },
      {
        title: 'Notebook Dell Inspiron 15',
        slug: 'notebook-dell-inspiron-15',
        sku: 'DELL-INSPIRON-15-512GB',
        description: 'Notebook Dell Inspiron 15 com Intel i5, 8GB RAM e SSD 512GB',
        price: 249900, // R$ 2.499,00
        categoryId: categories[0].id,
        tags: ['notebook', 'dell', 'intel'],
        isActive: true,
      },
      {
        title: 'Fone de Ouvido Bluetooth Sony WH-1000XM4',
        slug: 'fone-bluetooth-sony-wh1000xm4',
        sku: 'SONY-WH1000XM4',
        description: 'Fone de ouvido Bluetooth Sony WH-1000XM4 com cancelamento de ruído',
        price: 129900, // R$ 1.299,00
        categoryId: categories[0].id,
        tags: ['fone', 'bluetooth', 'sony'],
        isActive: true,
      },

      // Roupas
      {
        title: 'Camiseta Polo Masculina',
        slug: 'camiseta-polo-masculina',
        sku: 'POLO-MASCULINA-M',
        description: 'Camiseta polo masculina em algodão, disponível em várias cores',
        price: 8900, // R$ 89,00
        categoryId: categories[1].id,
        tags: ['camiseta', 'polo', 'masculino'],
        isActive: true,
      },
      {
        title: 'Vestido Floral Feminino',
        slug: 'vestido-floral-feminino',
        sku: 'VESTIDO-FLORAL-P',
        description: 'Vestido floral feminino em tecido leve e confortável',
        price: 12900, // R$ 129,00
        categoryId: categories[1].id,
        tags: ['vestido', 'floral', 'feminino'],
        isActive: true,
      },
      {
        title: 'Tênis Nike Air Max',
        slug: 'tenis-nike-air-max',
        sku: 'NIKE-AIRMAX-42',
        description: 'Tênis Nike Air Max com tecnologia de amortecimento',
        price: 39900, // R$ 399,00
        categoryId: categories[1].id,
        tags: ['tenis', 'nike', 'esporte'],
        isActive: true,
      },

      // Casa e Jardim
      {
        title: 'Aspirador de Pó Electrolux',
        slug: 'aspirador-po-electrolux',
        sku: 'ELECTROLUX-ASPIRADOR',
        description: 'Aspirador de pó Electrolux com filtro HEPA e múltiplas funções',
        price: 29900, // R$ 299,00
        categoryId: categories[2].id,
        tags: ['aspirador', 'electrolux', 'limpeza'],
        isActive: true,
      },
      {
        title: 'Kit de Panelas Antiaderente',
        slug: 'kit-panelas-antiaderente',
        sku: 'KIT-PANELAS-5PCS',
        description: 'Kit com 5 panelas antiaderente de diferentes tamanhos',
        price: 18900, // R$ 189,00
        categoryId: categories[2].id,
        tags: ['panelas', 'cozinha', 'antiaderente'],
        isActive: true,
      },
      {
        title: 'Vaso Decorativo Cerâmica',
        slug: 'vaso-decorativo-ceramica',
        sku: 'VASO-CERAMICA-30CM',
        description: 'Vaso decorativo em cerâmica para plantas e decoração',
        price: 4500, // R$ 45,00
        categoryId: categories[2].id,
        tags: ['vaso', 'decorativo', 'ceramica'],
        isActive: true,
      },

      // Esportes
      {
        title: 'Bicicleta Mountain Bike',
        slug: 'bicicleta-mountain-bike',
        sku: 'BIKE-MOUNTAIN-21V',
        description: 'Bicicleta mountain bike com 21 velocidades e suspensão dianteira',
        price: 89900, // R$ 899,00
        categoryId: categories[3].id,
        tags: ['bicicleta', 'mountain', 'esporte'],
        isActive: true,
      },
      {
        title: 'Kit Halteres Ajustáveis',
        slug: 'kit-halteres-ajustaveis',
        sku: 'HALTERES-AJUSTAVEIS-20KG',
        description: 'Kit de halteres ajustáveis de 2x10kg para musculação',
        price: 19900, // R$ 199,00
        categoryId: categories[3].id,
        tags: ['halteres', 'musculacao', 'fitness'],
        isActive: true,
      },
      {
        title: 'Esteira Elétrica 2.5HP',
        slug: 'esteira-eletrica-2-5hp',
        sku: 'ESTEIRA-ELETRICA-2.5HP',
        description: 'Esteira elétrica com motor 2.5HP e inclinação ajustável',
        price: 129900, // R$ 1.299,00
        categoryId: categories[3].id,
        tags: ['esteira', 'eletrica', 'cardio'],
        isActive: true,
      },
    ];

    // Criar produtos no banco
    for (const productData of products) {
      const product = await prisma.product.upsert({
        where: { slug: productData.slug },
        update: {},
        create: {
          title: productData.title,
          slug: productData.slug,
          description: productData.description,
          status: productData.isActive ? 'ACTIVE' : 'DRAFT',
        },
      });

      // Criar categoria do produto
      await prisma.productCategory.upsert({
        where: {
          productId_categoryId: {
            productId: product.id,
            categoryId: productData.categoryId,
          },
        },
        update: {},
        create: {
          productId: product.id,
          categoryId: productData.categoryId,
        },
      });

      // Criar variante principal do produto
      await prisma.productVariant.upsert({
        where: { sku: productData.sku },
        update: {},
        create: {
          productId: product.id,
          sku: productData.sku,
          attributes: { default: true },
          priceCents: productData.price,
          inventoryQty: Math.floor(Math.random() * 100) + 10, // estoque aleatório entre 10-110
          isActive: productData.isActive,
        },
      });
    }

    console.log('✅ Produtos criados:', products.length);

    // Criar algumas variantes de produtos
    const smartphone = await prisma.product.findFirst({
      where: { slug: 'smartphone-samsung-galaxy-s24' },
    });

    if (smartphone) {
      await prisma.productVariant.createMany({
        data: [
          {
            productId: smartphone.id,
            sku: 'SAMSUNG-S24-128GB-PRETO',
            priceCents: 299900,
            inventoryQty: 50,
            attributes: { color: 'Preto', storage: '128GB' },
          },
          {
            productId: smartphone.id,
            sku: 'SAMSUNG-S24-128GB-BRANCO',
            priceCents: 299900,
            inventoryQty: 30,
            attributes: { color: 'Branco', storage: '128GB' },
          },
          {
            productId: smartphone.id,
            sku: 'SAMSUNG-S24-256GB-PRETO',
            priceCents: 329900,
            inventoryQty: 25,
            attributes: { color: 'Preto', storage: '256GB' },
          },
        ],
      });
    }

    console.log('✅ Variantes criadas para smartphone');

    console.log('🎉 Seed concluído com sucesso!');
    console.log(`📊 Total: ${categories.length} categorias, ${products.length} produtos`);

  } catch (error) {
    console.error('❌ Erro no seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts();
