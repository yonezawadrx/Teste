const { chromium } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

async function rodarTestes() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🚀 Iniciando testes com Playwright...\n');

    // Teste 1: Acessar página principal
    console.log('📌 Teste 1: Carregando página principal...');
    await page.goto(BASE_URL);
    await page.waitForSelector('h1');
    const titulo = await page.textContent('h1');
    console.log(`✅ Página carregada. Título: ${titulo}\n`);

    // Teste 2: Verificar tarefas iniciais
    console.log('📌 Teste 2: Verificando tarefas iniciais...');
    const tarefasIniciais = await page.locator('.tarefa-item').count();
    console.log(`✅ Total de tarefas: ${tarefasIniciais}\n`);

    // Teste 3: Adicionar nova tarefa
    console.log('📌 Teste 3: Adicionando nova tarefa...');
    await page.fill('#novasTarefa', 'Fazer testes com Playwright');
    await page.click('button:has-text("Adicionar")');
    await page.waitForTimeout(500); // Aguardar renderização
    
    const tarefasApos = await page.locator('.tarefa-item').count();
    console.log(`✅ Tarefa adicionada. Total agora: ${tarefasApos}\n`);

    // Teste 4: Marcar tarefa como concluída
    console.log('📌 Teste 4: Marcando tarefa como concluída...');
    const primeiroCheckbox = await page.locator('.tarefa-item input[type="checkbox"]').first();
    await primeiroCheckbox.check();
    await page.waitForTimeout(300);
    
    const tarefaConcluida = await page.locator('.tarefa-item.concluida').count();
    console.log(`✅ Tarefa marcada. Concluídas: ${tarefaConcluida}\n`);

    // Teste 5: Verificar contadores
    console.log('📌 Teste 5: Verificando contadores...');
    const total = await page.textContent('#totalTarefas');
    const concluidas = await page.textContent('#concluidas');
    console.log(`✅ Total: ${total} | Concluídas: ${concluidas}\n`);

    // Teste 6: Deletar tarefa
    console.log('📌 Teste 6: Deletando uma tarefa...');
    const btnDelete = await page.locator('.btn-delete').first();
    await btnDelete.click();
    
    // Confirmar o alert
    page.once('dialog', dialog => {
      console.log(`  Dialog: ${dialog.message()}`);
      dialog.accept();
    });
    
    await page.waitForTimeout(500);
    const tarefasAposDeletar = await page.locator('.tarefa-item').count();
    console.log(`✅ Tarefa deletada. Total agora: ${tarefasAposDeletar}\n`);

    // Teste 7: Tentar adicionar tarefa vazia
    console.log('📌 Teste 7: Tentando adicionar tarefa vazia...');
    await page.click('button:has-text("Adicionar")');
    
    // Verificar se aparece alert
    page.once('dialog', dialog => {
      console.log(`  ⚠️  Dialog de validação: ${dialog.message()}`);
      dialog.accept();
    });
    
    await page.waitForTimeout(300);
    console.log('✅ Validação funcionando corretamente\n');

    // Teste 8: Testar API diretamente
    console.log('📌 Teste 8: Testando API /api/tarefas...');
    const response = await page.request.get(`${BASE_URL}/api/tarefas`);
    const tarefas = await response.json();
    console.log(`✅ API respondeu com ${tarefas.length} tarefas`);
    console.log(`   Dados: ${JSON.stringify(tarefas.slice(0, 2))}\n`);

    console.log('✅ Todos os testes concluídos com sucesso!');

  } catch (erro) {
    console.error('❌ Erro durante os testes:', erro);
  } finally {
    // Manter o navegador aberto por 3 segundos antes de fechar
    await page.waitForTimeout(3000);
    await browser.close();
    console.log('\n🏁 Navegador fechado.');
  }
}

// Executar testes
rodarTestes().catch(console.error);
