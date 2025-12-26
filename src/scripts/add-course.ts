#!/usr/bin/env ts-node

import * as readline from 'readline';
import { CourseService } from '../services/course.service';
import { CreateCourseDTO } from '../types/course.types';
import { runMigrations } from '../database/migrations/run';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function addCourse() {
  try {
    console.log('\n🎓 Cadastro de Novo Curso\n');
    console.log('Preencha as informações solicitadas:\n');

    // Executar migrações se necessário
    try {
      await runMigrations();
    } catch (error) {
      console.warn('⚠️  Aviso ao executar migrações:', error);
    }

    // ID do produto Hotmart
    const hotmartProductId = await question('📦 ID do produto na Hotmart: ');
    if (!hotmartProductId.trim()) {
      console.error('❌ ID do produto é obrigatório!');
      rl.close();
      process.exit(1);
    }

    // Nome do curso
    const name = await question('📚 Nome do curso: ');
    if (!name.trim()) {
      console.error('❌ Nome do curso é obrigatório!');
      rl.close();
      process.exit(1);
    }

    // Prompt OpenAI
    console.log('\n💬 Prompt para OpenAI (use {nome}, {curso}, {email}, {telefone}, {link}):');
    console.log('Exemplo: "Olá {nome}! Notamos que você estava interessado no {curso}. Finalize sua compra: {link}"\n');
    const openaiPrompt = await question('Prompt: ');
    if (!openaiPrompt.trim()) {
      console.error('❌ Prompt é obrigatório!');
      rl.close();
      process.exit(1);
    }

    // Link de compra (opcional)
    const purchaseLink = await question('🔗 Link de compra (opcional, pode deixar em branco): ');

    // Template de mensagem (opcional)
    console.log('\n📝 Template de mensagem WhatsApp (opcional, usado como fallback se OpenAI falhar):');
    const template = await question('Template (pressione Enter para pular): ');

    // Curso ativo?
    const activeStr = await question('✅ Curso ativo? (s/n, padrão: s): ');
    const active = activeStr.toLowerCase() !== 'n';

    // Criar objeto de dados
    const courseData: CreateCourseDTO = {
      hotmart_product_id: hotmartProductId.trim(),
      name: name.trim(),
      openai_prompt: openaiPrompt.trim(),
      active,
    };

    if (purchaseLink.trim()) {
      courseData.purchase_link = purchaseLink.trim();
    }

    if (template.trim()) {
      courseData.whatsapp_message_template = template.trim();
    }

    // Confirmar
    console.log('\n📋 Resumo do curso:');
    console.log(`   ID Hotmart: ${courseData.hotmart_product_id}`);
    console.log(`   Nome: ${courseData.name}`);
    console.log(`   Link: ${courseData.purchase_link || 'Não informado'}`);
    console.log(`   Ativo: ${courseData.active ? 'Sim' : 'Não'}`);
    
    const confirm = await question('\n✅ Confirmar criação? (s/n): ');
    if (confirm.toLowerCase() !== 's') {
      console.log('❌ Cadastro cancelado.');
      rl.close();
      process.exit(0);
    }

    // Criar curso
    console.log('\n⏳ Criando curso...');
    const course = await CourseService.createCourse(courseData);

    console.log('\n✅ Curso criado com sucesso!');
    console.log(`   ID: ${course.id}`);
    console.log(`   Nome: ${course.name}`);
    console.log(`   Hotmart Product ID: ${course.hotmart_product_id}`);
    console.log(`   Ativo: ${course.active ? 'Sim' : 'Não'}`);

    rl.close();
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Erro ao criar curso:', error.message);
    if (error.message.includes('já existe')) {
      console.error('   💡 Um curso com este hotmart_product_id já existe.');
    }
    rl.close();
    process.exit(1);
  }
}

// Executar
addCourse();

