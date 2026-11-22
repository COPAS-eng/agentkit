# AgentKit

Catalogo de skills, servidores MCP e prompts para agentes de IA.

## Stack
- Next.js (App Router), React, TypeScript
- Tailwind CSS
- localStorage persistence (prototipo sem backend)
- Vitest + React Testing Library

## Comandos
- `npm install` — instalar dependências
- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção
- `npm test` — executar testes

## Persistência
O MVP usa `localStorage` do navegador. Não há backend; dados são mantidos localmente por dispositivo. Isso é uma limitação intencional do protótipo e deve ser explicitada na interface.

## Convenções
- Componentes em `src/components`, páginas em `src/app`, tipos em `src/lib/types.ts`, store em `src/lib/store.ts`, i18n em `src/lib/i18n.ts`.
- Idiomas: português (padrão) e inglês.
- Conteúdo de demonstração é identificado como tal, nunca como recurso verificado.
